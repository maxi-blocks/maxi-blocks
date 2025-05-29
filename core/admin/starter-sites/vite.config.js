import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [
		react({
			// Enable JSX in .js files
			include: '**/*.{jsx,js,ts,tsx}',
		}),
	],

	// Specify the root directory and public directory
	root: '.',
	publicDir: 'public',

	// Configure build output to match the previous Craco setup
	build: {
		outDir: 'build',
		assetsDir: '',

		// Increase chunk size warning limit to suppress bundle size warnings
		chunkSizeWarningLimit: 1000,

		// Generate single bundle without chunks (like the original Craco config)
		rollupOptions: {
			// Specify the input file explicitly
			input: 'public/index.html',
			output: {
				// Match the original filename pattern from Craco - use main.js and main.css
				entryFileNames: 'js/main.js',
				chunkFileNames: 'js/main.js',
				assetFileNames: assetInfo => {
					if (assetInfo.name?.endsWith('.css')) {
						return 'css/main.css';
					}
					return 'assets/[name].[ext]';
				},

				// Use UMD format which is more compatible with WordPress
				format: 'umd',
				name: 'MaxiStarterSites',
			},
		},

		// Disable minification of CSS class names for WordPress compatibility
		cssCodeSplit: false,
	},

	// Configure development server
	server: {
		port: 3000,
		open: false,
	},

	// Configure CSS preprocessors
	css: {
		preprocessorOptions: {
			scss: {
				// Use modern Sass API instead of legacy API
				api: 'modern-compiler',
				// Silence deprecation warnings for mixed declarations
				silenceDeprecations: [
					'mixed-decls',
					'color-functions',
					'global-builtin',
					'import',
				],
			},
		},
	},

	// Remove global definitions that might interfere with WordPress
	// define: {
	//	global: 'globalThis',
	// },

	// Configure how external dependencies are handled
	optimizeDeps: {
		include: ['lodash'],
	},

	// Configure file extensions - handle TypeScript syntax in .js files
	esbuild: {
		loader: 'tsx',
		include: /src\/.*\.[jt]sx?$/,
		exclude: [],
	},
});
