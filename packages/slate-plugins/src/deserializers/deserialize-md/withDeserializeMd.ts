import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { parseMd } from './utils';

export const withDeserializeMd = <T extends ReactEditor>(editor: T) => {
  const { insertData } = editor;

  editor.insertData = data => {
    const content = data.getData('text/plain');

    if (content) {
      const fragment = parseMd(content);

      if (!fragment.length) return;

      if (fragment[0].type) {
        Transforms.setNodes(editor, { type: fragment[0].type });
      }

      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};
