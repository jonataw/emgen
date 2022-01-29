import Path from 'path';
import juice from 'juice';
import { File } from '../file';
import { Logger } from '../logger';
import { BaseCompiler } from './base-compiler';
import { EmgenOptions } from '../types/emgen';
import { DeepRequired } from '../types/extra';

export class DefaultCompiler extends BaseCompiler {
  constructor(config: DeepRequired<EmgenOptions>) {
    super(config);

    this.checkDependencies();
  }

  /**
   * Adds includes to template.
   *
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

      try {
        const include = File.readFile(
          `${this.config.input.includes.dir}/${filename}`
        );

        template = template.replace(comment, include);
        return this.addIncludes(template);
      } catch (error) {
        Logger.error(`Referenced include ${filename} was not found.`);
      }
    }

    return template;
  }

  /**
   * Compiles a single template at path.
   *
   * @param path
   * @param styles Optionally provide the style string. Styles will be created if missing.
   */
  public async compileTemplate(path: string, styles?: string): Promise<void> {
    Logger.info('Generating template:', path);
    let template = File.readFile(path);

    if (!styles) {
      styles = await this.preprocessStyles(
        await this.importGlobalStyles(this.config.input.styles.dir)
      );
    }

    template = this.addIncludes(template);

    try {
      template = juice(template, { extraCss: styles, removeStyleTags: false }); // Inlines styles into HTML.
    } catch (error) {
      Logger.error(
        'Unable to inline CSS. If you are writing your styles in e.g. Sass, make sure to define it in Emgen configuration.'
      );
    }

    const name = path.substring(
      path.indexOf(Path.normalize(this.config.input.templates.dir)) +
        Path.normalize(this.config.input.templates.dir).length +
        1
    );

    path = Path.normalize(this.config.output.dir + '/' + name);

    Logger.info('Writing to:', path);
    File.writeFile(path, template);
  }

  /**
   * Compiles all templates in provided directory.
   *
   * @param directory
   */
  public async compile(directory: string): Promise<void> {
    const styles = await this.preprocessStyles(
      await this.importGlobalStyles(this.config.input.styles.dir)
    );

    const paths = File.getFilesRecursively(directory);
    paths.forEach((path) => {
      this.compileTemplate(path, styles);
    });
  }

  public async render(): Promise<string> {
    throw new Error('Render is not available when using default compiler.');
  }
}
