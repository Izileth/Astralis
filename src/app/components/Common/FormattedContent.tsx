import React from 'react';
import DOMPurify from 'dompurify';

interface FormattedContentProps {
  content: string;
  className?: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content, className }) => {
  // Sanitize the HTML content to prevent XSS attacks
  let sanitizedContent = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'p', 'strong', 'em', 'u', 's', 'blockquote', 'code', 'pre', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'br', 'hr'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
  });

  // Ensure empty paragraphs create a line break for correct spacing from the editor.
  sanitizedContent = sanitizedContent.replace(/<p><\/p>/g, '<p><br /></p>');

  return (
    <div
      className={`prose prose-lg max-w-none font-sans text-gray-800 leading-[1.7] [word-spacing:0.05em] ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default FormattedContent;
