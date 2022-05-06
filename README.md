<p align="center">
  <img src="https://github.com/jonataw/emgen/blob/HEAD/docs/logo.png" width="196"  />
  <h1 align="center">Emgen</h1>
</p>

[![npm](https://img.shields.io/npm/v/emgen.svg)](https://www.npmjs.com/package/emgen)
[![license](https://img.shields.io/npm/l/emgen.svg)](https://github.com/jonataw/emgen/blob/HEAD/LICENSE)
[![downloads](https://img.shields.io/npm/dt/emgen)](https://www.npmjs.com/package/emgen)

Emgen allows you to easily generate HTML email templates.

- **Automatic stylesheet inlining**: Write your CSS (or [Sass/Less/Stylus](https://jonataw.github.io/emgen/css-preprocessors)) in a separate file and Emgen will automatically inline it into your HTML.
- **File inclusion**: Allows you to reuse common elements of your templates by keeping them in separate fields and referring to them with a comment syntax.
- [**Support for Vue templates**](https://jonataw.github.io/emgen/usage-vue): Use Vue.js to create and render your templates.

## Installation

Emgen is available as an [npm package](https://www.npmjs.com/package/emgen).

```bash
npm install emgen
```

### Additional features (optional)

```bash
npm install sass # Sass support
npm install less # Less support
npm install stylus # Stylus support

# Vue SFC support
npm install vue@">3.2.0"
npm install @vue/compiler-sfc@">3.2.0"

# Vue with Typescript
npm install typescript@">4.0.0"

# Vue i18n support
npm install vue-i18n@">9.0.0"
```

## Documentation

Please refer to the [documentation](https://jonataw.github.io/emgen) for information on how to get started.

## Contributing

Feel free to contribute to Emgen. Here are some ways you can contribute:

- Open bug reports
- Open feature requests
- Propose improvements to the documentation
- Create Pull Requests to fix bugs or make other improvements

## License

This project is licensed under the terms of the [ISC](https://www.npmjs.com/package/emgen) license.
