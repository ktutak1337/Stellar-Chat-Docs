import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Stellar Chat Docs',
			social: {
				github: 'https://github.com/ktutak1337/Stellar-Chat',
			},
			sidebar: [
				{
					label: '🌟 Introduction',
					autogenerate: { directory: 'introduction' },
				},
				{
					label: '✨ Features',
					autogenerate: { directory: 'features' },
				},
				{
					label: '📋 Guides',
					autogenerate: { directory: 'guides' },
				},
				{
					label: '🚀 Deployment',
					autogenerate: { directory: 'deployment' },
				}
			],
		}),
	],
});
