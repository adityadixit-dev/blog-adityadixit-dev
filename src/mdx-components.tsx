import type { MDXComponents } from "mdx/types";
import Pre from "./components/helpers/Pre";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return {
    pre: (props) => <Pre {...props} />,
    ...components,
  };
}
