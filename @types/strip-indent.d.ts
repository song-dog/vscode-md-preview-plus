namespace StripIndent {
  interface Options {
    escapeSpecialCharacters?: boolean;
  }

  type Create = (options: Options) => StripIndent;
}

interface StripIndent {
  (strings: string | TemplateStringsArray, ...values?: unknown[]): string;
  withOptions: StripIndent.Create;
}
