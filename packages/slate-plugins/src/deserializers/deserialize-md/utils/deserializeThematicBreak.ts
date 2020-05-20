
// TODO: maybe we need to compile this into something else?
// thematicBreak === `---`

export function deserializeThematicBreak(node: any, types: any) {
  if (node.type === 'thematicBreak') return { text: '\n'};
}; 
  