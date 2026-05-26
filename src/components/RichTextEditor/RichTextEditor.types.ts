import type { Editor as TinyMCEEditor, EditorEvent, EditorOptions } from 'tinymce';

/**
 * NOTE: Update RichTextEditor.test.tsx with all additions and changes!
 */
export type RichTextEditorProps = {
  initialValue?: string;
  placeholder?: string;
  height?: string | number;
  onChange?: (event: EditorEvent<unknown>, editor: TinyMCEEditor) => void;
  onBlur?: (event: EditorEvent<unknown>, editor: TinyMCEEditor) => void;
  tinymceApiKey?: string;
  // Overwrites the default TinyMCE config defined in TS Design System.
  tinymceConfig?: any;
  // Handler for uploading images. See TinyMCE docs: https://www.tiny.cloud/docs/tinymce/latest/file-image-upload/#images_upload_handler
  imagesUploadHandler?: EditorOptions['images_upload_handler'];
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};
