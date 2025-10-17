import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { postService } from '../../services/post';
import type { Category, Tag } from '../../types';

interface SearchSidebarProps {
  onClose?: () => void;
}

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/app/lib/utils';

export function SearchSidebar({ onClose }: SearchSidebarProps) {
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
    onClose?.();
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
    onClose?.();
    navigate('/search');
  };

  const hasFilters: boolean = Boolean(searchTerm || selectedCategory || selectedTags.length > 0);

  return (
    <div className="h-full w-full md:w-80 bg-background border-r border-border/40 flex flex-col">
      <div className="px-6 py-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
          {hasFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="hover:bg-transparent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-6 space-y-8">
          {/* Search Input */}
          <div>
            <label className="block mb-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Buscar Notícias
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Digite palavras-chave..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
                className="flex-1 border-border/40"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearch}
                className="hover:bg-transparent hover:text-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-border/40" />

          {/* Categories */}
          <div>
            <label className="block mb-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Editorias
            </label>
            <div className="flex flex-col gap-1">
              {categories.length > 0 ? (
                categories.map((category: Category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.name)}
                    className={cn(
                      "group relative w-full flex items-center justify-start px-3 py-2.5 text-sm font-medium transition-colors rounded-md text-left",
                      selectedCategory === category.name
                        ? "text-foreground"
                        : "text-foreground/60 hover:text-foreground hover:bg-transparent"
                    )}
                  >
                    {category.name}
                    <span 
                      className={cn(
                        "absolute left-0 top-0 h-full w-[2px] bg-foreground transition-all duration-300",
                        selectedCategory === category.name ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} 
                    />
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground px-3">Nenhuma editoria disponível</p>
              )}
            </div>
          </div>

          <Separator className="bg-border/40" />

          {/* Tags */}
          <div>
            <label className="block mb-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Assuntos
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag: Tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagChange(tag.name)}
                    className={cn(
                      "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors border",
                      selectedTags.includes(tag.name)
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground/60 border-border/40 hover:text-foreground hover:border-foreground/20"
                    )}
                  >
                    #{tag.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum assunto disponível</p>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <>
              <Separator className="bg-border/40" />
              <div className="p-4 bg-muted/30 rounded-lg border border-border/40">
                <p className="block mb-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Filtros Ativos
                </p>
                <div className="flex flex-col gap-2">
                  {searchTerm && (
                    <p className="text-xs text-foreground/80">
                      Busca: <span className="font-medium text-foreground">"{searchTerm}"</span>
                    </p>
                  )}
                  {selectedCategory && (
                    <p className="text-xs text-foreground/80">
                      Editoria: <span className="font-medium text-foreground">{selectedCategory}</span>
                    </p>
                  )}
                  {selectedTags.length > 0 && (
                    <p className="text-xs text-foreground/80">
                      Assuntos: <span className="font-medium text-foreground">{selectedTags.join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t border-border/40 bg-muted/30">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasFilters}
          className={cn(
            "w-full font-medium transition-all duration-200 border-border/40",
            !hasFilters && "opacity-50 cursor-not-allowed"
          )}
        >
          Limpar Todos os Filtros
        </Button>
      </div>
    </div>
  );
}