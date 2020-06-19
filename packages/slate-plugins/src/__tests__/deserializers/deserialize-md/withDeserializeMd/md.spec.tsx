/** @jsx jsx */

import { jsx } from '__test-utils__/jsx';
import { withDeserializeMD } from 'deserializers/deserialize-md';
import { BoldPlugin } from 'marks/bold';
import { Editor } from 'slate';
import { withReact } from 'slate-react';

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
  getData: () => '# inserted',
};

const output = (
  <editor>
    <hh1>
      testinserted
      <cursor />
    </hh1>
  </editor>
) as any;

it('should insert an H1 in teh editor', () => {
  const editor = withDeserializeMD({ plugins: [BoldPlugin()] })(
    withReact(input)
  );

  editor.insertData(data as any);
  expect(input.children).toEqual(output.children);
});
