import type { QuartzTransformerPlugin } from "@quartz-community/types";

export interface RoamOptions {
  orComponent: boolean;
  TODOComponent: boolean;
  DONEComponent: boolean;
  videoComponent: boolean;
  audioComponent: boolean;
  pdfComponent: boolean;
  blockquoteComponent: boolean;
  /** @deprecated Not implemented; has no effect. */
  tableComponent: boolean;
  /** @deprecated Not implemented; has no effect. */
  attributeComponent: boolean;
}

const defaultOptions: RoamOptions = {
  orComponent: true,
  TODOComponent: true,
  DONEComponent: true,
  videoComponent: true,
  audioComponent: true,
  pdfComponent: true,
  blockquoteComponent: true,
  tableComponent: true,
  attributeComponent: true,
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Split Markdown source into the parts Roam syntax may be rewritten in and the parts it must not
 * touch: frontmatter, fenced code blocks and inline code spans are kept as written.
 */
function splitProtected(src: string): { text: string; protected: boolean }[] {
  const parts: { text: string; protected: boolean }[] = [];
  let rest = src;
  const frontmatter = /^(---|\+\+\+)\r?\n[\s\S]*?\r?\n\1[ \t]*(?:\r?\n|$)/.exec(rest);
  if (frontmatter) {
    parts.push({ text: frontmatter[0], protected: true });
    rest = rest.slice(frontmatter[0].length);
  }
  // fenced code (``` or ~~~, closed by the same fence or the end of the file), then inline code
  const protectedRegex =
    /(^|\n)([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?(?:\n\2?\3[ \t]*(?=\n|$)|$)|(`+)[^`\n]*?\4/g;
  let last = 0;
  for (const match of rest.matchAll(protectedRegex)) {
    const start = match.index! + (match[1] ?? "").length;
    if (start > last) parts.push({ text: rest.slice(last, start), protected: false });
    parts.push({ text: rest.slice(start, match.index! + match[0].length), protected: true });
    last = match.index! + match[0].length;
  }
  if (last < rest.length) parts.push({ text: rest.slice(last), protected: false });
  return parts;
}

function embed(kind: string, rawUrl: string, opts: RoamOptions): string | null {
  const url = escapeHtml(rawUrl.trim());
  switch (kind.toLowerCase()) {
    case "audio":
      return opts.audioComponent
        ? `<audio controls><source src="${url}" type="audio/mpeg"><source src="${url}" type="audio/ogg">Your browser does not support the audio tag.</audio>`
        : null;
    case "video": {
      if (!opts.videoComponent) return null;
      const youtube = rawUrl.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&?#\s]+)/,
      );
      if (youtube?.[1]) {
        const list = rawUrl.match(/[?&]list=([^#&?]*)/)?.[1];
        const src = `https://www.youtube.com/embed/${encodeURIComponent(youtube[1])}${list ? `?list=${encodeURIComponent(list)}` : ""}`;
        return `<iframe class="external-embed youtube" width="600px" height="350px" src="${src}" frameborder="0" allow="fullscreen"></iframe>`;
      }
      return `<video controls><source src="${url}" type="video/mp4"><source src="${url}" type="video/webm">Your browser does not support the video tag.</video>`;
    }
    case "pdf":
      return opts.pdfComponent
        ? `<embed src="${url}" type="application/pdf" width="100%" height="600px" />`
        : null;
    default:
      return null;
  }
}

/** Rewrite Roam syntax in a stretch of Markdown that holds no code or frontmatter. */
function rewrite(text: string, opts: RoamOptions): string {
  let out = text;

  // {{[[video]]: url}}, {{video: url}} (and audio, pdf)
  out = out.replace(
    /\{\{\s*(?:\[\[)?(audio|video|pdf)(?:\]\])?\s*:\s*([^}\s]+)\s*\}\}/gi,
    (match, kind: string, url: string) => embed(kind, url, opts) ?? match,
  );

  // {{[[TODO]]}} / {{TODO}} and {{[[DONE]]}} / {{DONE}}: checkboxes
  if (opts.TODOComponent) {
    out = out.replace(/\{\{\s*(?:\[\[)?TODO(?:\]\])?\s*\}\}/g, '<input type="checkbox" disabled>');
  }
  if (opts.DONEComponent) {
    out = out.replace(
      /\{\{\s*(?:\[\[)?DONE(?:\]\])?\s*\}\}/g,
      '<input type="checkbox" checked disabled>',
    );
  }

  // {{or: a | b | c}}: a select
  if (opts.orComponent) {
    out = out.replace(/\{\{or:(.*?)\}\}/g, (_match, options: string) => {
      const items = options
        .split("|")
        .map((option) => escapeHtml(option.trim()))
        .filter(Boolean);
      return `<select>${items.map((o) => `<option value="${o}">${o}</option>`).join("")}</select>`;
    });
  }

  // [[>]] quote, at the start of a line (or after a list marker): a Markdown blockquote
  if (opts.blockquoteComponent) {
    out = out.replace(/^([ \t]*(?:(?:[-*+]|\d+[.)])[ \t]+)?)\[\[>\]\][ \t]*/gm, "$1> ");
  }

  // ^^highlight^^ (Roam) and __italic__ (Roam: underscores are italic, ** is bold)
  out = out.replace(/\^\^(?=\S)(.+?)(?<=\S)\^\^/g, '<span class="text-highlight">$1</span>');
  out = out.replace(/(?<![_\w])__(?=\S)(.+?)(?<=\S)__(?![_\w])/g, "*$1*");

  return out;
}

/**
 * Roam Research syntax. Applied to the Markdown source before it is parsed, so it works whatever
 * runs alongside: ObsidianFlavoredMarkdown parses `[[…]]` as wikilinks and CommonMark reads
 * `__x__` as bold, which made the Roam forms (`{{[[TODO]]}}`, `[[>]]`, `__italic__`) unreachable
 * for a plugin working on the parsed tree. Code blocks, inline code and frontmatter are left alone.
 */
export const RoamFlavoredMarkdown: QuartzTransformerPlugin<Partial<RoamOptions> | undefined> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts };

  return {
    name: "RoamFlavoredMarkdown",
    textTransform(_ctx, src) {
      return splitProtected(src)
        .map((part) => (part.protected ? part.text : rewrite(part.text, opts)))
        .join("");
    },
  };
};
