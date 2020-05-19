import { BLOCKQUOTE, HeadingType, LINK, ListType, PARAGRAPH } from 'elements';
import markdown from 'remark-parse';
import unified from 'unified';
import slate from './remark-slate';

const nodes = {
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

export function parseMd(content: string) {
  const tree: any = unified()
    .use(markdown)
    .use(slate, { nodeTypes: nodes })
    .processSync(content);

  return tree.result;
}
