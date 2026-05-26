// import type { Editor as TinyMCEEditor, EditorEvent, EditorOptions } from 'tinymce';

/**
 * NOTE: Update RichTextEditor.test.tsx with all additions and changes!
 */
export type RichTextEditorProps = {
  initialValue?: string;
  placeholder?: string;
  height?: string | number;
  onChange?: (event: any, editor: any) => void;
  onBlur?: (event: any, editor: any) => void;
  tinymceApiKey?: string;
  // Overwrites the default TinyMCE config defined in TS Design System.
  tinymceConfig?: any;
  // Handler for uploading images. See TinyMCE docs: https://www.tiny.cloud/docs/tinymce/latest/file-image-upload/#images_upload_handler
  imagesUploadHandler?: any;
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};
