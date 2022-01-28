import { Preprocessor } from './types/emgen';
import { File } from './file';
import { Logger } from './logger';

/**
 * Searches for styles in configured directory.
 * Preprocesses stylesheets if configured.
 *
 * @param directory
 * @param preprocessor
 */
export async function importGlobalStyles(directory: string): Promise<string> {
  let styles: string;
  try {
    styles = File.getFilesRecursively(directory)
      .map((path) => File.readFile(path))
      .join('\n\n'); // \n\n required for stylus.
  } catch (error) {
    Logger.info('No styles directory found, skipping...');
    return '';
  }

  Logger.info('Created styles', styles);

  return styles;
}

/**
 * Preprocesses stylesheets with the configured preprocessor.
 * Preprocessors are not installed as dependencies of Emgen.
 *
 * @param styles
 * @param preprocessor
 */
export async function preprocessStyles(
  styles: string,
  preprocessor?: `${Preprocessor}`
): Promise<string> {
  if (!preprocessor) {
    return styles;
  }
  /**
   * Imports a preprocessor library.
   *
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
