const fs = require('fs');
const path = require('path');

const resolveCoreJsRoot = () => {
	try {
		const babelRuntimeSymbol = require.resolve('babel-runtime/core-js/symbol');
		// babel-runtime/core-js/symbol.js -> babel-runtime/node_modules/core-js
		return path.join(path.dirname(babelRuntimeSymbol), '..', 'node_modules', 'core-js');
	} catch (error) {
		return null;
	}
};

const coreJsRoot = resolveCoreJsRoot();

if (!coreJsRoot) {
	console.log('[fix-core-js-library] babel-runtime not found; skipping.');
	process.exit(0);
}

const sourcePath = path.join(coreJsRoot, 'modules', 'es6.object.to-string.js');
const targetPath = path.join(
	coreJsRoot,
	'library',
	'modules',
	'es6.object.to-string.js'
);

if (!fs.existsSync(sourcePath)) {
	console.log(
		`[fix-core-js-library] Missing source module: ${sourcePath}. Skipping.`
	);
	process.exit(0);
}

if (fs.existsSync(targetPath)) {
	console.log('[fix-core-js-library] Target module already exists. OK.');
	process.exit(0);
}

fs.copyFileSync(sourcePath, targetPath);
console.log('[fix-core-js-library] Patched core-js library module.');
