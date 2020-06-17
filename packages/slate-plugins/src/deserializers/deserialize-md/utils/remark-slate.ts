/* eslint-disable camelcase */
import merge from "deepmerge";
import {
  BLOCKQUOTE,
  HeadingType,
  LINK,
  ListType,
  PARAGRAPH,
  CODE_BLOCK,
} from "elements";
import {
  deserializeText,
  deserializeThematicBreak,
  deserializeCodeBlock,
} from "deserializers/deserialize-md/utils";
// import {  } from './deserializeThematicBreak'

export const mdNodeTypes = {
  paragraph: PARAGRAPH,
  block_quote: BLOCKQUOTE,
  link: LINK,
  ul_list: ListType.UL,
  ol_list: ListType.OL,
  listItem: ListType.LI,
  code: CODE_BLOCK,
  heading: {
    1: HeadingType.H1,
    2: HeadingType.H2,
    3: HeadingType.H3,
    4: HeadingType.H4,
    5: HeadingType.H5,
    6: HeadingType.H6,
  },
};

function forceLeafNode(children: any) {
  return { text: children.map((k: any) => k.text).join("") };
}

export function transform(node: any, opts: any) {
  const settings = opts || {};
  const userTypes = settings.nodeTypes || {};
  const types = merge(mdNodeTypes, userTypes);

  // const parentNode = node.parentNode || null;
  let children = [{ text: "" }];

  // text node
  const textNode = deserializeText(node);
  if (textNode) return textNode;

  // if not an element node
  // ??????

  // break line
  const breakLine = deserializeThematicBreak(node, types);
  if (breakLine) return breakLine;

  const { type } = node;
  let parent = node;

  //codeBlock
  const codeBlockNode = deserializeCodeBlock(node, types);
  if (codeBlockNode) return codeBlockNode;

  if (Array.isArray(node.children) && node.children.length > 0) {
    children = node.children.map(function (c: any) {
      return transform(
        merge(c, {
          parentNode: node,
          ordered: node.ordered || false,
        }),
        settings
      );
    });
  }

  switch (node.type) {
    case "heading":
      return {
        type: types.heading[node.depth],
        children,
      };

    case "list":
      return {
        type: node.ordered ? types.ol_list : types.ul_list,
        children,
      };

    case "listItem":
      return {
        type: types.listItem,
        children,
      };

    case "emphasis":
      return merge(forceLeafNode(children), { italic: true });

    case "strong":
      return merge(forceLeafNode(children), { bold: true });

    case "delete":
      return merge(forceLeafNode(children), { strikeThrough: true });

    case "paragraph":
      return {
        type: types.paragraph,
        children,
      };

    case "link":
      return {
        type: types.link,
        link: node.url,
        children,
      };

    case "blockquote":
      return {
        type: types.block_quote,
        children,
      };

    case "html":
      if (node.value === "<br>") {
        return {
          type: types.paragraph,
          children: [{ text: "" }],
        };
      }

    case "text":
    default:
      return {
        text: node.value || "",
      };
  }
}

export default function plugin(this: any, opts?: any) {
  const settings = opts || {};
  const userTypes = settings.nodeTypes || {};
  const nodeTypes = merge(mdNodeTypes, userTypes);
  this.Compiler = function compiler(node: any) {
    return node.children.map((c: any) =>
      transform(c, merge(settings, { nodeTypes }))
    );
  };
}
