declare type MarkdownIt = import('markdown-it/index.js');

declare type Token = import('markdown-it/index.js').Token;

declare type RuleInline = import('markdown-it/index.js').ParserInline.RuleInline;

declare type RuleBlock = import('markdown-it/index.js').ParserBlock.RuleBlock;

declare type StateInline = import('markdown-it/index.js').StateInline;

declare type StateBlock = import('markdown-it/index.js').StateBlock;

declare type Slug = {
  value: string;
}

declare interface slugify {
  (str: string): Slug;
}

declare interface captureHeadings {
  (state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
}

declare interface toc {
  (state: StateInline, silent: boolean): boolean;
}

declare interface tableOfContents {
  (md: MarkdownIt): void;
}
