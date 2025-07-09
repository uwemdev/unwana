import React from 'react';

interface PostContentProps {
  content: string;
}

export const PostContent: React.FC<PostContentProps> = ({ content }) => {
  const processContent = (text: string) => {
    // Split content by words and process each one
    return text.split(/(\s+)/).map((word, index) => {
      // Handle @mentions
      if (word.startsWith('@')) {
        const username = word.slice(1);
        return (
          <a
            key={index}
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {word}
          </a>
        );
      }
      
      // Handle #hashtags
      if (word.startsWith('#')) {
        const hashtag = word.slice(1);
        return (
          <a
            key={index}
            href={`https://twitter.com/hashtag/${hashtag}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline font-medium"
          >
            {word}
          </a>
        );
      }
      
      // Handle URLs
      if (word.match(/^https?:\/\/.+/)) {
        return (
          <a
            key={index}
            href={word}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {word}
          </a>
        );
      }
      
      return word;
    });
  };

  return (
    <div className="whitespace-pre-wrap break-words">
      {processContent(content)}
    </div>
  );
};