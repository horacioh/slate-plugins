import marked from "marked";
import { Node, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { SlatePlugin } from "../../common";
import { deserializeHTMLToDocument } from "../deserialize-html";
import { filterBreaklines } from "./utils";

/**
 * Enables support for deserializing content
 * from Markdown format to Slate format.
 */
export const withDeserializeMd = (plugins: SlatePlugin[]) => <
  T extends ReactEditor
>(
  editor: T
) => {
  const { insertData } = editor;

  editor.insertData = (data) => {
    const content = data.getData("text/plain");

    if (content) {
      const fragment = parseMd(content);

      // `filterBreaklines` filters all the breaklines in the pasted document
      const fragment: Node[] = deserializeHTMLToDocument(plugins)(
        parsed.body
      ).filter(filterBreaklines);

      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};
