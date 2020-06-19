import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { SlatePlugin } from '../../common';
import { deserializeMD } from './utils';
/**
 * Enables support for deserializing content
 * from Markdown format to Slate format.
 */

export interface WithDeserializeMDOptions {
  plugins?: SlatePlugin[];
  types?: any;
}

export const withDeserializeMD = ({
  plugins = [],
}: WithDeserializeMDOptions) => <T extends ReactEditor>(editor: T) => {
  const { insertData } = editor;

  const inlineTypes = plugins.reduce((arr: string[], plugin) => {
    const types = plugin.inlineTypes || [];
    return arr.concat(types);
  }, []);

  editor.insertData = (data) => {
    const content = data.getData('text/plain');

    if (content) {
      const fragment = deserializeMD({ content });
      // eslint-disable-next-line no-console
      console.log('editor.insertData -> fragment', fragment);
      const firstNodeType = fragment[0].type as string | undefined;

      // replace the selected node type by the first block type
      if (firstNodeType && !inlineTypes.includes(firstNodeType)) {
        Transforms.setNodes(editor, { type: fragment[0].type });
      }

      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};
