import path from 'path';
import * as deepmerge from 'deepmerge';
import { Logger } from './logger';
import { Options, Preprocessor } from './types/emgen';
import { DeepRequired } from './types/extra';

class MissingConfigurationOptionError extends Error {
  constructor(missing: (keyof Options)[]) {
    super();

    Logger.error(
      'The following required configuration options are missing:',
      missing.join(', ')
    );

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MissingConfigurationOptionError.prototype);
  }
}

class UnknownPreprocessorError extends Error {
  constructor(preprocessor: string) {
    super();

    Logger.error(`Unknown preprocessor ${preprocessor} provided.`);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnknownPreprocessorError.prototype);
  }
}

export class Config {
  /**
   * Merges the default configuration options with the provided options.
   * @param options
   */
  public static init(options: Options): DeepRequired<Options> {
    return deepmerge.all<Options>([
      {
        dir: options.dir,
        verbose: false,
        input: {
          templates: { dir: path.join(options.dir, 'templates') },
          includes: { dir: path.join(options.dir, 'includes') },
          styles: { dir: path.join(options.dir, 'styles') }
        },
        output: { auto: true, dir: path.join(options.dir, 'output'), flatten: true }
      } as Options,
      options
    ]) as DeepRequired<Options>;
  }

  /**
   * Validates the configuration object.
   * @param config
   */
  public static validate(config: DeepRequired<Options>): void {
    Logger.info('Validating config...');

    const required: (keyof Options)[] = ['dir']; // Required options.
    const missing = required.filter((r) => !config[r]);
    if (missing.length) {
      // At least one required option is missing.
      throw new MissingConfigurationOptionError(missing);
    }

    const preprocessor = config.input.styles.preprocessor;
    if (
      preprocessor &&
      !Object.values<string>(Preprocessor).includes(preprocessor)
    ) {
      // Preprocessor is defined but not a valid preprocessor.
      throw new UnknownPreprocessorError(preprocessor);
    }
  }
}
