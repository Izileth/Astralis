import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { postService } from '../services/post';
import type { Post } from '../types';
import { PostList } from '../components/Post/PostList';
import { Container } from '../components/Common/Container';
import { PostListSkeleton } from '../components/Common/Skeleton/PostListSkeleton';

// Tipo auxiliar para a resposta de busca (ajuste conforme sua API real)
interface SearchResponse {
  posts: Post[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      
      const params = {
        query: query,
        categoryName: category,
        tagNames: tags,
      };
      
      const response = await postService.search(query, params);
      
      if (response.success && response.data) {
        // Type assertion para garantir o tipo correto
        const searchData = response.data as SearchResponse;
        
        setPosts(searchData.posts || []);
        setTotal(searchData.pagination?.total || searchData.posts?.length || 0);
      } else {
        setPosts([]);
        setTotal(0);
      }
      
      setLoading(false);
    };

    fetchSearch();
  }, [query, category, tags.join(',')]);

  return (
      <Container>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-2">Resultados da Busca</h1>
          <p className="text-muted-foreground">
            {total} {total === 1 ? 'resultado encontrado' : 'resultados encontrados'} para sua busca.
          </p>
        </div>

        {loading ? (
          <PostListSkeleton />
        ) : (
          <PostList posts={posts} />
        )}
      </Container>
  );
}