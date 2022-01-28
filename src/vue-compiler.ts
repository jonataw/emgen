import { createSSRApp } from 'vue';
import { parse } from '@vue/compiler-sfc';
import { renderToString } from '@vue/server-renderer';

import { Compiler, Options, RenderOptions } from './types/emgen';
import { Logger } from './logger';
import { File } from './file';
import { DeepRequired } from './types/extra';
import { createI18n, useI18n } from 'vue-i18n';
import juice from 'juice';
import { importGlobalStyles, preprocessStyles } from './util';
import * as Path from 'path';

export const useVueCompiler = (config: DeepRequired<Options>): Compiler => {
  const compile = (directory: string) => {
    directory = directory || config.input.templates.dir;
    const files = File.getFilesRecursively(directory);
    Logger.info(`Converting ${files.length} Vue SFCs...`);

    for (const path of files) {
      compileTemplate(path);
    }
  };

  const compileTemplate = (path: string) => {
    path = Path.normalize(path);
    const component = convertSFC(path);

    const name = path.substring(
      path.indexOf(Path.normalize(config.input.templates.dir)) +
        Path.normalize(config.input.templates.dir).length +
        1
    );

    path = Path.normalize(
      config.output.dir + '/' + name.replace('.vue', '.js')
    );

    Logger.info('Writing to:', path);

    File.writeFile(path, component);
  };

  const convertSFC = (path: string): string => {
    const COMPONENT_START = 'export default defineComponent({';

    let data;

    try {
      data = File.readFile(path);
    } catch (error) {
      throw new Error();
    }

    const parsed = parse(data);
    if (!parsed.descriptor) {
      throw new Error();
    }

    const t = parsed.descriptor.template;
    let template = t?.content;
    if (!template) {
      template = '';
    }

    template = template
      .replace(/[\n\r]/gi, '')
      .replace(/"/gi, '\\"')
      .replace(/\s\s+/gi, '');

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

    if (config.transpile && component) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const dep = require('typescript');
        component = dep.transpile(component) as string;
      } catch (error) {
        Logger.error(`You need to have package 'typescript' installed.`);
        throw new Error();
      }
    }

    return component;
  };

  const render = async (
    name: string,
    options?: RenderOptions
  ): Promise<string> => {
    const component = (await import(`${config.output.dir}/${name}`)).default;

    const app = createSSRApp(component, options?.props);

    const locale = options?.locale || config.i18n?.defaultLocale;
    if (locale) {
      app.use(
        createI18n({
          fallbackLocale: config.i18n?.defaultLocale,
          messages: options?.translations || config.i18n?.translations,
          locale: locale,
          silentFallbackWarn: true,
          silentTranslationWarn: true
        })
      );

      app.config.globalProperties.$t = (...args: unknown[]) => {
        const { t } = useI18n();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return t(...args);
      };
    }

    let appContent = await renderToString(app);

    let style = await importGlobalStyles(config.input.styles.dir); // Global style.

    style = style + component.style;

    if (component.components) {
      style =
        style +
        Object.entries(component.components)
          .map(([_key, value]) => {
            return (value as any).style;
          })
          .join('\n');
    }

    style = await preprocessStyles(style, config.input.styles.preprocessor);

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
  };

  return { compile, compileTemplate, render };
};
