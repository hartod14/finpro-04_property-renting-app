"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  id: string;
  name: string;
  formik: any;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ id, name, formik }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: formik.values[name] || "",
    onUpdate: ({ editor }) => {
      formik.setFieldValue(name, editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "p-2 border rounded min-h-[150px]",
      },
    },
    // Fix SSR hydration mismatch
    enableCoreExtensions: false, // Prevents hydration mismatches
    editorConfig: {
      immediatelyRender: false, // Explicitly disable immediate rendering
    },
  });

  if (!isMounted) return <div className="p-2 border rounded">Loading editor...</div>;

  return (
    <div className="border rounded p-2">
      <EditorContent editor={editor} />
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
