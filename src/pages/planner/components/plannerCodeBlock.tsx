import { h, JSX } from "preact";
import { PlannerHighlighter } from "../plannerHighlighter";

interface IPlannerCodeBlockProps {
  script: string;
}

export function PlannerCodeBlock(props: IPlannerCodeBlockProps): JSX.Element {
  const { script } = props;
  const highlightedScript = PlannerHighlighter.highlight(script);
  return <div className="whitespace-pre" dangerouslySetInnerHTML={{ __html: highlightedScript }} />;
}
