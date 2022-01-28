import juice from 'juice';
import { Compiler, Options } from './types/emgen';
import { Logger } from './logger';
import { File } from './file';
import { DeepRequired } from './types/extra';
import { importGlobalStyles, preprocessStyles } from './util';
import * as Path from 'path';

export const useDefaultCompiler = (config: DeepRequired<Options>): Compiler => {
  /**
   * Adds includes to template.
   *
   * @param template
   */
  const addIncludes = (template: string): string => {
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
          `${config.input.includes.dir}/${filename}`
        );

        template = template.replace(comment, include);
        return addIncludes(template);
      } catch (error) {
        Logger.error(`Referenced include ${filename} was not found.`);
      }
    }

    return template;
  };

  /**
   * Compiles a single template at path.
   *
   * @param path
   * @param styles Optionally provide the style string. Styles will be created if missing.
   */
  const compileTemplate = async (
    path: string,
    styles?: string
  ): Promise<void> => {
    Logger.info('Generating template:', path);
    let template = File.readFile(path);

    if (!styles) {
      styles = await preprocessStyles(
        await importGlobalStyles(config.input.styles.dir)
      );
    }

    template = addIncludes(template);

    try {
      template = juice(template, { extraCss: styles, removeStyleTags: false }); // Inlines styles into HTML.
    } catch (error) {
      Logger.error(
        'Unable to inline CSS. If you are writing your styles in e.g. Sass, make sure to define it in Emgen configuration.'
      );
    }

    const name = path.substring(
      path.indexOf(Path.normalize(config.input.templates.dir)) +
        Path.normalize(config.input.templates.dir).length +
        1
    );

    path = Path.normalize(config.output.dir + '/' + name);

    Logger.info('Writing to:', path);
    File.writeFile(path, template);
  };

  /**
   * Compiles all templates in provided directory.
   *
   * @param directory
   */
  const compile = async (directory: string) => {
    const styles = await preprocessStyles(
      await importGlobalStyles(config.input.styles.dir)
    );

    const paths = File.getFilesRecursively(directory);
    paths.forEach((path) => {
      compileTemplate(path, styles);
    });
  };

  return {
    compile,
    compileTemplate,
    render: () => {
      throw new Error('Render is not available when using default compiler.');
    }
  };
};
