import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useRef } from "react";

export default function MarkdownEditor({ initialValue, onChange }: { initialValue: any, onChange: (e: any) => void }) {
  const editorRef = useRef<Editor>(null);

  function handleChange() {
    const md = editorRef?.current
      ? editorRef?.current.getInstance().getMarkdown()
      : "";
    onChange(md);
  }

  return (
    <Editor
      height="300px"
      initialEditType="wysiwyg"
      initialValue={initialValue}
      onChange={handleChange}
      previewStyle="vertical"
      ref={editorRef}
      useCommandShortcut={true}
    />
  );
}