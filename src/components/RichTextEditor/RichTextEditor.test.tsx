import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import RichTextEditor from './RichTextEditor';
import { RichTextEditorProps } from './RichTextEditor.types';

describe('RichTextEditor', () => {
  let props: RichTextEditorProps;

  it('should display text', () => {
    props = {
      initialValue: 'Test RichTextEditor',
      placeholder: 'e.g. Please send documents to....',
      onChange: (e) => console.log(e),
      height: 500,
      tinymceApiKey: 'TinyMCE API Key',
    };
    const { getByTestId } = render(<RichTextEditor {...props} />);
    const RichTextEditor_component = getByTestId('rich-text-editor-component');
    expect(RichTextEditor_component).not.toBeNull();
  });
});
