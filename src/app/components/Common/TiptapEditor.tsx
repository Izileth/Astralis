import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Code, 
  Link as LinkIcon, 
  List, 
  ListOrdered,
  Underline as UnderlineIcon,
  Quote,
  Pilcrow,
  Heading1,
  Heading2,
  Minus
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/app/lib/utils';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const toolbarItems = [
    {
      icon: Heading1,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      tooltip: 'Título 1 (Ctrl+Alt+1)',
    },
    {
      icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      tooltip: 'Título 2 (Ctrl+Alt+2)',
    },
    {
      icon: Pilcrow,
      onClick: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
      tooltip: 'Parágrafo (Ctrl+Alt+0)',
    },
    { type: 'separator' },
    {
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: 'Negrito (Ctrl+B)',
    },
    {
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: 'Itálico (Ctrl+I)',
    },
    {
      icon: UnderlineIcon,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      tooltip: 'Sublinhado (Ctrl+U)',
    },
    {
      icon: Code,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      tooltip: 'Código em linha (Ctrl+E)',
    },
    { type: 'separator' },
    {
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: 'Lista com marcadores',
    },
    {
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      tooltip: 'Lista ordenada',
    },
    {
      icon: Quote,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      tooltip: 'Citação',
    },
    { type: 'separator' },
    {
      icon: Minus,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      tooltip: 'Linha horizontal',
    },
    {
      icon: LinkIcon,
      onClick: () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        
        if (url === null) return;
        if (url === '') {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return;
        }
        
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      },
      isActive: editor.isActive('link'),
      tooltip: 'Link (Ctrl+K)',
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-1 p-2 border border-border rounded-t-lg bg-muted/20">
        {toolbarItems.map((item, index) => {
          if (item.type === 'separator') {
            return <Separator key={`separator-${index}`} orientation="vertical" className="h-6" />;
          }

          return (
            <Tooltip key={item.tooltip}>
              <TooltipTrigger asChild>
                <Button
                  variant={item.isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={item.onClick}
                  className={cn(
                    "h-8 w-8 p-0",
                    item.isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{item.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export function TiptapEditor({ 
  value, 
  onChange, 
  placeholder = "Escreva seu conteúdo aqui...",
  minHeight = "200px" 
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-muted p-4 rounded-md font-mono text-sm',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none p-4 min-h-[120px]',
        'data-testid': 'tiptap-editor',
      },
    },
  });

  return (
    <div className="space-y-3">
      <Toolbar editor={editor} />
      
      <div className={cn(
        "border border-border rounded-b-lg bg-background transition-colors",
        "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
      )}>
        <EditorContent 
          editor={editor} 
          style={{ minHeight }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="space-y-1">
          <p>Use a barra de ferramentas para formatar seu texto.</p>
          <p>
            Atalhos: <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">Ctrl+B</kbd> negrito, 
            <kbd className="px-1 py-0.5 text-xs bg-muted rounded border mx-1">Ctrl+I</kbd> itálico, 
            <kbd className="px-1 py-0.5 text-xs bg-muted rounded border mx-1">Ctrl+K</kbd> link
          </p>
        </div>
        
        {editor && (
          <div className="text-right">
            <p className="font-medium">
              {editor.storage.characterCount?.characters() || 0} caracteres
            </p>
            <p>
              {editor.storage.characterCount?.words() || 0} palavras
            </p>
          </div>
        )}
      </div>
    </div>
  );
}