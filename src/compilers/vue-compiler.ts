import Path from 'path';
import juice from 'juice';
import {
  CreateAppFunction,
  ConcreteComponent,
  App,
  Component,
  VueElementConstructor,
  FunctionalComponent,
  AppContext
} from 'vue';
import { SFCParseOptions, SFCParseResult } from '@vue/compiler-sfc';
import { BaseCompiler } from './base-compiler';
import { File } from '../file';
import { Logger } from '../logger';
import { DeepRequired } from '../types/extra';
import { EmgenOptions, RenderOptions } from '../types/emgen';

export class VueCompiler extends BaseCompiler {
  private createSSRApp: CreateAppFunction<Element>;
  private parse: (
    source: string,
    {
      sourceMap,
      filename,
      sourceRoot,
      pad,
      ignoreEmpty,
      compiler
    }?: SFCParseOptions
  ) => SFCParseResult;
  private renderToString: any;
  private i18n: any;
  private transpile: any;

  constructor(config: DeepRequired<EmgenOptions>) {
    super(config);

    this.dependencies.push({ name: '@vue/compiler-sfc', version: '3.2.0' });
    this.dependencies.push({ name: 'vue', version: '3.2.0' });
    if (this.config.transpile) {
      this.dependencies.push({ name: 'typescript', version: '4.0.0' });
    }
    if (this.config.i18n) {
      this.dependencies.push({ name: 'vue-i18n', version: '9.0.0' });
    }

    this.checkDependencies();

    this.createSSRApp = this.importDependency('vue').createSSRApp;
    this.parse = this.importDependency('@vue/compiler-sfc').parse;
    this.renderToString = this.importDependency(
      '@vue/server-renderer'
    ).renderToString;

    if (this.config.transpile) {
      this.transpile = this.importDependency('typescript').transpile;
    }
    if (this.config.i18n) {
      this.i18n = this.importDependency('vue-i18n');
    }
  }

  public compile(directory: string): void {
    directory = directory || this.config.input.templates.dir;
    const files = File.getFilesRecursively(directory);
    Logger.info(`Converting ${files.length} Vue SFCs...`);

    for (const path of files) {
      this.compileTemplate(path);
    }
  }

  public compileTemplate(path: string): void {
    path = Path.normalize(path);
    const component = this.convertSFC(path);

    const name = path.substring(
      path.indexOf(Path.normalize(this.config.input.templates.dir)) +
        Path.normalize(this.config.input.templates.dir).length +
        1
    );

    path = Path.normalize(
      this.config.output.dir + '/' + name.replace('.vue', '.js')
    );

    Logger.info('Writing to:', path);

    File.writeFile(path, component);
  }

  private convertSFC(path: string): string {
    const COMPONENT_START = 'export default defineComponent({';

    let data;

    try {
      data = File.readFile(path);
    } catch (error) {
      throw new Error();
    }

    const parsed = this.parse(data);
    if (!parsed.descriptor) {
      throw new Error();
    }

    const t = parsed.descriptor.template;
    let template = t?.content;
    if (!template) {
      template = '';
    }

    template = template
      .replace(/[\n\r]/gi, ' ')
      .replace(/"/gi, '\\"')
      .replace(/\s\s+/gi, ' ');

    const x = parsed.descriptor.styles
      .map((s) => s.content)
      .join('\n\n')
      .replace(/[\n\r]/gi, '')
      .replace(/"/gi, '\\"')
      .replace(/\s\s+/gi, '');

    const b = `\nstyle: "${x}",\n`;
    template = `\ntemplate: "${template}",\n`;

    const s = parsed.descriptor.script;
    let script = s?.content;
    if (!script) {
      script = '';
    }

    const position = script.indexOf(COMPONENT_START) + COMPONENT_START.length;
    let component =
      script.substring(0, position) + template + script.substring(position);

    component =
      component.substring(0, position + template.length) +
      b +
      script.substring(position);

    component = component.replaceAll(`.vue'`, `'`);

    if (this.config.transpile && component) {
      component = this.transpile(component) as string;
    }

    return component;
  }

  public async render(name: string, options?: RenderOptions): Promise<string> {
    type EmComponent = {
      components: Record<string, EmComponent>;
      style?: string;
      extends?: EmComponent;
      template?: string;
    };

    const component: EmComponent = (
      await require(`${this.config.output.dir}/${name}`)
    ).default;

    const app: App = this.createSSRApp(component, options?.props);

    const locale = options?.locale || this.config.i18n?.defaultLocale;
    if (locale) {
      app.use(
        this.i18n.createI18n({
          fallbackLocale: this.config.i18n?.defaultLocale,
          messages: options?.translations || this.config.i18n?.translations,
          locale: locale,
          silentFallbackWarn: true,
          silentTranslationWarn: true
        })
      );

      app.config.globalProperties.$t = (...args: unknown[]) => {
        const { t } = this.i18n.useI18n();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return t(...args);
      };
    }

    let appContent = await this.renderToString(app);

    let style = await this.importGlobalStyles(this.config.input.styles.dir); // Global style.

    style = `.null{color:unset}\n` + style; // Juice has trouble working with @import and skips first CSS rule. Therefore we add a first rule.
    style = style + component.style;

    const addExtendStyle = (component: EmComponent) => {
      if (component.extends) {
        style = style + component.extends.style;
        if (component.extends.extends) {
          addExtendStyle(component.extends);
        }
      }
    };

    addExtendStyle(component);

    const addComponentStyle = (component: EmComponent) => {
      if (component.components) {
        for (const [, c] of Object.entries(component.components)) {
          style += c.style;
          if (c.components) {
            addComponentStyle(c);
          }
        }
      }
    };

    addComponentStyle(component);

    style = await this.preprocessStyles(
      style,
      this.config.input.styles.preprocessor
    );

    try {
      appContent = juice(appContent, {
        extraCss: style,
        removeStyleTags: false
      });
    } catch (error) {
      Logger.error(
        'Unable to inline CSS. If you are writing your styles in e.g. Sass, make sure to define it in Emgen configuration.'
      );
    }

    return appContent;
  }
}
