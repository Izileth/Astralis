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
    <Box className="h-full w-full md:w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <Box className="px-6 py-4 bg-red-600">
        <Flex align="center" justify="between">
          <Text size="4" weight="bold" className="text-white font-serif">
            FILTROS
          </Text>
          {hasFilters && (
            <Button
              size="1"
              variant="ghost"
              onClick={handleReset}
              className="text-white hover:bg-red-700 p-1"
            >
              <Cross2Icon width="14" height="14" />
            </Button>
          )}
        </Flex>
      </Box>

      <ScrollArea className="flex-grow">
        <Box className="p-6 space-y-6">
          {/* Search Input */}
          <Box>
            <Text 
              as="label" 
              size="2" 
              weight="bold" 
              className="text-black font-serif mb-3 block uppercase tracking-wide text-sm"
            >
              Buscar Notícias
            </Text>
            <Box className="relative">
              <TextField.Root
                size="3"
                placeholder="Digite palavras-chave..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
                className="w-full border-2 border-gray-300 focus:border-red-500 rounded-none font-sans text-black placeholder:text-gray-500"
              />
              <Button
                size="2"
                variant="ghost"
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <MagnifyingGlassIcon width="18" height="18" />
              </Button>
            </Box>
          </Box>

          {/* Divider */}
          <Box className="border-b border-gray-200"></Box>

          {/* Categories */}
          <Box>
            <Text 
              as="label" 
              size="2" 
              weight="bold" 
              className="text-black font-serif mb-4 block uppercase tracking-wide text-sm"
            >
              Editorias
            </Text>
            <Flex direction="column" gap="2">
              {categories.map((category: Category) => (
                <Button
                  key={category.id}
                  size="2"
                  variant="ghost"
                  onClick={() => handleCategoryChange(category.name)}
                  className={`
                    w-full justify-start px-3 py-3 rounded-none border-l-4 font-sans font-medium
                    ${selectedCategory === category.name 
                      ? 'border-l-red-600 bg-red-50 text-red-700' 
                      : 'border-l-gray-200 text-black hover:border-l-red-300 hover:bg-gray-50'
                    }
                    transition-all duration-200
                  `}
                >
                  {category.name}
                </Button>
              ))}
            </Flex>
          </Box>

          {/* Divider */}
          <Box className="border-b border-gray-200"></Box>

          {/* Tags */}
          <Box>
            <Text 
              as="label" 
              size="2" 
              weight="bold" 
              className="text-black font-serif mb-4 block uppercase tracking-wide text-sm"
            >
              Assuntos
            </Text>
            <Flex wrap="wrap" gap="2">
              {tags.map((tag: Tag) => (
                <Button
                  key={tag.id}
                  size="1"
                  variant="outline"
                  onClick={() => handleTagChange(tag.name)}
                  className={`
                    px-3 py-2 rounded-full font-sans text-xs font-medium border-2
                    ${selectedTags.includes(tag.name)
                      ? 'bg-red-600 border-red-600 text-white hover:bg-red-700'
                      : 'bg-white border-gray-300 text-black hover:border-red-600 hover:text-red-600'
                    }
                    transition-all duration-200
                  `}
                >
                  #{tag.name}
                </Button>
              ))}
            </Flex>
          </Box>

          {/* Active Filters Summary */}
          {hasFilters && (
            <>
              <Box className="border-b border-gray-200"></Box>
              <Box className="bg-gray-50 p-4 rounded-sm">
                <Text size="2" weight="bold" className="text-black font-serif mb-2 block text-xs uppercase tracking-wide">
                  Filtros Ativos
                </Text>
                <Flex direction="column" gap="1">
                  {searchTerm && (
                    <Text size="1" className="text-gray-700 font-sans">
                      Busca: "{searchTerm}"
                    </Text>
                  )}
                  {selectedCategory && (
                    <Text size="1" className="text-gray-700 font-sans">
                      Editoria: {selectedCategory}
                    </Text>
                  )}
                  {selectedTags.length > 0 && (
                    <Text size="1" className="text-gray-700 font-sans">
                      Assuntos: {selectedTags.join(', ')}
                    </Text>
                  )}
                </Flex>
              </Box>
            </>
          )}
        </Box>
      </ScrollArea>

      {/* Footer */}
      <Box className="p-6 border-t border-gray-200 bg-gray-50">
        <Button
          size="3"
          variant="outline"
          onClick={handleReset}
          disabled={!hasFilters}
          className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-sans font-medium rounded-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          LIMPAR TODOS OS FILTROS
        </Button>
      </Box>
    </Box>
  );
}