import { getCollection } from 'astro:content';
import { url } from './url';

// Where a project link should land: its first chapter, so the content is one click away.
// Falls back to the project overview page when a project has no chapters yet.
export async function projectStart(projectId: string): Promise<string> {
  const first = (await getCollection('chapters'))
    .filter((c) => c.data.project.id === projectId)
    .sort((a, b) => a.data.order - b.data.order)[0];
  return first ? url(`projects/${projectId}/${first.id.split('/').pop()}/`) : url(`projects/${projectId}/`);
}
