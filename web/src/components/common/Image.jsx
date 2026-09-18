import React from 'react';

export default function Image({
  src,
  alt = '',
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  style = {},
  ...props
}) {
  const combinedStyle = fill
    ? { width: '100%', height: '100%', objectFit: 'cover', ...style }
    : style;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={combinedStyle}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
}
