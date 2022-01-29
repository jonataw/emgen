export interface EmgenOptions {
  dir: string;
  verbose?: boolean;
  transpile?: boolean;
  vue?: boolean;
  /**
   * Provide translations for your templates.
   * Only applies if `vue` is set to `true`.
   * @see
   */
  i18n?: {
    /**
     * The default locale if none is provided.
     * It is also used as fallback if translation does not exist in requested locale.
     */
    defaultLocale: string;
    /**
     * @see https://kazupon.github.io/vue-i18n
     * @example
     * ```ts
     * translations: {
     *   en: {
     *     hello: "Hello"
     *   },
     *   sv: {
     *     hello: "Hej"
     *   }
     * }
     * ```
     */
    translations?: Record<string, Record<string, string>>;
  };
  input?: {
    templates?: {
      /**
       * Directory to look for templates in.
       * @default '{dir}/templates'
       */
      dir?: string;
    };
    includes?: {
      /**
       * Directory to look for includes in.
       * Only applies if `vue` is set to `false`.
       * @default '{dir}/includes'
       */
      dir?: string;
    };
    styles?: {
      /**
       * Directory to look for styles in.
       * @default '{dir}/styles'
       */
      dir?: string;
      /**
       * Optionally preprocess styles in the styles.dir directory before injecting into template.
       * Requires dependencies to be installed:
       * Sass: sass - @see https://www.npmjs.com/package/sass
       * Less: less - @see https://www.npmjs.com/package/less
       * Stylus: stylus - @see https://www.npmjs.com/package/stylus
       */
      preprocessor?: `${Preprocessor}`;
    };
  };
  output?: {
    /**
     * Output directory.
     * @default '{dir}/.compiled'
     */
    dir?: string;
    /**
     * Instantly generate all templates found in the templates directory.
     * If this is set to false, generate your templates with:
     *   - Emgen.compile(directory: string) - Generates all templates in directory.
     *     or
     *   - Emgen.compileTemplate(filename: string, styles?: string) - Generates a single template.
     * @default true
     */
    auto?: boolean;
    /**
     * Flatten files in output directory.
     * Requires that file names are unique across folders.
     * @todo
     * @default false
     */
    flatten?: boolean;
  };
}

export enum Preprocessor {
  Sass = 'sass',
  Less = 'less',
  Stylus = 'stylus'
}

export interface RenderOptions {
  locale?: string;
  translations?: Record<string, Record<string, string>>;
  props?: Record<string, unknown>;
}

export type DependencyList = { name: string; version: string }[];
