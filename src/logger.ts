export class Logger {
  private static verbose: boolean;

  /**
   * String to reset console formatting.
   */
  private static reset = '\x1b[0m';

  /**
   * Sets the verbose value.
   * @param verbose
   */
  public static setVerbose(verbose?: boolean): void {
    this.verbose = verbose || false;
  }

  /**
   * @param m
   */
  private static log(...m: string[]): void {
    console.log(m);
    // Do not log in tests.
    if (!process.env.JEST_WORKER_ID) {
      console.log('\x1b[1m', 'Emgen', Logger.reset, ...m);
    }
  }

  /**
   * Logs as error.
   * @param m
   */
  public static error(...m: string[]): void {
    this.log('\x1b[41m', 'Error:', Logger.reset, ...m);
  }

  /**
   * Logs as info (default, no prefix).
   * @param m
   */
  public static info(...m: string[]): void {
    if (Logger.verbose) this.log(...m);
  }
}
