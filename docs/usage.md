## Usage

### Quickstart

The usage example below applies to the default HTML template compiler. See [Vue Usage](/vue-usage) for Vue compiler usage documentation.

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

The `dir` configuration option is required and should be the path where your includes, styles and templates are stored.

```ts
import { createEmgen } from 'emgen';

const emgen = createEmgen({ dir: __dirname });
```

Your templates in `__dirname/templates` will automatically be generated and added to `__dirname/.compiled` and be ready to send.

### Includes

To use automatic includes add a comment with the following syntax in your template. The `includes` folder should have a file named `filename.html`.

```html
<!-- #include filename.html -->
```

### Full Example

Assume you have a template `templates/template.html`...

```html
<html>
  <body>
    <!-- #include hello.html -->
  </body>
</html>
```

...and an include `includes/hello.html`...

```html
<p>Hello!</p>
```

...your generated template will yield:

```html
<html>
  <body>
    <p>Hello!</p>
  </body>
</html>
```

### Styles

Add CSS files to the `styles` directory and Emgen will automatically inline them into your generated HTML.

To use preprocessors, see [CSS Preprocessors](/css-preprocessors).
