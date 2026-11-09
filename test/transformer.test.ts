import { describe, expect, it } from "vitest";
import { RoamFlavoredMarkdown } from "../src/transformer";

const transform = (src: string, opts = {}) =>
  RoamFlavoredMarkdown(opts).textTransform!({} as never, src);

describe("Roam syntax, rewritten before parsing (works alongside ObsidianFlavoredMarkdown)", () => {
  it("turns {{[[TODO]]}} and {{[[DONE]]}} into checkboxes", () => {
    expect(transform("{{[[TODO]]}} write")).toBe('<input type="checkbox" disabled> write');
    expect(transform("{{DONE}} done")).toBe('<input type="checkbox" checked disabled> done');
  });

  it("turns [[>]] into a blockquote, also inside a list item", () => {
    expect(transform("[[>]] quoted")).toBe("> quoted");
    expect(transform("- [[>]] quoted")).toBe("- > quoted");
  });

  it("turns {{or: a|b}} into a select, escaping the options", () => {
    expect(transform("{{or: a | <b>}}")).toBe(
      '<select><option value="a">a</option><option value="&lt;b&gt;">&lt;b&gt;</option></select>',
    );
  });

  it("embeds {{[[video]]: url}}, YouTube as an iframe", () => {
    expect(transform("{{[[video]]: https://youtu.be/abc?list=L1}}")).toContain(
      'src="https://www.youtube.com/embed/abc?list=L1"',
    );
    expect(transform("{{pdf: https://x.org/a.pdf}}")).toBe(
      '<embed src="https://x.org/a.pdf" type="application/pdf" width="100%" height="600px" />',
    );
  });

  it("reads __x__ as italic and ^^x^^ as a highlight", () => {
    expect(transform("an __italic__ and ^^bright^^ word")).toBe(
      'an *italic* and <span class="text-highlight">bright</span> word',
    );
    expect(transform("snake_case__name stays")).toBe("snake_case__name stays");
  });

  it("leaves frontmatter, code blocks and inline code alone", () => {
    const src = [
      "---",
      "title: __x__",
      "---",
      "`{{[[TODO]]}}` and {{[[TODO]]}}",
      "```",
      "[[>]] code",
      "```",
      "[[>]] real",
    ].join("\n");
    expect(transform(src)).toBe(
      [
        "---",
        "title: __x__",
        "---",
        '`{{[[TODO]]}}` and <input type="checkbox" disabled>',
        "```",
        "[[>]] code",
        "```",
        "> real",
      ].join("\n"),
    );
  });

  it("respects disabled components", () => {
    expect(transform("{{[[TODO]]}}", { TODOComponent: false })).toBe("{{[[TODO]]}}");
    expect(transform("[[>]] q", { blockquoteComponent: false })).toBe("[[>]] q");
  });
});
