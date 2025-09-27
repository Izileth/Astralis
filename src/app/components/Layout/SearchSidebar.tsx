import { useState } from 'react';
import { Box, Flex, Text, TextField, Button, Separator, ScrollArea } from '@radix-ui/themes';
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons';

// Tipos
interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface SearchSidebarProps {
  categories?: Category[];
  tags?: Tag[];
  currentFilters?: {
    search?: string;
    categoryName?: string;
    tagNames?: string[];
  };
  onFiltersChange?: (filters: {
    search?: string;
    categoryName?: string;
    tagNames?: string[];
    page?: number;
  }) => void;
  onReset?: () => void;
}

// Mock data para demonstração
const mockCategories: Category[] = [
  { id: 1, name: 'Política' },
  { id: 2, name: 'Economia' },
  { id: 3, name: 'Esportes' },
  { id: 4, name: 'Cultura' },
  { id: 5, name: 'Tecnologia' }
];

const mockTags: Tag[] = [
  { id: 1, name: 'Eleições' },
  { id: 2, name: 'Mercado' },
  { id: 3, name: 'Futebol' },
  { id: 4, name: 'Cinema' },
  { id: 5, name: 'IA' },
  { id: 6, name: 'Saúde' },
  { id: 7, name: 'Educação' }
];

export function SearchSidebar({
  categories = mockCategories,
  tags = mockTags,
  currentFilters = {},
  onFiltersChange,
  onReset: onResetProp
}: SearchSidebarProps) {
  const [searchTerm, setSearchTerm] = useState<string>(currentFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(currentFilters.categoryName || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tagNames || []);

  const handleSearch = (): void => {
    if (onFiltersChange) {
      onFiltersChange({ 
        search: searchTerm, 
        categoryName: selectedCategory, 
        tagNames: selectedTags, 
        page: 1 
      });
    }
  };

  const handleCategoryChange = (categoryName: string): void => {
    const newCategory = categoryName === selectedCategory ? '' : categoryName;
    setSelectedCategory(newCategory);
    if (onFiltersChange) {
      onFiltersChange({ 
        search: searchTerm, 
        categoryName: newCategory, 
        tagNames: selectedTags, 
        page: 1 
      });
    }
  };

  const handleTagChange = (tagName: string): void => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter((t: string) => t !== tagName)
      : [...selectedTags, tagName];
    setSelectedTags(newTags);
    if (onFiltersChange) {
      onFiltersChange({ 
        search: searchTerm, 
        categoryName: selectedCategory, 
        tagNames: newTags, 
        page: 1 
      });
    }
  };

  const handleReset = (): void => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    if (onResetProp) {
      onResetProp();
    }
    if (onFiltersChange) {
      onFiltersChange({ search: '', categoryName: '', tagNames: [], page: 1 });
    }
  };

  const hasFilters: boolean = Boolean(searchTerm || selectedCategory || selectedTags.length > 0);

  return (
    <Box className="h-full w-full md:w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <Box className="px-6 py-4 border-b border-gray-200">
        <Flex align="center" justify="between">
          <Text size="4" weight="bold" className="font-serif text-red-600 uppercase tracking-wide">
            Filtros
          </Text>
          {hasFilters && (
            <Button
              variant="ghost"
              size="2"
              onClick={handleReset}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <Cross2Icon width="16" height="16" />
            </Button>
          )}
        </Flex>
      </Box>

      <ScrollArea className="flex-grow">
        <Box className="p-6">
          {/* Search Input */}
          <Box className="mb-6">
            <Text 
              as="label" 
              size="2" 
              weight="bold" 
              className="block mb-3 text-gray-500 font-sans uppercase tracking-wider text-xs"
            >
              Buscar Notícias
            </Text>
            <Flex align="center" pt={'2'} gap="2">
              <TextField.Root
                placeholder="Digite palavras-chave..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button
                variant="ghost"
                onClick={handleSearch}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <MagnifyingGlassIcon width="16" height="16" />
              </Button>
            </Flex>
          </Box>

          <Separator size="4" className="my-6" />

          {/* Categories */}
          <Box className="mb-6">
            <Text 
              as="label" 
              size="2" 
              weight="bold" 
              className="block mb-4 text-gray-500 font-sans uppercase tracking-wider text-xs"
            >
              Editorias
            </Text>
            <div className='flex justify-start gap-1 pt-2 items-center flex-wrap '>
              {categories.map((category: Category) => (
                <Button
                  key={category.id}
                  color='tomato'
                  variant="ghost"
                  onClick={() => handleCategoryChange(category.name)}
                  className={`
                    w-full justify-start px-4 py-3 text-left transition-all duration-200 font-sans font-medium
                    border-l-4 border-transparent hover:border-l-red-600 hover:bg-red-50
                    ${selectedCategory === category.name 
                      ? 'border-l-red-600 bg-red-50 text-red-700' 
                      : 'text-black hover:text-red-700'
                    }
                  `}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </Box>

          <Separator size="4" className="my-6" />

          {/* Tags */}
          <Box className="mb-6">
            <Text 
              as="label" 
              size="2" 
              weight="bold" 
              className="block mb-4 text-gray-500 font-sans uppercase tracking-wider text-xs"
            >
              Assuntos
            </Text>
            <Flex wrap="wrap" pt={'2'} gap="2">
              {tags.map((tag: Tag) => (
                <Button
                  key={tag.id}
                  size="1"
                  variant={selectedTags.includes(tag.name) ? "solid" : "outline"}
                  color={selectedTags.includes(tag.name) ? "red" : "gray"}
                  onClick={() => handleTagChange(tag.name)}
                  className="font-sans text-xs transition-all duration-200"
                >
                  #{tag.name}
                </Button>
              ))}
            </Flex>
          </Box>

          {/* Active Filters Summary */}
          {hasFilters && (
            <>
              <Separator size="4" className="my-6" />
              <Box className="p-4 bg-gray-50 rounded">
                <Text 
                  size="2" 
                  weight="bold" 
                  className="block mb-3 text-gray-500 font-sans uppercase tracking-wider text-xs"
                >
                  Filtros Ativos
                </Text>
                <Flex direction="column" gap="1">
                  {searchTerm && (
                    <Text size="1" className="text-gray-700 font-sans">
                      Busca: <Text weight="medium">"{searchTerm}"</Text>
                    </Text>
                  )}
                  {selectedCategory && (
                    <Text size="1" className="text-gray-700 font-sans">
                      Editoria: <Text weight="medium">{selectedCategory}</Text>
                    </Text>
                  )}
                  {selectedTags.length > 0 && (
                    <Text size="1" className="text-gray-700 font-sans">
                      Assuntos: <Text weight="medium">{selectedTags.join(', ')}</Text>
                    </Text>
                  )}
                </Flex>
              </Box>
            </>
          )}
        </Box>
      </ScrollArea>

      {/* Footer */}
      <Box className="p-6 border-t border-gray-200">
        <Button
          variant="outline"
          color="red"
          onClick={handleReset}
          disabled={!hasFilters}
          className="w-full font-sans font-medium transition-all duration-200"
        >
          Limpar Todos os Filtros
        </Button>
      </Box>
    </Box>
  );
}