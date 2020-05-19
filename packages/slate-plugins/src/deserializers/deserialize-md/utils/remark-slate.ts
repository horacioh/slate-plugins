/* eslint-disable camelcase */
import merge from 'deepmerge';

export const mdNodeTypes = {
  paragraph: 'paragraph',
  block_quote: 'block_quote',
  link: 'link',
  ul_list: 'ul_list',
  ol_list: 'ol_list',
  listItem: 'list_item',
  heading: {
    1: 'heading_one',
    2: 'heading_two',
    3: 'heading_three',
    4: 'heading_four',
    5: 'heading_five',
    6: 'heading_three',
  },
};

function forceLeafNode(children: any) {
  return { text: children.map((k: any) => k.text).join('') };
}

export function transform(node: any, opts: any) {
  const settings = opts || {};
  const userTypes = settings.nodeTypes || {};
  const types = merge(mdNodeTypes, userTypes);

  // const parentNode = node.parentNode || null;
  let children = [{ text: '' }];

  if (Array.isArray(node.children) && node.children.length > 0) {
    children = node.children.map(function(c: any) {
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
    case 'heading':
      return {
        type: types.heading[node.depth],
        children,
      };

    case 'list':
      return {
        type: node.ordered ? types.ol_list : types.ul_list,
        children,
      };

    case 'listItem':
      return {
        type: types.listItem,
        children,
      };

    case 'emphasis':
      return merge(forceLeafNode(children), { italic: true });

    case 'strong':
      return merge(forceLeafNode(children), { bold: true });

    case 'delete':
      return merge(forceLeafNode(children), { strikeThrough: true });

    case 'paragraph':
      return {
        type: types.paragraph,
        children,
      };

    case 'link':
      return {
        type: types.link,
        link: node.url,
        children,
      };

    case 'blockquote':
      return {
        type: types.block_quote,
        children,
      };

    case 'html':
      if (node.value === '<br>') {
        return {
          type: types.paragraph,
          children: [{ text: '' }],
        };
      }

    case 'text':
    default:
      return {
        text: node.value || '',
      };
  }
}

export default function plugin(this: any, opts: any) {
  const settings = opts || {};
  this.Compiler = function compiler(node: any) {
    return node.children.map((c: any) => transform(c, settings));
  };
}
