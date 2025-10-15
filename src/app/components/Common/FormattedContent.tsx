import React from 'react';
import DOMPurify from 'dompurify';

interface FormattedContentProps {
  content: string;
  className?: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content, className }) => {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'p', 'strong', 'em', 'u', 's', 'blockquote', 'code', 'pre', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'br', 'hr'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
  });

  return (
    <div
      className={`prose prose-lg max-w-none font-sans leading-relaxed text-gray-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        fontSize: '18px',
        lineHeight: '1.7',
      }}
    />
  );
};

export default FormattedContent;
