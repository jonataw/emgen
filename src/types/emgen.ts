export interface Options {
  dir: string;
  verbose?: boolean;
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
     * @default '{dir}/output'
     */
    dir?: string;
    /**
     * Instantly generate all templates found in the templates directory.
     * If this is set to false, generate your templates with:
     *   - Emgen.generateTemplates(dir: string) - Generates all templates in directory.
     *     or
     *   - Emgen.generateTemplate(filename: string) - Generates a single template.
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
