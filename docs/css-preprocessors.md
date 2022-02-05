## CSS Preprocessors

You can use Sass, Less and Stylus as preprocessors.

Emgen does not bundle preprocessors in the package; you must install them yourself:

```bash
# Sass
npm install sass

# Less
npm install less

# Stylus
npm install stylus
```

Set the `input.styles.preprocessor` [configuration](/configuration) option:

```ts
const emgen = createEmgen({
  dir: __dirname,
  input: {
    styles: {
      preprocessor: 'sass' // or 'less' or 'stylus'
    }
  }
});
```

Emgen will now try process your styles with the configured preprocessor. Make sure to change the file extension of your style files.



