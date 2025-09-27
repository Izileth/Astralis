
import React from 'react';
import { usePostLikes } from '../../hooks/useLikes';

// Componente para botão de like em posts
interface LikePostButtonProps {
  postId: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LikePostButton: React.FC<LikePostButtonProps> = ({ 
  postId, 
  showCount = true, 
  size = 'md' 
}) => {
  const { isLiked, likeCount, loading, error, toggle } = usePostLikes(postId);

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={loading}
        className={`
          ${sizeClasses[size]}
          ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 bg-gray-50'}
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
          rounded-full border transition-colors duration-200
        `}
        aria-label={isLiked ? 'Descurtir post' : 'Curtir post'}
      >
        {loading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <span>{isLiked ? '❤️' : '🤍'}</span>
        )}
      </button>
      
      {showCount && (
        <span className={`${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'} text-gray-600`}>
          {likeCount}
        </span>
      )}
      
      {error && (
        <span className="text-xs text-red-500" title={error}>
          ⚠️
        </span>
      )}
    </div>
  );
};