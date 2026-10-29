import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A video is either a YouTube id, or any embeddable URL
// (a Descript share/embed link, Cloudflare Stream, Vimeo...).
const video = z
  .object({
    youtube: z.string().optional(),
    embed: z.string().url().optional(),
    caption: z.string().optional(),
  })
  .optional();

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['planning', 'in design', 'building', 'testing', 'done']),
    order: z.number(),
    started: z.coerce.date(),
    target: z.string().optional(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    cover: z.string().optional(),   // /images/... ; generated art when absent
    coverCaption: z.string().optional(),
    short: z.string().optional(),   // short name for the nav and labels
    boards: z.array(z.string()).default([]),  // board repos that feed this project (pcb-build-log)
    kit: z.boolean().default(false),          // fed by the pcb-design-kit repo itself
    video,
    stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    project: reference('projects'),
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    status: z.enum(['planned', 'draft', 'published']).default('planned'),
    gate: z.string().optional(),     // e.g. "Gate 3", "Gate 4Q"
    date: z.coerce.date().optional(), // when that stage was done
    cover: z.string().optional(),
    video,
  }),
});

export const collections = { projects, chapters };
