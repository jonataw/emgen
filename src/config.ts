import { deepmerge } from './deepmerge';
import { Logger } from './logger';
import { EmgenOptions, Preprocessor } from './types/emgen';
import { DeepRequired } from './types/extra';

class MissingConfigurationOptionError extends Error {
  constructor(missing: (keyof EmgenOptions)[]) {
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
   *
   * @param options
   */
  public static init(options: EmgenOptions): DeepRequired<EmgenOptions> {
    const config = deepmerge<EmgenOptions>(
      {
        dir: options.dir,
        verbose: false,
        telemetry: true,
        transpile: true,
        vue: false,
        input: {
          templates: { dir: `${options.dir}/templates` },
          includes: { dir: `${options.dir}/includes` },
          styles: { dir: `${options.dir}/styles` }
        },
        output: { auto: true, dir: `${options.dir}/.compiled`, flatten: true }
      },
      options
    ) as DeepRequired<EmgenOptions>;

    return config;
  }

  /**
   * Validates the configuration object.
   *
   * @param config
   */
  public static validate(config: EmgenOptions): void {
    Logger.info('Validating config...');

    const required: (keyof EmgenOptions)[] = ['dir']; // Required options.
    const missing = required.filter((r) => !config[r]);

    if (missing.length) {
      // At least one required option is missing.
      throw new MissingConfigurationOptionError(missing);
    }

    const preprocessor = config.input?.styles?.preprocessor;
    if (
      preprocessor &&
      !Object.values<string>(Preprocessor).includes(preprocessor)
    ) {
      // Preprocessor is defined but not a valid preprocessor.
      throw new UnknownPreprocessorError(preprocessor);
    }
  }
}
