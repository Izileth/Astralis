import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { postService } from '../../services/post';
import  type{ Category, Tag } from '../../types';
interface SearchSidebarProps {
  onReset?: () => void;
}

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

export function SearchSidebar({ onReset: onResetProp }: SearchSidebarProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesResponse, tagsResponse] = await Promise.all([
        postService.getAllCategories(),
        postService.getAllTags(),
      ]);
      
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories((categoriesResponse.data as any).categories || []);
      }
      if (tagsResponse.success && tagsResponse.data) {
        setTags((tagsResponse.data as any).tags || []);
      }
    };
    fetchData();
  }, []);

  const applyFilters = (filters: { search?: string; category?: string; tags?: string[] }) => {
    const params = new URLSearchParams();
    if (filters.search) {
      params.set('query', filters.search);
    }
    if (filters.category) {
      params.set('category', filters.category);
    }
    if (filters.tags && filters.tags.length > 0) {
      params.set('tags', filters.tags.join(','));
    }
    navigate(`/search?${params.toString()}`);
  };

  const handleSearch = (): void => {
    applyFilters({ search: searchTerm, category: selectedCategory, tags: selectedTags });
  };

  const handleCategoryChange = (categoryName: string): void => {
    const newCategory = categoryName === selectedCategory ? '' : categoryName;
    setSelectedCategory(newCategory);
    applyFilters({ search: searchTerm, category: newCategory, tags: selectedTags });
  };

  const handleTagChange = (tagName: string): void => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter((t: string) => t !== tagName)
      : [...selectedTags, tagName];
    setSelectedTags(newTags);
    applyFilters({ search: searchTerm, category: selectedCategory, tags: newTags });
  };

  const handleReset = (): void => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    if (onResetProp) {
      onResetProp();
    }
    navigate('/search');
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
              {categories.length > 0 ? (
                categories.map((category: Category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "secondary" : "ghost"}
                    onClick={() => handleCategoryChange(category.name)}
                    className="w-full justify-start px-4 py-3 text-left transition-all duration-200 font-sans font-medium"
                  >
                    {category.name}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-4">Nenhuma editoria disponível</p>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <label className="block mb-4 text-xs text-gray-500 font-sans uppercase tracking-wider font-bold">Assuntos</label>
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.length > 0 ? (
                tags.map((tag: Tag) => (
                  <Button
                    key={tag.id}
                    size="sm"
                    variant={selectedTags.includes(tag.name) ? "destructive" : "outline"}
                    onClick={() => handleTagChange(tag.name)}
                    className="font-sans text-xs transition-all duration-200"
                  >
                    #{tag.name}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhum assunto disponível</p>
              )}
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