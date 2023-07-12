import Markdown from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

const mkit = new Markdown({ html: true, linkify: true });

const slugify = (s) =>
  decodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

export function handleMarkdown() {
  mkit.use(markdownItAnchor, {
    level: 1,
    slugify,
  });
  return mkit;
}
