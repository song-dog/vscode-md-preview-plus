declare type MarkdownIt = import('markdown-it/index.js');

declare type TocDefaults = {
  includeLevel: number[];
  containerClass: string;
  slugify: (str: string) => string;
  markerPattern: RegExp;
  listType: 'ul' | 'ol';
  format: (content: string, md: MarkdownIt) => MarkdownIt;
  forceFullToc: boolean;
  containerHeaderHtml: string | void;
  containerFooterHtml: string | void;
  transformLink: string | void;
};

declare type Token = import('markdown-it/index.js').Token;

declare type HeadlineItem = {
  level: number;
  anchor: string;
  text: string;
};

declare function findHeadlineElements(levels: number[], tokens: Token[], options: any): HeadlineItem[];

declare function findExistingIdAttr(token: Token): string | void;

declare function getMinLevel(headlineItems: HeadlineItem[]): number;

declare type TocItem = {
  level: number;
  text: string;
  anchor: string;
  children: TocItem[];
  parent: TocItem;
};

declare function addListItem(level: number, text: string, anchor: string, rootNode: TocItem): TocItem;

declare function flatHeadlineItemsToNestedTree(headlineItems: HeadlineItem[]): TocItem;

declare function tocItemToHtml(tocItem: TocItem, options: TocDefaults, md: MarkdownIt): string;

declare interface TocPlugin {
  (md: MarkdownIt, options: Partial<TocDefaults>): void;
}
