import { createEmgen } from '../src';
import { File } from '../src/file';

describe('templates', (): void => {
  test('should compile templates', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/default'
    });

    const basic = File.readFile(emgen.config.output.dir + '/basic.html');
    expect(basic.includes('<p>Hello world!</p>')).toBe(true);
  });

  test('should add includes', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/default'
    });

    const basic = File.readFile(emgen.config.output.dir + '/with-include.html');
    expect(basic.includes('Included!')).toBe(true);
  });

  test('should inline global css', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/default'
    });

    const basic = File.readFile(emgen.config.output.dir + '/with-style.html');
    expect(basic.includes('color: green')).toBe(true);
  });
});
