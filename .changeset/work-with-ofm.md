---
"@quartz-community/roam": minor
---

Roam syntax works alongside ObsidianFlavoredMarkdown, which is in the default config. The plugin now rewrites Roam syntax in the Markdown source before it is parsed (`textTransform`), instead of in the parsed tree.

- **Wikilinks:** ObsidianFlavoredMarkdown parsed `[[…]]` as wikilinks first, so `{{[[TODO]]}}`, `{{[[DONE]]}}`, `[[>]]` and `{{[[video]]: …}}` rendered as links whatever the plugin order.
- **Italic:** CommonMark read Roam's `__italic__` as bold; it is now italic.

Code blocks, inline code and frontmatter are left as written. `{{TODO}}`, `{{DONE}}` and `{{video: …}}` (without brackets) work too, and `[[>]]` inside a list item makes a quote in that item. The options `tableComponent` and `attributeComponent` were never implemented and are marked deprecated.
