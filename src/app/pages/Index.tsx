
import { PostList } from '../components/Post/PostList';

export function IndexPage() {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-7xl px-4">
        <PostList />
      </div>
    </div>
  );
}
