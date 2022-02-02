import { BaseCompiler } from './compilers/base-compiler';
import { DefaultCompiler } from './compilers/default-compiler';
import { VueCompiler } from './compilers/vue-compiler';
import { Config } from './config';
import { Logger } from './logger';
import { Telemetry } from './telemetry';
import { EmgenOptions } from './types/emgen';

export { default as version } from './version';

export function createEmgen(options: EmgenOptions): BaseCompiler {
  let compiler: BaseCompiler;

  const config = Config.init(options || {});

  Logger.setVerbose(config.verbose);
  Logger.info(
    'Additional logging will be printed. You can disable this by setting { verbose: false }.'
  );

  Config.validate(config);
  Logger.info('Configuration:', JSON.stringify(config));

  if (config.vue) {
    compiler = new VueCompiler(config);
  } else {
    compiler = new DefaultCompiler(config);
  }

  if (config.output.auto) {
    compiler.compile(config.input.templates.dir);
  }

  if (config.telemetry && !process.env.JEST_WORKER_ID) {
    // If telemetry is enabled, the Emgen version will be collected.
    Telemetry.collect();
  }

  return compiler;
}
