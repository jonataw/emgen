import { File } from '../file';
import { Logger } from '../logger';
import {
  DependencyList,
  EmgenOptions,
  Preprocessor,
  RenderOptions
} from '../types/emgen';
import { DeepRequired } from '../types/extra';

class RequiredDependencyNotFoundException extends Error {
  constructor() {
    super();

    Logger.error(
      'One or more dependencies are missing. Please see additional log output above.'
    );

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RequiredDependencyNotFoundException.prototype);
  }
}

export abstract class BaseCompiler {
  public config: DeepRequired<EmgenOptions>;
  protected dependencies: DependencyList;

  constructor(config: DeepRequired<EmgenOptions>) {
    this.config = config;
    this.dependencies = [];

    if (config.input.styles.preprocessor) {
      let version;

      switch (config.input.styles.preprocessor) {
        case 'sass':
          version = '1.45.0';
          break;
        case 'less':
          version = '4.0.0';
          break;
        case 'stylus':
          version = '0.54.0';
          break;
      }

      this.dependencies.push({
        name: config.input.styles.preprocessor,
        version
      });
    }
  }

  /**
   * Compiles all templates in provided directory.
   *
   * @deprecated Use compile instead.
   * @param directory
   */
  public generateTemplates(directory: string): void {
    return this.compile(directory);
  }

  /**
   * Compiles a single template at path.
   *
   * @deprecated Use compileTemplate instead.
   * @param path
   * @param styles
   */
  public generateTemplate(path: string, styles?: string): void {
    return this.compileTemplate(path, styles);
  }

  /**
   * Compiles all templates in provided directory.
   *
   * @param directory
   */
  public abstract compile(directory: string): void;

  /**
   * Compiles a single template at path.
   *
   * @param path
   * @param styles Optionally provide global styles. If styles are not provided, they will be automatically imported as defined in configuration.
   */
  public abstract compileTemplate(
    path: string,
    styles?: string | undefined
  ): void;

  /**
   * Renders a compiled template.
   * Only available if using the Vue compiler.
   *
   * @param name Name of the template (filename).
   * @param options optional [RenderOptions](https://jonataw.github.io/emgen/usage-vue#renderoptions).
   */
  public abstract render(
    name: string,
    options?: RenderOptions | undefined
  ): Promise<string>;

  /**
   * Searches for styles in configured directory.
   * Preprocesses stylesheets if configured.
   *
   * @param directory
   * @param preprocessor
   */
  protected async importGlobalStyles(directory: string): Promise<string> {
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
  protected async preprocessStyles(
    styles: string,
    preprocessor?: `${Preprocessor}`
  ): Promise<string> {
    if (!preprocessor) {
      return styles;
    }

    switch (preprocessor) {
      case Preprocessor.Sass:
        return this.importDependency('sass')
          .renderSync({ data: styles })
          .css.toString();
      case Preprocessor.Less:
        return (await this.importDependency('less').render(styles, {})).css;
      case Preprocessor.Stylus:
        return this.importDependency('stylus')(styles).render();
      default:
        throw Error(`Unknown preprocessor '${preprocessor}'.`);
    }
  }

  /**
   * Checks that all required dependencies are installed according to configuration.
   */
  protected checkDependencies(): void {
    Logger.info('Checking dependencies...');
    let n = 0;
    for (const dependency of this.dependencies) {
      try {
        require(dependency.name);
      } catch (error) {
        n++;
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).code === 'MODULE_NOT_FOUND'
        ) {
          Logger.error(
            `Missing dependency '${dependency.name}'. Please install with 'npm i ${dependency.name}@">${dependency.version}"'.`
          );
        } else {
          throw error;
        }
      }
    }
    if (n > 0) throw new RequiredDependencyNotFoundException();
  }

  /**
   * Imports a dependency.
   *
   * @param lib
   */
  protected importDependency(lib: string): any {
    Logger.info(`Importing dependency '${lib}'...`);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dep = require(lib);
    return dep;
  }
}
