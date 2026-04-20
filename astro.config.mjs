// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sidebar from './src/sidebar.json' with { type: 'json' };

console.log('Using TypeScript version:', '6.0.3');

// Deployed as a GitHub Pages project site: https://kynrai.github.io/academy/
// `base` is only applied in CI so local `npm run dev` stays at the root path.
// For a custom domain, set `site` accordingly and drop `base`.
const onCI = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://kynrai.github.io',
  base: onCI ? '/academy/' : undefined,
  integrations: [
    starlight({
      title: 'Academy for Developers',
      description:
        'An intensive 11-week course covering the full stack from terminal basics to agentic AI.',
      // Starlight's default light/dark theme, plus small sidebar tweaks.
      customCss: ['./src/styles/sidebar.css'],
      // Hybrid MD/MDX: content files stay .md until a page needs components.
      sidebar,
    }),
  ],
});
