import { useState} from 'react';
import type { KeyboardEvent } from 'react';
import { Flex, Text, Badge, TextField, Box } from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  existingTags?: string[];
}

export function TagInput({ value, onChange, existingTags = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const addTag = (tagToAdd: string) => {
    if (!value.includes(tagToAdd)) {
      onChange([...value, tagToAdd]);
    }
  };

  return (
    <Box>
      <Text as="label" size="2" weight="bold">Tags</Text>
      <Flex wrap="wrap" gap="2" my="2">
        {value.map(tag => (
          <Badge key={tag} color="gray" variant="solid">
            {tag}
            <button onClick={() => removeTag(tag)} style={{ marginLeft: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Cross1Icon width="12" height="12" />
            </button>
          </Badge>
        ))}
      </Flex>
      <TextField.Root
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Adicione tags (pressione Enter ou vírgula)"
      />
      {existingTags.length > 0 && (
        <Flex wrap="wrap" gap="2" mt="2">
          <Text size="1">Tags existentes:</Text>
          {existingTags.map(tag => (
            <button key={tag} onClick={() => addTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Badge color="gray" variant="soft">{tag}</Badge>
            </button>
          ))}
        </Flex>
      )}
    </Box>
  );
}
