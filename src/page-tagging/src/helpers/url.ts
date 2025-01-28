/**
 * Removes language segment from URL path
 * @param url URL path to process
 * @returns URL path with language segment removed
 */
export const removeLanguageFromUrl = (url: string): string => {
  if (!url) return '';

  // Split URL into segments
  const segments = url.split('/').filter(Boolean);

  // Check if first segment is a language code (e.g. en-us, fr-ca, es-mx)
  if (segments.length > 0 && /^[a-z]{2}-[a-z]{2}$/i.test(segments[0])) {
    // Remove language segment and rejoin remaining segments
    return segments.slice(1).join('/');
  }

  // Return original URL if no language segment found
  return url;
};

export const removeTrailingSlash = (url: string): string => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};
