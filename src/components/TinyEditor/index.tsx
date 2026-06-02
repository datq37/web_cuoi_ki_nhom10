import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './index.less';

export interface TinyEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
}

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean'],
];

const TinyEditor: React.FC<TinyEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  readOnly = false,
  minHeight = 160,
}) => {
  const quillRef = useRef<any>(null);

  // Đặt min-height cho editor area
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (editor) {
        editor.root.style.minHeight = `${minHeight}px`;
      }
    }
  }, [minHeight]);

  return (
    <div className={`${styles.wrap} ${readOnly ? styles.readOnly : ''}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        modules={{ toolbar: readOnly ? false : TOOLBAR }}
      />
    </div>
  );
};

export default TinyEditor;
