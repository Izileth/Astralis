import { useState } from 'react';
import { Search, X } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

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
    <div className="h-full w-full md:w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold font-serif text-red-600 uppercase tracking-wide">Filtros</h3>
          {hasFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-6">
          <div className="mb-6">
            <label className="block mb-3 text-xs text-gray-500 font-sans uppercase tracking-wider font-bold">Buscar Notícias</label>
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Digite palavras-chave..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearch}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <label className="block mb-4 text-xs text-gray-500 font-sans uppercase tracking-wider font-bold">Editorias</label>
            <div className='flex flex-col justify-start gap-1 pt-2 items-start'>
              {categories.map((category: Category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "secondary" : "ghost"}
                  onClick={() => handleCategoryChange(category.name)}
                  className="w-full justify-start px-4 py-3 text-left transition-all duration-200 font-sans font-medium"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <label className="block mb-4 text-xs text-gray-500 font-sans uppercase tracking-wider font-bold">Assuntos</label>
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag: Tag) => (
                <Button
                  key={tag.id}
                  size="sm"
                  variant={selectedTags.includes(tag.name) ? "destructive" : "outline"}
                  onClick={() => handleTagChange(tag.name)}
                  className="font-sans text-xs transition-all duration-200"
                >
                  #{tag.name}
                </Button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <>
              <Separator className="my-6" />
              <div className="p-4 bg-gray-50 rounded">
                <p className="block mb-3 text-xs text-gray-500 font-sans uppercase tracking-wider font-bold">Filtros Ativos</p>
                <div className="flex flex-col gap-1">
                  {searchTerm && (
                    <p className="text-xs text-gray-700 font-sans">
                      Busca: <span className="font-medium">"{searchTerm}"</span>
                    </p>
                  )}
                  {selectedCategory && (
                    <p className="text-xs text-gray-700 font-sans">
                      Editoria: <span className="font-medium">{selectedCategory}</span>
                    </p>
                  )}
                  {selectedTags.length > 0 && (
                    <p className="text-xs text-gray-700 font-sans">
                      Assuntos: <span className="font-medium">{selectedTags.join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasFilters}
          className="w-full font-sans font-medium transition-all duration-200"
        >
          Limpar Todos os Filtros
        </Button>
      </div>
    </div>
  );
}