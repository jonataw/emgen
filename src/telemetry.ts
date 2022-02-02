import https from 'https';
import version from './version';

const options = {
  hostname: 'jonatan.net',
  port: 443,
  path: `/emgen?version=${version}`,
  method: 'GET',
  timeout: 2000
};

export class Telemetry {
  /**
   * Collects the Emgen version number.
   * /emgen?version=${version}
   */
  public static collect(): void {
    const req = https.request(options);
    req.on('error', () => null);
    req.on('timeout', () => {
      req.destroy();
    });
    req.end();
  }
}
