declare type MarkdownIt = import('markdown-it/index.js');

declare type Token = import('markdown-it/index.js').Token;

declare type Heading = {
  level: number;
  anchor: string;
  text: string;
};

declare function findHeadlineElements(levels: number[], tokens: Token[], options: any): Heading[];

declare function findExistingIdAttr(token: Token): string | void;

declare function getMinLevel(headings: Heading[]): number;

declare type TocEntry = {
  level: number;
  text: string;
  anchor: string;
  children: TocEntry[];
  parent: TocEntry;
};

declare function addListItem(level: number, text: string, anchor: string, rootNode: TocEntry): TocEntry;

declare function flatHeadingsToNestedTree(headings: Heading[]): TocEntry;

declare function createTocEntry(tocEntry: TocEntry, options: TocDefaults, md: MarkdownIt): string;

declare interface TocPlugin {
  (md: MarkdownIt, options: Partial<TocDefaults>): void;
}
