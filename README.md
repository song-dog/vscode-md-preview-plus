# Markdown Previews with Github Alert

This is a VS Code extension that allows you to preview GitHub's alert syntax for markdown files. This feature first introduced in [this discussion post](https://github.com/orgs/community/discussions/16925). And this extension is the first implementation of this feature in VS Code.

Consider the following markdown:

```md
> [!NOTE]
> Hello, world!
```

What it looks like on Github:

![Example](https://github.com/song-dog/vscode-markdown-alert/raw/HEAD/images/example.webp)

What it looks like in VS Code:

![Example](https://github.com/song-dog/vscode-markdown-alert/raw/HEAD/images/preview.webp)

## How does it work?

VS Code uses a javascript library named [markdown-it](https://github.com/markdown-it/markdown-it) to render markdown files. This library allows you to add custom rules to the markdown parser. This extension adds a custom rule to the parser to render GitHub's alert syntax.

## To do
- task lists
- obsidian callouts
- footnotes
- color codes

## License

![GNU GPLv3](https://img.shields.io/github/license/song-dog/vscode-markdown-alert?style=for-the-badge)
