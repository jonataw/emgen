# Emgen

Generate email templates with automatic file inclusion and stylesheet inlining.

## Installation

**Node.js 10.x or higher is required.**

```bash
npm install emgen
# OR
yarn add emgen
```

## Usage

```ts
import { Emgen } from 'emgen';

// Provide the directory where your templates are:
const emgen = new Emgen({
  dir: 'emails'
});
```

The `dir` configuration option is required and should be the path where your includes, styles and templates are stored.

By default Emgen assumes your directory setup to be:

```
{dir}
├── includes
│   ├── file.html
│   └── ...
├── styles
│   ├── file.css
│   └── ...
└── templates
    ├── file.html
    └── ...
```

See [configuration](#configuration) for how to override these paths.

## CSS Preprocessors

To use a CSS preprocessor set the `input.styles.preprocessor` option. Valid options are `'sass'`, `'less'` or `'stylus'`.

**Preprocessor dependencies are not included in Emgen and have to be installed separately:**

```bash
# Sass
npm install sass

# Less
npm install less

# Stylus
npm install stylus
```

```ts
new Emgen({
  dir: 'emails',
  input: {
    styles: {
      preprocessor: 'sass'
    }
  }
});
```

## Includes

To use automatic includes add a comment with this syntax in your template:

```html
<!-- #include filename.html -->
```

`filename.html` should be a file in your includes directory.

## Configuration

### dir

Sets the path to where your includes, styles and templates are stored.

### input.includes.dir

Override path to input includes directory.

- Default: `[dir]/includes`

### input.styles.dir

Override path to input styles directory.

- Default: `[dir]/styles`

### input.styles.preprocessor

Define a preprocessor for your styles. Valid options are `'sass'`, `'less'` or `'stylus'`.

### input.templates.dir

Override path to input templates directory.

- Default: `[dir]/templates`

### output.dir

Override path to output directory. Your generated templates will be written here.

- Default: `[dir]/output`

### output.auto

Automatically generates your templates and writes them to the output directory.

If this options is set to false, you can use `generateTemplate()` or `generateTemplates()` methods to manually generate templates.

- Default: `true`

### verbose

Provides additional context and information.

- Default: `false`

## Tests

```bash
npm install
npm test
```

## License

[ISC](LICENSE)
