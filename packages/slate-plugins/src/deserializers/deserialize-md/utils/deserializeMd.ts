import markdown from 'remark-parse';
import unified from 'unified';
import slate from './remark-slate';



export function parseMd(content: string) {
  const tree: any = unified()
    .use(markdown)
    .use(slate)
    .processSync(content);

  return tree.result;
}
