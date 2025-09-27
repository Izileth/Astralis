import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import { Flex, IconButton, Separator, Box, Text } from '@radix-ui/themes';
import { 
  FontBoldIcon, 
  FontItalicIcon, 
  CodeIcon, 
  Link1Icon, 
  ListBulletIcon, 
  LayoutIcon
} from '@radix-ui/react-icons';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <Flex align="center" gap="3" p="2" style={{ border: '1px solid var(--gray-6)', borderRadius: 'var(--radius-3)' }}>
      <IconButton
        variant={editor.isActive('bold') ? 'solid' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FontBoldIcon />
      </IconButton>
      <IconButton
        variant={editor.isActive('italic') ? 'solid' : 'ghost'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FontItalicIcon />
      </IconButton>
      <IconButton
        variant={editor.isActive('code') ? 'solid' : 'ghost'}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon />
      </IconButton>
      <Separator orientation="vertical" />
      <IconButton
        variant={editor.isActive('bulletList') ? 'solid' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBulletIcon />
      </IconButton>
      <IconButton
        variant={editor.isActive('orderedList') ? 'solid' : 'ghost'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <LayoutIcon />
      </IconButton>
      <Separator orientation="vertical" />
      <IconButton
        variant={editor.isActive('link') ? 'solid' : 'ghost'}
        onClick={() => {
          const url = window.prompt('URL');
          if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }
        }}
      >
        <Link1Icon />
      </IconButton>
    </Flex>
  );
};

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlock,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-5 focus:outline-none',
      },
    },
  });

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} style={{ border: '1px solid var(--gray-6)', borderRadius: 'var(--radius-3)', marginTop: '8px', minHeight: '200px', padding: '8px' }}/>
      <Box mt="2">
        <Text size="1" color="gray">
          Use a barra de ferramentas para formatar. Atalhos: **negrito** (*Ctrl+B*), *itálico* (*Ctrl+I*), `código`.
        </Text>
      </Box>
    </div>
  );
}
