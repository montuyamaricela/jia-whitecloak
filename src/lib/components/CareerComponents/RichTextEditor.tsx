'use client';

import React, { useRef, useEffect } from 'react';

export default function RichTextEditor({ setText, text }) {
  const descriptionEditorRef = useRef(null);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    descriptionEditorRef.current?.focus();
  };

  const handleDescriptionChange = () => {
    if (descriptionEditorRef.current) {
      setText(descriptionEditorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');

    // Insert the plain text at cursor position
    document.execCommand('insertText', false, text);

    // Update the state
    handleDescriptionChange();
  };

  // Handle placeholder for contenteditable div
  useEffect(() => {
    const editor = descriptionEditorRef.current;
    if (editor) {
      const handleFocus = () => {
        if (editor.innerHTML === '' || editor.innerHTML === '<br>') {
          editor.innerHTML = '';
        }
      };

      const handleBlur = () => {
        if (editor.innerHTML === '' || editor.innerHTML === '<br>') {
          editor.innerHTML = '';
        }
      };

      editor.addEventListener('focus', handleFocus);
      editor.addEventListener('blur', handleBlur);

      return () => {
        editor.removeEventListener('focus', handleFocus);
        editor.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  useEffect(() => {
    if (
      descriptionEditorRef.current &&
      !descriptionEditorRef.current.innerHTML &&
      text
    ) {
      descriptionEditorRef.current.innerHTML = text;
    }
  }, []);

  return (
    <>
      <div
        ref={descriptionEditorRef}
        contentEditable={true}
        className='rich-text-editor-content'
        onInput={handleDescriptionChange}
        onBlur={handleDescriptionChange}
        onPaste={handlePaste}
        data-placeholder='Enter job description...'
      ></div>
      {/* Rich Text Editor Toolbar */}
      <div className='rich-text-editor-toolbar'>
        <button
          type='button'
          className='toolbar-button'
          onClick={() => formatText('bold')}
          title='Bold'
        >
          <img
            src='/icons/career/Monotone add.svg'
            alt='Bold'
            className='toolbar-icon'
          />
        </button>
        <button
          type='button'
          className='toolbar-button'
          onClick={() => formatText('italic')}
          title='Italic'
        >
          <img
            src='/icons/career/Monotone add-1.svg'
            alt='Italic'
            className='toolbar-icon'
          />
        </button>
        <button
          type='button'
          className='toolbar-button'
          onClick={() => formatText('underline')}
          title='Underline'
        >
          <img
            src='/icons/career/Monotone add-2.svg'
            alt='Underline'
            className='toolbar-icon'
          />
        </button>
        <button
          type='button'
          className='toolbar-button'
          onClick={() => formatText('strikeThrough')}
          title='Strikethrough'
        >
          <img
            src='/icons/career/Monotone add-3.svg'
            alt='Strikethrough'
            className='toolbar-icon'
          />
        </button>
        <button
          type='button'
          className='toolbar-button'
          onClick={() => formatText('insertOrderedList')}
          title='Numbered List'
        >
          <img
            src='/icons/career/Monotone add-4.svg'
            alt='Numbered List'
            className='toolbar-icon'
          />
        </button>
        <button
          type='button'
          className='toolbar-button'
          onClick={() => formatText('insertUnorderedList')}
          title='Bullet List'
        >
          <img
            src='/icons/career/Monotone add-5.svg'
            alt='Bullet List'
            className='toolbar-icon'
          />
        </button>
      </div>
      <style jsx>{`
        .rich-text-editor-content[data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #a4a7ae;
          pointer-events: none;
          position: absolute;
          top: 10px;
          left: 14px;
        }
      `}</style>
    </>
  );
}
