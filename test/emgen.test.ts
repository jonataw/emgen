import { createEmgen } from '../src/';

describe('configuration', (): void => {
  test('it should throw error if required configuration options are missing', (): void => {
    try {
      createEmgen({} as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('it should set correct directory paths', (): void => {
    expect(
      createEmgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .templates.dir
    ).toBe('test-dir/templates');
    expect(
      createEmgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .includes.dir
    ).toBe('test-dir/includes');
    expect(
      createEmgen({ dir: 'test-dir', output: { auto: false } }).config.input
        .styles.dir
    ).toBe('test-dir/styles');
    expect(
      createEmgen({
        dir: 'test-dir',
        input: { styles: { dir: 'something-else-dir/styles' } },
        output: { auto: false }
      }).config.input.styles.dir
    ).toBe('something-else-dir/styles');
  });
});
