/* eslint-disable prettier/prettier */
import { BLOCKQUOTE, HeadingType, LINK, ListType, PARAGRAPH } from 'elements';
import markdown from 'remark-parse';
import slate from 'remark-slate';
import unified from 'unified';

export const defaultNodeTypes = {
  paragraph: PARAGRAPH,
  block_quote: BLOCKQUOTE,
  link: LINK,
  ul_list: ListType.UL,
  ol_list: ListType.OL,
  listItem: ListType.LI,
  heading: {
    1: HeadingType.H1,
    2: HeadingType.H2,
    3: HeadingType.H3,
    4: HeadingType.H4,
    5: HeadingType.H5,
    6: HeadingType.H6,
  },
};

export interface DeserializeMDOptions {
  content: any;
  nodeTypes?: any;
}

export function deserializeMD({
  content,
  nodeTypes = defaultNodeTypes,
}: DeserializeMDOptions) {
  const tree: any = unified()
    .use(markdown)
    .use(slate, { nodeTypes })
    .processSync(content);
  // eslint-disable-next-line no-console

  return tree.result;
}
