// Keep the shared templates editable while shipping complete, immediately visible HTML.
// Run after changing components/header.html or components/footer.html.
import { readFile, writeFile, readdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
for (const name of await readdir(root)) {
  if (!name.endsWith('.html')) continue;
  const url = new URL(name, root);
  let html = await readFile(url, 'utf8');
  for (const part of ['header', 'footer']) {
    const template = (await readFile(new URL(`components/${part}.html`, root), 'utf8')).trim();
    const block = `<!-- component:${part} -->\n<div data-component="${part}">\n${template}\n</div>\n<!-- /component:${part} -->`;
    html = html.replace(new RegExp(`<!-- component:${part} -->[\\s\\S]*?<!-- /component:${part} -->|<div data-include="/components/${part}"></div>`), () => block);
    html = html.replace(new RegExp(`    <link rel="preload" href="/components/${part}" as="fetch">\\r?\\n`), '');
  }
  await writeFile(url, html);
}
