import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import {
  BlockquotePlugin,
  BoldPlugin,
  CodeBlockPlugin,
  CodePlugin,
  EditablePlugins,
  HeadingPlugin,
  ImagePlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  ParagraphPlugin,
  pipe,
  SlateDocument,
  StrikethroughPlugin,
  TablePlugin,
  UnderlinePlugin,
  withDeserializeMD,
  withImageUpload,
  withInlineVoid,
  withLink,
  withTable,
} from '../../packages/slate-plugins/src';
import { initialValuePasteMD, nodeTypes } from '../config/initialValues';

export default {
  title: 'Deserializers/Markdown',
  component: withDeserializeMD,
};

const plugins = [
  ParagraphPlugin(nodeTypes),
  BlockquotePlugin(nodeTypes),
  CodeBlockPlugin(nodeTypes),
  HeadingPlugin(nodeTypes),
  ImagePlugin(nodeTypes),
  LinkPlugin(nodeTypes),
  ListPlugin(nodeTypes),
  TablePlugin(nodeTypes),
  BoldPlugin(nodeTypes),
  CodePlugin(nodeTypes),
  ItalicPlugin(nodeTypes),
  StrikethroughPlugin(nodeTypes),
  UnderlinePlugin(nodeTypes),
];

const withPlugins = [
  withReact,
  withHistory,
  withLink(),
  withDeserializeMD({ plugins }),
  withImageUpload(),
  withTable(nodeTypes),
  withInlineVoid({ plugins }),
] as const;

export const Example = () => {
  const createReactEditor = () => () => {
    const [value, setValue] = useState(initialValuePasteMD);

    const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

    return (
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue as SlateDocument)}
      >
        <EditablePlugins
          plugins={plugins}
          placeholder="Paste in some Markdown..."
        />
      </Slate>
    );
  };

  const Editor = createReactEditor();

  return <Editor />;
};
