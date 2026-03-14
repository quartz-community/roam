import { visit } from 'unist-util-visit';
import { findAndReplace } from 'mdast-util-find-and-replace';

// src/transformer.ts
var defaultOptions = {
  orComponent: true,
  TODOComponent: true,
  DONEComponent: true,
  videoComponent: true,
  audioComponent: true,
  pdfComponent: true,
  blockquoteComponent: true,
  tableComponent: true,
  attributeComponent: true
};
var orRegex = new RegExp(/{{or:(.*?)}}/, "g");
var TODORegex = new RegExp(/{{.*?\bTODO\b.*?}}/, "g");
var DONERegex = new RegExp(/{{.*?\bDONE\b.*?}}/, "g");
var blockquoteRegex = new RegExp(/(\[\[>\]\])\s*(.*)/, "g");
var roamHighlightRegex = new RegExp(/\^\^(.+)\^\^/, "g");
var roamItalicRegex = new RegExp(/__(.+)__/, "g");
function isSpecialEmbed(node) {
  if (node.children.length !== 2) return false;
  const [textNode, linkNode] = node.children;
  return !!(textNode && textNode.type === "text" && textNode.value.startsWith("{{[[") && linkNode && linkNode.type === "link" && linkNode.children && linkNode.children[0] && linkNode.children[0].type === "text" && linkNode.children[0].value.endsWith("}}"));
}
function transformSpecialEmbed(node, opts) {
  const [textNode, linkNode] = node.children;
  const embedType = textNode.value.match(/\{\{\[\[(.*?)\]\]:/)?.[1]?.toLowerCase();
  const url = linkNode.url.slice(0, -2);
  switch (embedType) {
    case "audio":
      return opts.audioComponent ? {
        type: "html",
        value: `<audio controls>
          <source src="${url}" type="audio/mpeg">
          <source src="${url}" type="audio/ogg">
          Your browser does not support the audio tag.
        </audio>`
      } : null;
    case "video": {
      if (!opts.videoComponent) return null;
      const youtubeMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
      );
      if (youtubeMatch && youtubeMatch[1]) {
        const videoId = youtubeMatch[1].split("&")[0];
        const playlistMatch = url.match(/[?&]list=([^#&?]*)/);
        const playlistId = playlistMatch ? playlistMatch[1] : null;
        return {
          type: "html",
          value: `<iframe 
            class="external-embed youtube"
            width="600px"
            height="350px"
            src="https://www.youtube.com/embed/${videoId}${playlistId ? `?list=${playlistId}` : ""}"
            frameborder="0"
            allow="fullscreen"
          ></iframe>`
        };
      } else {
        return {
          type: "html",
          value: `<video controls>
            <source src="${url}" type="video/mp4">
            <source src="${url}" type="video/webm">
            Your browser does not support the video tag.
          </video>`
        };
      }
    }
    case "pdf":
      return opts.pdfComponent ? {
        type: "html",
        value: `<embed src="${url}" type="application/pdf" width="100%" height="600px" />`
      } : null;
    default:
      return null;
  }
}
var RoamFlavoredMarkdown = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "RoamFlavoredMarkdown",
    markdownPlugins() {
      const plugins = [];
      plugins.push(() => {
        return (tree) => {
          const replacements = [];
          if (opts.audioComponent || opts.videoComponent || opts.pdfComponent) {
            visit(tree, "paragraph", ((node, index, parent) => {
              if (isSpecialEmbed(node)) {
                const transformedNode = transformSpecialEmbed(node, opts);
                if (transformedNode && parent) {
                  parent.children[index] = transformedNode;
                }
              }
            }));
          }
          replacements.push([
            roamItalicRegex,
            (_value, match) => ({
              type: "emphasis",
              children: [{ type: "text", value: match }]
            })
          ]);
          replacements.push([
            roamHighlightRegex,
            (_value, inner) => ({
              type: "html",
              value: `<span class="text-highlight">${inner}</span>`
            })
          ]);
          if (opts.orComponent) {
            replacements.push([
              orRegex,
              (match) => {
                const matchResult = match.match(/{{or:(.*?)}}/);
                if (matchResult === null || !matchResult[1]) {
                  return { type: "html", value: "" };
                }
                const optionsString = matchResult[1];
                const options = optionsString.split("|");
                const selectHtml = `<select>${options.map((option) => `<option value="${option}">${option}</option>`).join("")}</select>`;
                return { type: "html", value: selectHtml };
              }
            ]);
          }
          if (opts.TODOComponent) {
            replacements.push([
              TODORegex,
              () => ({
                type: "html",
                value: `<input type="checkbox" disabled>`
              })
            ]);
          }
          if (opts.DONEComponent) {
            replacements.push([
              DONERegex,
              () => ({
                type: "html",
                value: `<input type="checkbox" checked disabled>`
              })
            ]);
          }
          if (opts.blockquoteComponent) {
            replacements.push([
              blockquoteRegex,
              (_match, _marker, content) => ({
                type: "html",
                value: `<blockquote>${content.trim()}</blockquote>`
              })
            ]);
          }
          findAndReplace(tree, replacements);
        };
      });
      return plugins;
    }
  };
};

export { RoamFlavoredMarkdown };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map