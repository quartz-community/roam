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
| `tableComponent`      | `boolean` | `true`  | Accepted, but currently not used by the plugin.                                     |
| `attributeComponent`  | `boolean` | `true`  | Accepted, but currently not used by the plugin.                                     |

Roam's `^^highlight^^` and `__italic__` syntax is always converted (to a highlight and to emphasis).

## Known issue

With the [ObsidianFlavoredMarkdown](https://quartz.jzhao.xyz/plugins/ObsidianFlavoredMarkdown) plugin's wikilinks on (the default), syntax built on `[[…]]` — `{{[[TODO]]}}`, `{{[[DONE]]}}`, `[[>]]` — is parsed as a wikilink before this plugin runs, whatever the `order`, so it renders as a link. `^^highlight^^` and the other syntax not built on `[[…]]` work.

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/plugins/RoamFlavoredMarkdown) and [Roam Research compatibility](https://quartz.jzhao.xyz/features/Roam%20Research%20compatibility) for more information.

## License

MIT
