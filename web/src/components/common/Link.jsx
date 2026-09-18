import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ href, to, children, className = '', ...props }) {
  const targetUrl = to || href || '#';
  const isExternal = typeof targetUrl === 'string' && (
    targetUrl.startsWith('http://') ||
    targetUrl.startsWith('https://') ||
    targetUrl.startsWith('mailto:') ||
    targetUrl.startsWith('tel:')
  );

  if (isExternal) {
    return (
      <a href={targetUrl} className={className} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={targetUrl} className={className} {...props}>
      {children}
    </RouterLink>
  );
}
