import React from 'react';

interface HighlightProps {
  text: string;
  search?: string;
  highlightStyle?: React.CSSProperties;
}

const DEFAULT_STYLE: React.CSSProperties = {
  background: '#fef08a',
  color: '#854d0e',
  borderRadius: 2,
  padding: '0 2px',
  fontWeight: 600,
};

const Highlight: React.FC<HighlightProps> = ({
  text,
  search,
  highlightStyle = DEFAULT_STYLE,
}) => {
  if (!search?.trim()) return <>{text}</>;

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={highlightStyle}>{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

export default Highlight;
