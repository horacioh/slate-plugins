import marked from "marked";
import { Node, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { SlatePlugin } from "../../common";
import { deserializeHTMLToDocument } from "../deserialize-html";
import { parseMd } from "./utils";
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
      const body = parseMd(content);
      console.log("editor.insertData -> body", body);

      // `filterBreaklines` filters all the breaklines in the pasted document
      const fragment: Node[] = deserializeHTMLToDocument(plugins)(body);

      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};
