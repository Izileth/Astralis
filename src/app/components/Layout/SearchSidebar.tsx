import { useState } from 'react';
import { Box, Flex, Text, TextField, Button, Separator, ScrollArea } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { usePostFilters, useCategories, useTags } from '../../hooks/usePost';

export function SearchSidebar() {
  const { applyFilters, resetFilters, currentFilters } = usePostFilters();
  const { categories } = useCategories();
  const { tags } = useTags();

  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.categoryName || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tagNames || []);

  const handleSearch = () => {
    applyFilters({ ...currentFilters, search: searchTerm, page: 1 });
  };

  const handleCategoryChange = (categoryName: string) => {
    const newCategory = categoryName === selectedCategory ? '' : categoryName;
    setSelectedCategory(newCategory);
    applyFilters({ ...currentFilters, categoryName: newCategory, page: 1 });
  };

  const handleTagChange = (tagName: string) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    setSelectedTags(newTags);
    applyFilters({ ...currentFilters, tagNames: newTags, page: 1 });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    resetFilters();
  };

  return (
    <Box className="h-full w-full md:w-80 bg-white border-l border-red-200 flex flex-col">
      <Box p="4" className="border-b border-red-200">
        <Text size="4" weight="bold" className="text-red-600">Filtros</Text>
      </Box>

      <ScrollArea className="flex-grow">
        <Box p="4">
          <Flex direction="column" gap="4">
            {/* Search Input */}
            <Box>
              <Text as="label" size="2" weight="bold" className="text-gray-700 mb-2 block">Pesquisar</Text>
              <TextField.Root>
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
                <TextField.Root
                  placeholder="Buscar por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </TextField.Root>
            </Box>

            <Separator size="4" />

            {/* Categories */}
            <Box>
              <Text as="label" size="2" weight="bold" className="text-gray-700 mb-2 block">Categorias</Text>
              <Flex direction="column" gap="2">
                {Array.isArray(categories) && categories.map(category => (
                  <Button 
                    key={category.id} 
                    variant={selectedCategory === category.name ? 'solid' : 'soft'}
                    color={selectedCategory === category.name ? 'red' : 'gray'}
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </Flex>
            </Box>

            <Separator size="4" />

            {/* Tags */}
            <Box>
              <Text as="label" size="2" weight="bold" className="text-gray-700 mb-2 block">Tags</Text>
              <Flex wrap="wrap" gap="2">
                {Array.isArray(tags) && tags.map(tag => (
                  <Button 
                    key={tag.id} 
                    size="1"
                    variant={selectedTags.includes(tag.name) ? 'solid' : 'soft'}
                    color={selectedTags.includes(tag.name) ? 'red' : 'gray'}
                    onClick={() => handleTagChange(tag.name)}
                  >
                    {tag.name}
                  </Button>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Box>
      </ScrollArea>

      <Box p="4" className="border-t border-red-200 mt-auto">
        <Button color="red" variant="outline" onClick={handleReset} className="w-full">Limpar Filtros</Button>
      </Box>
    </Box>
  );
}
