export function deserializeText(node: { type: string, value: string}) {
  if (node.type === 'text') return node.value === '\n' ? null : { text: node.value };
};
