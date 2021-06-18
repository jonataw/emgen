import { Emgen } from '../src/index';

describe('configuration', (): void => {
  test('it should throw error if required configuration options are missing', (): void => {
    try {
      new Emgen({} as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('it should set correct directory paths', (): void => {
    expect(
      new Emgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .templates.dir
    ).toBe('test-dir/templates');
    expect(
      new Emgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .includes.dir
    ).toBe('test-dir/includes');
    expect(
      new Emgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .styles.dir
    ).toBe('test-dir/styles');
    expect(
      new Emgen({
        dir: 'test-dir',
        input: { styles: { dir: 'something-else-dir/styles' } },
        output: { auto: false }
      }).config.input.styles.dir
    ).toBe('something-else-dir/styles');
  });
});

describe('configuration', (): void => {
  test('it should throw error if required configuration options are missing', (): void => {
    try {
      new Emgen({} as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('it should set correct directory paths', (): void => {
    expect(
      new Emgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .templates.dir
    ).toBe('test-dir/templates');
    expect(
      new Emgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .includes.dir
    ).toBe('test-dir/includes');
    expect(
      new Emgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .styles.dir
    ).toBe('test-dir/styles');
    expect(
      new Emgen({
        dir: 'test-dir',
        input: { styles: { dir: 'something-else-dir/styles' } },
        output: { auto: false }
      }).config.input.styles.dir
    ).toBe('something-else-dir/styles');
  });
});
