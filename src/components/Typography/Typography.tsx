import type { PropsWithChildren } from "react";
import type { JSX } from "react/jsx-runtime";

type LevelType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "caption";

export default function Typography({
  level,
  children,
}: PropsWithChildren<{
  level?: LevelType;
}>): JSX.Element {
  const Element = level ? level : "p";
  return <Element>{children}</Element>;
}
