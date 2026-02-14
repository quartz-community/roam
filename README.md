# @quartz-community/roam

Transforms Roam Research markdown syntax including {{or:}} selectors, TODO/DONE checkboxes, media embeds, and Roam-style highlights.

## Installation

```bash
npx quartz plugin add github:quartz-community/roam
```

## Usage

```ts
// quartz.config.ts
import * as ExternalPlugin from "./.quartz/plugins"

const config: QuartzConfig = {
  plugins: {
    transformers: [
      ExternalPlugin.RoamFlavoredMarkdown(),
    ],
  },
}
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| orComponent | `boolean` | `true` | Whether to enable the {{or:}} component. |
| TODOComponent | `boolean` | `true` | Whether to enable the TODO component. |
| DONEComponent | `boolean` | `true` | Whether to enable the DONE component. |
| videoComponent | `boolean` | `true` | Whether to enable the video component. |
| audioComponent | `boolean` | `true` | Whether to enable the audio component. |
| pdfComponent | `boolean` | `true` | Whether to enable the PDF component. |
| blockquoteComponent | `boolean` | `true` | Whether to enable the blockquote component. |
| tableComponent | `boolean` | `true` | Whether to enable the table component. |
| attributeComponent | `boolean` | `true` | Whether to enable the attribute component. |

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/) for more information.

## License

MIT
