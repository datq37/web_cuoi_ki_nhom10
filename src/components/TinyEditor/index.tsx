import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from './index.less';

export interface TinyEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
}

const TinyEditor: React.FC<TinyEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  readOnly = false,
  minHeight = 160,
}) => {
  const editorRef = useRef<any>(null);

  return (
    <div className={`${styles.wrap} ${readOnly ? styles.readOnly : ''}`}>
      <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onChange}
        disabled={readOnly}
        init={{
          height: minHeight,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: readOnly ? false : 'undo redo | formatselect | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder
        }}
      />
    </div>
  );
};

export default TinyEditor;
