// Prefix a site path with the configured base (needed on GitHub Pages project sites).
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export const statusLabel: Record<string, string> = {
  planning: 'Planning',
  'in design': 'In design',
  building: 'Building',
  testing: 'Testing',
  done: 'Done',
  planned: 'Coming',
  draft: 'Draft',
  published: 'Published',
};
