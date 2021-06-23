import { Options, Preprocessor } from './types/emgen';
import { DeepRequired } from './types/extra';

import juice from 'juice';
import { File } from './file';

import { Config } from './config';
import { Logger } from './logger';

export class Emgen {
  public config: DeepRequired<Options>;

  /**
   * Creates a new instance of Emgen.
   * @param options
   */
  constructor(options: Options) {
    Logger.setVerbose(options.verbose);

    Config.validate(options);
    this.config = Config.init(options || {});
    if (this.config.verbose) {
      Logger.info(
        'Additional logging will be printed. You can disable this by setting { verbose: false }.'
      );
    }
    Logger.info('Configuration:', JSON.stringify(this.config));

    if (this.config.output.auto) {
      this.generateTemplates(this.config.input.templates.dir);
    }
  }

  /**
   * Generates all templates in provided directory.
   * @param directory
   */
  public async generateTemplates(directory: string): Promise<void> {
    const styles = await this.createStyles();

    const paths = File.getFilesRecursively(directory);
    paths.forEach((path) => {
      this.generateTemplate(path, styles);
    });
  }

  /**
   * Generates a single template at path.
   * @param path
   * @param styles Optionally provide the style string. Styles will be created if missing.
   */
  public async generateTemplate(path: string, styles?: string): Promise<void> {
    Logger.info('Generating template:', path);
    let template = File.readFile(path);

    if (!styles) {
      styles = await this.createStyles();
    }

    template = this.addIncludes(template);
    template = juice(template, { extraCss: styles, removeStyleTags: false }); // Inlines styles into HTML.

    path = path.replace(
      this.config.input.templates.dir,
      this.config.output.dir
    );

    Logger.info('Writing to:', path);
    File.writeFile(path, template);
  }

  /**
   * Adds includes to template.
   * @param template
   */
  private addIncludes(template: string): string {
    const index = template.indexOf('#include');
    if (index !== -1) {
      const startIndex = template.substring(0, index).lastIndexOf('<!--');
      const endIndex =
        template.substring(startIndex, template.length).indexOf('-->') +
        startIndex +
        '-->'.length;
      const comment = template.substring(startIndex, endIndex).trim();

      const segments = comment.split(' ');
      const filename =
        segments[segments.findIndex((word) => word === '#include') + 1];

      const include = File.readFile(
        `${this.config.input.includes.dir}/${filename}`
      );

      template = template.replace(comment, include);
      return this.addIncludes(template);
    }

    return template;
  }

  /**
   * Searches for styles in configured directory.
   * Preprocesses stylesheets if configured.
   */
  private async createStyles(): Promise<string> {
    let styles = File.getFilesRecursively(this.config.input.styles.dir)
      .map((path) => File.readFile(path))
      .join('\n\n'); // \n\n required for stylus.

    if (this.config.input.styles.preprocessor) {
      styles = await this.preprocessStyles(styles);
    }

    Logger.info('Created styles', styles);

    return styles;
  }

  /**
   * Preprocesses stylesheets with the configured preprocessor.
   * Preprocessors are not installed as dependencies of Emgen.
   * @param styles
   */
  private async preprocessStyles(styles: string): Promise<string> {
    const preprocessor = this.config.input.styles.preprocessor;

    /**
     * Imports a preprocessor library.
     * @param lib
     */
    const importPreprocessor = (lib: string) => {
      Logger.info(`Importing dependency '${lib}'...`);
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const dep = require(lib);
        Logger.info(`Found '${lib}'. Rendering...`);
        return dep;
      } catch (error) {
        if (
          error instanceof Error &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).code === 'MODULE_NOT_FOUND'
        ) {
          Logger.error(
            `Dependency '${lib}' is missing. Preprocessor dependencies are not installed by default. To install ${lib}, use:\n npm i ${lib}`
          );
        } else {
          throw error;
        }
      }
    };

    switch (preprocessor) {
      case Preprocessor.Sass:
        return importPreprocessor('sass')
          .renderSync({ data: styles })
          .css.toString();
      case Preprocessor.Less:
        return (await importPreprocessor('less').render(styles, {})).css;
      case Preprocessor.Stylus:
        return importPreprocessor('stylus')(styles).render();
      default:
        throw Error(`Unknown preprocessor '${preprocessor}'.`);
    }
  }
}

export * from './types/emgen';
