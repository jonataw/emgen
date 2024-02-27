## Configuration

Below are the possible configuration options that can be passed to `createEmgen`.

**`dir`**: Sets the path to where your includes, styles and templates are stored.

**`input.includes.dir`**: Override path to input includes directory.

- Default: `[dir]/includes`

**`input.styles.dir`**: Override path to input styles directory.

- Default: `[dir]/styles`

**`input.styles.preprocessor`**: Define a preprocessor for your styles. Valid options are `'sass'`, `'less'` or `'stylus'`.

**`input.styles.prepend`**: Prepend a string to all stylesheets. Can be useful to define global variables.

**`input.templates.dir`**: Override path to input templates directory.

- Default: `[dir]/templates`

**`output.dir`**: Override path to output directory. Your compiled templates will be written here.

- Default: `[dir]/.compiled`

**`output.auto`**: If true, automatically generates your templates and writes them to the output directory when `createEmgen` is called. If this options is set to false, you can use `emgen.compile` or `emgen.compileTemplate` methods to manually generate templates.

- Default: `true`

**`verbose`**: Prints additional context and information.

- Default: `false`

**`vue`**: Set to true if you would like to use Vue SFC's instead of standard HTML.

- Default: `false`

**`transpile`**: Set to `true` if your Vue SFC's use Typescript.

- Default: `false`
- Only used if `vue` is set to `true`.

**`telemetry`**: Sends a simple telemetry request which includes **only the version of the currently installed Emgen package** to the maintainer's server. Set to `false` to opt out.

- Default: `true`

**`i18n.defaultLocale`**: Set the default fallback locale when using i18n. See [i18n](/emgen/usage-vue#i18n) for more information.

- Only used if `vue` is set to `true`.

**`i18n.translations`**: Set global translations. See [i18n](/emgen/usage-vue#i18n) for more information.

- Only used if `vue` is set to `true`.
