import { createEmgen } from '../src';
import { File } from '../src/file';

describe('vue-templates', (): void => {
  test('should compile templates', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      transpile: false,
      vue: true
    });

    const basic = File.readFile(emgen.config.output.dir + '/Basic.js');
    expect(basic.includes('button') && basic.includes('Basic')).toBe(true);

    const basicWithImport = File.readFile(
      emgen.config.output.dir + '/BasicWithImport.js'
    );
    expect(
      basicWithImport.includes(`import Basic from './Basic'`) &&
        basicWithImport.includes('<Basic />')
    ).toBe(true);
  });

  test('should render templates', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true
    });

    const rendered = await emgen.render('BasicWithImport');
    expect(rendered.includes('button') && rendered.includes('Basic')).toBe(
      true
    );
  });

  test('should render nested templates', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true
    });

    const rendered = await emgen.render('Nested');
    expect(rendered.includes('button') && rendered.includes('Nested')).toBe(
      true
    );
  });

  test('should work with external props', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true
    });

    const props = File.readFile(emgen.config.output.dir + '/props.js');
    const rendered = await emgen.render('WithExternalProps', {
      props: { name: 'ExternalProp' }
    });

    expect(props.length).toBeDefined();
    expect(rendered.includes('ExternalProp')).toBe(true);
  });

  test('should render with conditions', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true
    });

    const rendered = await emgen.render('WithCondition', {
      props: { condition: true }
    });
    expect(rendered.includes('Yes!') && rendered.includes('true')).toBe(true);

    const rendered2 = await emgen.render('WithCondition', {
      props: { condition: false }
    });
    expect(rendered2.includes('No!') && rendered2.includes('false')).toBe(true);
  });

  test('should inline global css', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true
    });

    const rendered = await emgen.render('InlineStyle');
    expect(rendered.includes('color: green')).toBe(true);
  });

  test('should inline sfc css', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true
    });

    const rendered = await emgen.render('InlineStyle');
    expect(rendered.includes('color: red')).toBe(true);
  });

  test('should inherit css from child components', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true
    });

    const rendered = await emgen.render('InlineStyleInherit');
    expect(rendered.includes('color: red')).toBe(true);

    const rendered2 = await emgen.render('InlineStyleInheritDeep');
    expect(rendered2.includes('color: red')).toBe(true);
  });

  test('should translate content', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true,
      i18n: {
        defaultLocale: 'en',
        translations: {
          en: {
            hello: 'HelloWorld'
          }
        }
      }
    });

    const rendered = await emgen.render('Translate', { locale: 'en' });
    expect(rendered.includes('HelloWorld')).toBe(true);
  });

  test('should inherit css from extended component', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true
    });

    const rendered = await emgen.render('Extends');
    expect(rendered.includes('color: red')).toBe(true);

    const rendered2 = await emgen.render('ExtendsDeep');
    expect(rendered2.includes('color: red')).toBe(true);
  });

  test('should prepend style', async (): Promise<void> => {
    const emgen = createEmgen({
      dir: __dirname + '/vue',
      vue: true,
      input: {
        styles: {
          prepend: 'button{background-color:red;}'
        }
      }
    });

    const rendered = await emgen.render('Basic');
    expect(rendered.includes('background-color: red')).toBe(true);
  });
});
