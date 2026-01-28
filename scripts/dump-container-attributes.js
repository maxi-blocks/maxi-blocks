/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '..');

const aliasRoots = {
	'@extensions': path.join(root, 'src', 'extensions'),
	'@components': path.join(root, 'src', 'components'),
	'@blocks': path.join(root, 'src', 'blocks'),
};

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
	for (const [alias, target] of Object.entries(aliasRoots)) {
		if (request === alias || request.startsWith(`${alias}/`)) {
			const relative = request.slice(alias.length);
			const mappedPath = path.join(target, relative);
			return originalResolve.call(this, mappedPath, parent, isMain, options);
		}
	}
	return originalResolve.call(this, request, parent, isMain, options);
};

const originalLoad = Module._load;
Module._load = function loadWithStubs(request, parent, isMain) {
	if (request === '@wordpress/i18n') {
		return { __: text => text };
	}

	if (request === '@components/transform-control/utils') {
		return { getTransformSelectors: () => ({}) };
	}

	if (request === '@extensions/styles') {
		const transitionPath = path.join(
			root,
			'src',
			'extensions',
			'styles',
			'transitions',
			'transitionAttributesCreator'
		);
		const transitionModule = require(transitionPath);
		return {
			transitionAttributesCreator:
				transitionModule.default || transitionModule,
		};
	}

	if (
		request === './data' &&
		parent?.filename &&
		parent.filename.endsWith(
			path.join('container-maxi', 'attributes.js')
		)
	) {
		return { customCss: { selectors: {} } };
	}

	return originalLoad.call(this, request, parent, isMain);
};

const originalJsHandler = Module._extensions['.js'];
Module._extensions['.js'] = function babelHook(module, filename) {
	if (
		filename.startsWith(root) &&
		!filename.includes(`${path.sep}node_modules${path.sep}`)
	) {
		const source = fs.readFileSync(filename, 'utf8');
		const result = babel.transformSync(source, {
			filename,
			babelrc: false,
			configFile: false,
			presets: [
				require.resolve('@wordpress/babel-preset-default'),
				require.resolve('@babel/preset-react'),
			],
			plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
		});
		return module._compile(result.code, filename);
	}
	return originalJsHandler(module, filename);
};

const attributesPath = path.join(
	root,
	'src',
	'blocks',
	'container-maxi',
	'attributes.js'
);
const attributesModule = require(attributesPath);
const attributes = attributesModule.default || attributesModule;
const keys = Object.keys(attributes).sort();

const outIndex = process.argv.indexOf('--out');
const outPath = outIndex !== -1 ? process.argv[outIndex + 1] : null;

const output = {
	count: keys.length,
	keys,
};

if (outPath) {
	const resolvedOutPath = path.isAbsolute(outPath)
		? outPath
		: path.join(root, outPath);
	fs.mkdirSync(path.dirname(resolvedOutPath), { recursive: true });
	fs.writeFileSync(resolvedOutPath, `${JSON.stringify(output, null, 2)}\n`);
	console.log(`Wrote ${keys.length} keys to ${resolvedOutPath}`);
} else {
	console.log(JSON.stringify(output, null, 2));
}
