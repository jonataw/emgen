import { Config } from './config';
import { useDefaultCompiler } from './default-compiler';
import { Logger } from './logger';
import { Compiler, Options } from './types/emgen';
import { useVueCompiler } from './vue-compiler';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createEmgen(options: Options) {
  let strategy: Compiler;

  const config = Config.init(options || {});
  Logger.setVerbose(config.verbose);
  Logger.info(
    'Additional logging will be printed. You can disable this by setting { verbose: false }.'
  );
  Config.validate(config);
  Logger.info('Configuration:', JSON.stringify(config));

  if (config.vue) {
    strategy = useVueCompiler(config);
  } else {
    strategy = useDefaultCompiler(config);
  }

  if (config.output.auto) {
    strategy.compile(config.input.templates.dir);
  }

  /**
   * Compiles all templates in provided directory.
   *
   * @deprecated Use compile instead.
   * @param directory
   */
  const generateTemplates = (directory: string) => strategy.compile(directory);

  /**
   * Compiles a single template at path.
   *
   * @deprecated Use compileTemplate instead.
   * @param path
   * @param styles
   */
  const generateTemplate = (path: string, styles?: string) =>
    strategy.compileTemplate(path, styles);

  return {
    config,
    ...strategy,
    generateTemplate,
    generateTemplates
  };
}
