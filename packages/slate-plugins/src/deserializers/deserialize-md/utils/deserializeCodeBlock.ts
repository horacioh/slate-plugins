// TODO: Fixme types
export function deserializeCodeBlock(node: any, types: any) {
    if (node.type === types.code) return {
        type: types.code,
        children: [{ text: node.value}]
    }
}