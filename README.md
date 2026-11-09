# @quartz-community/roam

Transforms Roam Research markdown syntax including `{{or:}}` selectors, TODO/DONE checkboxes, media embeds, and Roam-style highlights.

## Installation

```bash
npx quartz plugin add @quartz-community/roam
```

Quartz's default configuration has a disabled entry for this plugin; set `enabled: true` to use it.

## Usage

```yaml title="quartz.config.yaml"
plugins:
  - source: "@quartz-community/roam"
    enabled: true
    order: 92
    options:
      orComponent: true
      TODOComponent: true
```

## Configuration

| Option                | Type      | Default | Description                                                                         |
| --------------------- | --------- | ------- | ----------------------------------------------------------------------------------- |
| `orComponent`         | `boolean` | `true`  | Convert `{{or:ONE\|TWO\|THREE}}` into a dropdown.                                   |
| `TODOComponent`       | `boolean` | `true`  | Convert `{{[[TODO]]}}` into an unchecked checkbox.                                  |
| `DONEComponent`       | `boolean` | `true`  | Convert `{{[[DONE]]}}` into a checked checkbox.                                     |
| `videoComponent`      | `boolean` | `true`  | Convert `{{[[video]]:URL}}` into an embedded video (YouTube links become an embed). |
| `audioComponent`      | `boolean` | `true`  | Convert `{{[[audio]]:URL}}` into an embedded audio player.                          |
| `pdfComponent`        | `boolean` | `true`  | Convert `{{[[pdf]]:URL}}` into an embedded PDF viewer.                              |
| `blockquoteComponent` | `boolean` | `true`  | Convert `[[>]] text` into a blockquote.                                             |
| `tableComponent`      | `boolean` | `true`  | Deprecated: never implemented, has no effect.                                       |
| `attributeComponent`  | `boolean` | `true`  | Deprecated: never implemented, has no effect.                                       |

Roam's `^^highlight^^` and `__italic__` syntax is always converted (to a highlight and to emphasis).

## How it works

The plugin rewrites Roam syntax in the Markdown source before it is parsed, so it works alongside [ObsidianFlavoredMarkdown](https://quartz.jzhao.xyz/plugins/ObsidianFlavoredMarkdown), which would otherwise read `[[…]]` as wikilinks and `__x__` as bold. Code blocks, inline code and frontmatter are left as written. The bracket-less forms (`{{TODO}}`, `{{DONE}}`, `{{video: URL}}`) work too, and `[[>]]` inside a list item makes a quote in that item. With ObsidianFlavoredMarkdown's `enableCheckbox` on (the default config), the TODO/DONE checkboxes can be ticked like task-list items.

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/plugins/RoamFlavoredMarkdown) and [Roam Research compatibility](https://quartz.jzhao.xyz/features/Roam%20Research%20compatibility) for more information.

## License

MIT
