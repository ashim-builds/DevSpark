import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ href, to, children, className = '', onClick, ...props }) {
  const targetUrl = to || href || '#';
  const isExternal = typeof targetUrl === 'string' && (
    targetUrl.startsWith('http://') ||
    targetUrl.startsWith('https://') ||
    targetUrl.startsWith('mailto:') ||
    targetUrl.startsWith('tel:')
  );

  if (isExternal) {
    return (
      <a href={targetUrl} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  function handleClick(e) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (onClick) onClick(e);
  }

  return (
    <RouterLink to={targetUrl} className={className} onClick={handleClick} {...props}>
      {children}
    </RouterLink>
  );
}
