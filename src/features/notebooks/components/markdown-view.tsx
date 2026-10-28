import { RichText } from "@/components/shared/rich-text";

/** Minimal Markdown for notebook text cells: headings, bullet lists and paragraphs. */
export function MarkdownView({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="ml-5 list-disc space-y-1">
          {list.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  source.split("\n").forEach((line, i) => {
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flushList();
    if (!line.trim()) return;
    if (line.startsWith("## ")) {
      blocks.push(
        <h3 key={i} className="text-base font-semibold">
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("# ")) {
      blocks.push(
        <h2 key={i} className="text-lg font-semibold tracking-tight">
          {line.slice(2)}
        </h2>,
      );
    } else {
      blocks.push(
        <p key={i}>
          <RichText text={line} />
        </p>,
      );
    }
  });
  flushList();

  return <div className="space-y-2 text-sm leading-relaxed">{blocks}</div>;
}
