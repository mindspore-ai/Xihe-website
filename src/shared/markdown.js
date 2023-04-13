import Markdown from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import forInlinePlugin from 'markdown-it-for-inline';
import MarkdownItSanitizer from 'markdown-it-sanitizer';

const mkit = new Markdown({ html: true, linkify: true });
const slugify = (s) =>
  decodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

const newWindow = (tokens, idx) => {
  let aIndex = tokens[idx].attrIndex('target');
  if (aIndex < 0) {
    try {
      JSON.stringify(tokens[idx].attrs[0]).includes('#')
        ? ''
        : tokens[idx].attrPush(['target', '_blank']);
    } catch (error) {
      console.error(error);
    }
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';
  }
};

export function handleMarkdown() {
  mkit
    .use(markdownItAnchor, {
      level: 1,
      slugify,
    })
    .use(forInlinePlugin, 'url_new_win', 'link_open', newWindow);
  // .use(MarkdownItSanitizer);
  return mkit;
}
