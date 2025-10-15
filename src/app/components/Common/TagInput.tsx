import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { X, Plus, Tag, ChevronDown } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  existingTags?: string[];
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

export function TagInput({ 
  value, 
  onChange, 
  existingTags = [], 
  maxTags = 10,
  placeholder = "Adicione tags...",
  className 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const availableExistingTags = existingTags.filter(tag => 
    !value.includes(tag) && 
    tag.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 5);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === ';') {
      event.preventDefault();
      addNewTag();
    } else if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const addNewTag = () => {
    const newTag = inputValue.trim().toLowerCase();
    
    if (!newTag) return;
    
    if (value.length >= maxTags) return;
    if (value.includes(newTag)) return;
    if (newTag.length > 20) return;

    onChange([...value, newTag]);
    setInputValue('');
    setOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const addExistingTag = (tagToAdd: string) => {
    if (value.length >= maxTags) return;
    if (!value.includes(tagToAdd)) {
      onChange([...value, tagToAdd]);
      setInputValue('');
      setOpen(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor="tag-input" className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Tags {value.length > 0 && <span className="text-muted-foreground">({value.length}/{maxTags})</span>}
      </Label>

      {/* Tags selecionadas */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-muted/20 min-h-[52px]">
          {value.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1 py-1.5 px-3 text-sm group"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive ml-1"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remover tag {tag}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input com autocomplete */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              id="tag-input"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={value.length >= maxTags ? `Máximo de ${maxTags} tags atingido` : placeholder}
              disabled={value.length >= maxTags}
              className={cn(
                "pr-10",
                value.length >= maxTags && "opacity-50 cursor-not-allowed"
              )}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Buscar tags..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>Nenhuma tag encontrada.</CommandEmpty>
              <CommandGroup>
                {inputValue.trim() && (
                  <CommandItem onSelect={addNewTag}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar tag: "{inputValue.trim()}"
                  </CommandItem>
                )}
                {availableExistingTags.map(tag => (
                  <CommandItem 
                    key={tag} 
                    onSelect={() => addExistingTag(tag)}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Informações */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Digite e selecione das sugestões ou pressione Enter para criar</p>
        <p>• Máximo de {maxTags} tags • Máximo de 20 caracteres por tag</p>
      </div>
    </div>
  );
}