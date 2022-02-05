## Vue Usage

### Dependencies

To use Emgen with Vue templates, you have to install additional dependencies:

```bash
npm install vue@">3.2.0" @vue/compiler-sfc">3.2.0"
```

If you want to use Typescript in your Vue template files:

```bash
npm install typescript">4.0.0"
```

### Quickstart

By default Emgen assumes your directory setup to be:

```
{dir}
├── styles
│   ├── file.css
│   └── ...
└── templates
    ├── file.vue
    └── ...
```

Set `vue` to `true` in createEmgen():

```ts
import { createEmgen } from 'emgen';

const emgen = createEmgen({
  dir: __dirname,
  vue: true
});
```

Emgen will automatically compile your templates to .js components. You can then render the templates:

`<file>` should be your template name, exluding the .vue or .js extension. See [Render](#render) for possible options.

```ts
const html = await emgen.render('<file>', options);
```

### Render

The render function renders a template and returns a HTML string.

```ts
const html = await emgen.render('<file>', {
  props: {
    firstname: 'Bob'
  },
  locale: 'en',
  translations: {
    en: {
      hello: 'Hello'
    },
    sv: {
      hello: 'Hej'
    }
  }
});
```

#### RenderOptions

**`props`**: Props to pass to the component.

**`locale`**: Set the locale to render the template in.

- Only applicable if using [i18n](#i18n).

**`translations`**: Translations for the template.

- Only applicable if using [i18n](#i18n).

### i18n

To create translateable templates, install the `vue-i18n` package:

```bash
npm install vue-i18n@">9.0.0"
```

Enable i18n by setting the `i18n.defaultLocale` [configuration](/configuration) option:

```ts
const emgen = createEmgen({
  dir: __dirname,
  vue: true,
  i18n: {
    defaultLocale: 'en',
    translations: { // Global translations, available to all templates
      en: {
        hello: 'Hello, {firstname}!'
      },
      sv: {
        hello: 'Hej, {firstname}!'
      }
    }
  }
});
```

You can now use vue-i18n in your templates:

```html
<template>
  <div>{{ $t('hello', { firstname }) }} {{ $t('bye') }}</div>
</template>
```

And render your template:

```ts
const html = await emgen.render('<file>', {
  props: {
    firstname: 'Bob'
  },
  locale: 'en',
  translations: { // Translations only available to currently rendered template
    en: {
      bye: 'Bye'
    },
    sv: {
      bye: 'Hejdå'
    }
  }
});
```

The output HTML will be:

```html
<div>Hello, Bob! Bye</div>
```
