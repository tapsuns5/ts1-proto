import { forwardRef, memo, useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { cn } from "../../utils";
import { RichTextEditorProps } from "./RichTextEditor.types";

const editorToolbar = `
                  undo redo | cut copy paste | code | styles | fontfamily | fontsize | bold italic underline strikethrough forecolor backcolor |
                  link unlink image emoticons | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent hr | table tabledelete |
                  tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol
                `;

const defaultConfig = {
  menubar: false,
  resize: false,
  preview_styles: false,
  relative_urls: false,
  convert_urls: false,
  height: "340",
  toolbar_mode: "wrap",
  placeholder: "",
  plugins:
    "textpattern link image emoticons code lists advlist hr table powerpaste",
  contextmenu: "undo redo | cut copy paste",
  toolbar: editorToolbar,
  powerpaste_allow_local_images: true,
  powerpaste_googledocs_import: "merge",
  powerpaste_word_import: "merge",
  powerpaste_html_import: "merge",
};

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */

const RichTextEditor = memo(
  forwardRef<Editor, RichTextEditorProps>(
    (
      {
        className = "",
        initialValue = "",
        placeholder = "",
        height = "340",
        tinymceApiKey,
        tinymceConfig = {},
        onChange,
        imagesUploadHandler,
        onBlur,
        ...props
      },
      ref,
    ) => {
      const editorConfig = useMemo(
        () => ({
          ...defaultConfig,
          height,
          placeholder,
          images_upload_handler: imagesUploadHandler,
          ...tinymceConfig,
        }),
        [height, placeholder, imagesUploadHandler, tinymceConfig],
      );

      return (
        <div
          data-testid="rich-text-editor-component"
          className={cn("rich-text-editor__container", className)}
        >
          <Editor
            ref={ref}
            apiKey={tinymceApiKey}
            onChange={onChange}
            onBlur={onBlur}
            initialValue={initialValue}
            init={editorConfig}
            {...props}
          />
        </div>
      );
    },
  ),
);

export default RichTextEditor;
