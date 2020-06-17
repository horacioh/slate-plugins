/** @jsx jsx */

import { jsx } from "__test-utils__/jsx";
import { withDeserializeMd } from "deserializers/deserialize-md";
import { Editor } from "../../../../index";
import { withReact } from "slate-react";

const input = ((
  <editor>
    <hp>
      test
      <cursor />
    </hp>
  </editor>
) as any) as Editor;

// noinspection CheckTagEmptyBody
const data = {
  getData: () => "",
};

const output = (
  <editor>
    <hp>
      test
      <cursor />
    </hp>
  </editor>
) as any;

it("should do nothing", () => {
  const editor = withDeserializeMd(withReact(input));

  editor.insertData(data as any);

  expect(input.children).toEqual(output.children);
});
