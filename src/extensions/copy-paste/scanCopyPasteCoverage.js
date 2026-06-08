const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('@babel/parser');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const FILE_CACHE = new Map();
const MODULE_CACHE = new Map();
const GROUP_ATTRIBUTE_CACHE = new Map();
const TEMPLATE_CACHE = new Map();

const STYLE_TEMPLATES_PATH = path.join(
	PROJECT_ROOT,
	'src',
	'extensions',
	'copy-paste',
	'templates.js'
);
const DEFAULTS_INDEX_PATH = path.join(
	PROJECT_ROOT,
	'src',
	'extensions',
	'styles',
	'defaults',
	'index.js'
);
const GLOBAL_COPY_PASTE_EXCLUDE = [
	'uniqueID',
	'customLabel',
	'dc-status',
	'dc-id',
	'cl-id',
	'dc-accumulator',
	'cl-accumulator',
	'cl-grandchild-accumulator',
	'dc-limit-by-archive',
	'cl-limit-by-archive',
	'isFirstOnHierarchy',
	'maxi-version-current',
	'maxi-version-origin',
	'preview',
	'openFirstTime',
	'transition-block-selected',
	'transition-button-selected',
	'transition-canvas-selected',
	'transition-content-selected',
	'transition-header-selected',
	'transition-input-selected',
	'transition-pane-selected',
	'transition-transform-selected',
];

const parseFile = filePath => {
	const absolutePath = path.normalize(filePath);
	if (FILE_CACHE.has(absolutePath)) {
		return FILE_CACHE.get(absolutePath);
	}

	const source = fs.readFileSync(absolutePath, 'utf8');
	const ast = parse(source, {
		sourceType: 'module',
		sourceFilename: absolutePath,
		plugins: ['jsx'],
	});

	FILE_CACHE.set(absolutePath, ast);
	return ast;
};

const getExtensionCandidate = sourcePath => {
	if (!path.extname(sourcePath)) return `${sourcePath}.js`;
	return sourcePath;
};

const resolveImportPath = (fromDir, source) => {
	if (!source || typeof source !== 'string') return null;
	const aliasRoots = {
		'@blocks/': path.join(PROJECT_ROOT, 'src', 'blocks'),
		'@extensions/': path.join(PROJECT_ROOT, 'src', 'extensions'),
	};
	for (const [alias, rootPath] of Object.entries(aliasRoots)) {
		if (!source.startsWith(alias)) continue;
		const aliasPath = path.join(rootPath, source.replace(alias, ''));
		const candidate = getExtensionCandidate(aliasPath);
		if (fs.existsSync(candidate)) return candidate;
		if (fs.existsSync(`${aliasPath}.js`)) return `${aliasPath}.js`;
		const indexPath = path.join(aliasPath, 'index.js');
		if (fs.existsSync(indexPath)) return indexPath;
		return null;
	}

	if (source.startsWith('@extensions/')) {
		const extensionsAliasPath = source.replace('@extensions/', '');
		const aliasPath = path.join(
			PROJECT_ROOT,
			'src',
			'extensions',
			extensionsAliasPath
		);
		const candidate = getExtensionCandidate(aliasPath);
		if (fs.existsSync(candidate)) return candidate;
		if (fs.existsSync(`${aliasPath}.js`)) return `${aliasPath}.js`;
		const indexPath = path.join(aliasPath, 'index.js');
		if (fs.existsSync(indexPath)) return indexPath;
		return null;
	}

	if (source.startsWith('.')) {
		const resolved = path.resolve(fromDir, source);
		const candidate = getExtensionCandidate(resolved);
		if (fs.existsSync(candidate)) return candidate;
		const indexPath = path.join(resolved, 'index.js');
		if (fs.existsSync(indexPath)) return indexPath;
		return null;
	}

	return null;
};

const normalizeExportKey = key => key.replaceAll('-', '_');

const getPropKey = (
	property,
	moduleInfo = null,
	seen = new Set(),
	scope = new Map()
) => {
	if (!property || !property.key) return null;
	if (property.key.type === 'Identifier') return property.key.name;
	if (property.key.type === 'StringLiteral') return property.key.value;
	if (property.key.type === 'TemplateLiteral') {
		const resolved = resolveLiteralString(property.key, moduleInfo, seen, scope);
		return resolved || null;
	}
	if (property.key.type === 'NumericLiteral') return `${property.key.value}`;
	return null;
};

const normalizeKey = key => key.trim();

const categorizeAttributeKey = key => {
	if (key.startsWith('advanced-css-')) return 'advanced-css';
	if (key.startsWith('dc-')) return 'dynamic-content';
	if (key.startsWith('cl-')) return 'context-loop';
	if (key === 'transition' || key.startsWith('transition-'))
		return 'transition';
	if (key.startsWith('opacity-') && key.endsWith('-hover'))
		return 'opacity-hover';
	if (key === 'opacity-status-hover') return 'opacity-hover';
	if (key.includes('-hover')) return 'hover';
	if (key.startsWith('link-')) return 'link';
	if (key.startsWith('list-')) return 'list';
	if (
		key.includes('icon') ||
		key.startsWith('svg-') ||
		key === 'svgType'
	) {
		return 'icon-svg';
	}
	if (key.includes('background-layers')) return 'background-layers';
	if (
		key.includes('media') ||
		key.includes('Media') ||
		key.includes('url') ||
		key.includes('URL')
	) {
		return 'media-url';
	}
	if (
		[
			'ariaLabels',
			'blockStyle',
			'isFirstOnHierarchy',
			'maxi-version-current',
			'maxi-version-origin',
			'preview',
			'openFirstTime',
		].includes(key)
	) {
		return 'system-internal';
	}
	return 'block-specific';
};

const groupAttributeKeysByCategory = keys => {
	const grouped = {};
	for (const key of keys) {
		const category = categorizeAttributeKey(key);
		grouped[category] = grouped[category] || [];
		grouped[category].push(key);
	}

	return Object.fromEntries(
		Object.entries(grouped)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([category, categoryKeys]) => [
				category,
				categoryKeys.sort((a, b) => a.localeCompare(b)),
			])
	);
};

const makeMemberExpression = (object, propertyName) => ({
	type: 'MemberExpression',
	object,
	property: {
		type: 'Identifier',
		name: propertyName,
	},
	computed: false,
});

const getMemberPropertyName = (
	node,
	moduleInfo = null,
	seen = new Set(),
	scope = new Map()
) => {
	if (!node || node.type !== 'MemberExpression') return null;
	if (!node.computed && node.property.type === 'Identifier') {
		return node.property.name;
	}
	if (node.property.type === 'StringLiteral') return node.property.value;
	return resolveLiteralString(node.property, moduleInfo, seen, scope);
};

const resolveStringValue = (node, moduleInfo, seen, scope = new Map()) => {
	if (!node) return null;

	if (node.type === 'StringLiteral') return node.value;
	if (node.type === 'TemplateLiteral') {
		if (node.expressions.length === 0 && node.quasis.length === 1) {
			return node.quasis[0].value.cooked;
		}
		if (node.quasis.length === node.expressions.length + 1) {
			let response = '';
			for (let i = 0; i < node.quasis.length; i += 1) {
				response += node.quasis[i].value.cooked;
				if (i >= node.expressions.length) continue;
				const expression = node.expressions[i];
				const resolvedExpression =
					expression.type === 'Identifier' && scope.has(expression.name)
						? scope.get(expression.name)
						: expression;
				const expressionValue = resolveStringValue(
					resolvedExpression,
					moduleInfo,
					seen,
					scope
				);
				if (expressionValue === null) return null;
				response += expressionValue;
			}
			return response;
		}
	}

	if (node.type === 'Identifier') {
		if (scope.has(node.name)) {
			return resolveStringValue(
				scope.get(node.name),
				moduleInfo,
				seen,
				scope
			);
		}
		const resolved = resolveIdentifierValue(moduleInfo, node.name, seen);
		if (resolved && resolved !== node) {
			return resolveStringValue(resolved, moduleInfo, seen, scope);
		}
		return node.name === 'undefined' ? null : null;
	}

	if (node.type === 'MemberExpression') {
		const resolved = resolveMemberExpressionWithModule(
			moduleInfo,
			node,
			seen,
			scope
		);
		if (!resolved.node || resolved.node === node) return null;
		return resolveStringValue(
			resolved.node,
			resolved.moduleInfo || moduleInfo,
			seen,
			scope
		);
	}

	if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
		const resolvedCall = resolveCallExpression(node, moduleInfo, seen, scope);
		if (!resolvedCall) return null;
		return resolveStringValue(
			resolvedCall.node,
			resolvedCall.moduleInfo || moduleInfo,
			seen,
			resolvedCall.scope || scope
		);
	}

	return null;
};

const getLiteralString = node => {
	if (!node) return null;
	if (node.type === 'StringLiteral') return node.value;
	if (
		node.type === 'TemplateLiteral' &&
		node.expressions.length === 0 &&
		node.quasis.length === 1
	) {
		return node.quasis[0].value.cooked;
	}
	if (node.type === 'Identifier' && node.name === 'undefined') return null;
	return null;
};

const getLiteralBoolean = node =>
	node?.type === 'BooleanLiteral' ? node.value : null;

const resolveLiteralString = (node, moduleInfo, seen, scope = new Map()) => {
	if (!node) return null;
	return resolveStringValue(node, moduleInfo, seen, scope);
};

const resolveLiteralBoolean = (node, moduleInfo, seen) => {
	if (!node) return null;
	if (node.type === 'Identifier') {
		const resolved = resolveIdentifierValue(moduleInfo, node.name, seen);
		if (resolved === node) return null;
		return getLiteralBoolean(resolved);
	}
	return getLiteralBoolean(node);
};

const getLiteralStringsFromArray = node => {
	if (!node || node.type !== 'ArrayExpression') return [];
	return node.elements
		.map(getLiteralString)
		.filter(value => typeof value === 'string' && value.length > 0);
};

const makePaletteKeys = prefix => [
	`${prefix}palette-status`,
	`${prefix}palette-sc-status`,
	`${prefix}palette-color`,
	`${prefix}palette-opacity`,
	`${prefix}color`,
];

const normalizeStyleKey = key => {
	let styleKey = normalizeKey(key);
	if (styleKey.endsWith('-hover')) {
		styleKey = styleKey.slice(0, -7);
	}
	for (const bp of BREAKPOINTS) {
		if (styleKey.endsWith(`-${bp}`)) {
			styleKey = styleKey.slice(0, -1 - bp.length);
			break;
		}
	}
	return styleKey;
};

const getObjectEntries = (
	node,
	moduleInfo = null,
	seen = new Set(),
	scope = new Map()
) => {
	if (!node || node.type !== 'ObjectExpression') return [];
	return node.properties
		.filter(property => property.type === 'ObjectProperty')
		.map(property => ({
			key: getPropKey(property, moduleInfo, seen, scope),
			value: property.value,
		}));
};

const getModuleInfo = filePath => {
	const absolute = path.normalize(filePath);
	if (MODULE_CACHE.has(absolute)) return MODULE_CACHE.get(absolute);

	const ast = parseFile(absolute);
	const moduleDir = path.dirname(absolute);
	const module = {
		path: absolute,
		ast,
		values: new Map(),
		imports: new Map(),
		exports: new Map(),
		exportAll: [],
	};

	for (const statement of ast.program.body) {
		if (statement.type === 'VariableDeclaration') {
			for (const declaration of statement.declarations) {
				if (
					declaration.id.type === 'Identifier' &&
					declaration.init
				) {
					module.values.set(declaration.id.name, declaration.init);
					continue;
				}

				if (
					declaration.id.type === 'ObjectPattern' &&
					declaration.init
				) {
					for (const property of declaration.id.properties) {
						if (
							property.type !== 'ObjectProperty' ||
							property.value.type !== 'Identifier'
						) {
							continue;
						}
						const key =
							property.key.type === 'Identifier'
								? property.key.name
								: property.key.value;
						if (!key) continue;
						module.values.set(
							property.value.name,
							makeMemberExpression(declaration.init, key)
						);
					}
				}
			}
			continue;
		}

		if (statement.type === 'ImportDeclaration') {
			const sourceFile = resolveImportPath(moduleDir, statement.source.value);
			if (!sourceFile) continue;
			for (const specifier of statement.specifiers) {
				if (specifier.type === 'ImportSpecifier') {
					module.imports.set(specifier.local.name, {
						type: 'named',
						sourceFile,
						importedName: specifier.imported.name,
					});
					continue;
				}

				if (specifier.type === 'ImportDefaultSpecifier') {
					module.imports.set(specifier.local.name, {
						type: 'default',
						sourceFile,
						importedName: specifier.local.name,
					});
					continue;
				}

				if (specifier.type === 'ImportNamespaceSpecifier') {
					module.imports.set(specifier.local.name, {
						type: 'namespace',
						sourceFile,
					});
				}
			}
			continue;
		}

		if (statement.type === 'ExportNamedDeclaration') {
			if (statement.declaration?.type === 'VariableDeclaration') {
				for (const declaration of statement.declaration.declarations) {
					if (
						declaration.id.type === 'Identifier' &&
						declaration.init
					) {
						module.values.set(declaration.id.name, declaration.init);
						module.exports.set(declaration.id.name, {
							type: 'local',
							node: declaration.init,
						});
					}
				}
				continue;
			}

			if (statement.source && statement.source.value) {
				const sourceFile = resolveImportPath(
					moduleDir,
					statement.source.value
				);
				if (!sourceFile) continue;
				for (const specifier of statement.specifiers) {
					if (specifier.type !== 'ExportSpecifier') continue;
					const importedName =
						specifier.local.name === 'default'
							? 'default'
							: specifier.local.name;
					module.exports.set(specifier.exported.name, {
						type: 'reExport',
						sourceFile,
						localName: importedName,
					});
				}
				continue;
			}

			for (const specifier of statement.specifiers || []) {
				if (specifier.type !== 'ExportSpecifier') continue;
				if (specifier.local.type === 'Identifier' && specifier.local.name) {
					module.exports.set(specifier.exported.name, {
						type: 'aliasLocal',
						localName: specifier.local.name,
					});
				}
			}
			continue;
		}

		if (statement.type === 'ExportDefaultDeclaration') {
			module.exports.set('default', {
				type: 'local',
				node: statement.declaration,
			});
		}

		if (statement.type === 'ExportAllDeclaration') {
			const sourceFile = resolveImportPath(moduleDir, statement.source.value);
			if (!sourceFile) continue;
			module.exportAll.push(sourceFile);
		}
	}

	MODULE_CACHE.set(absolute, module);
	return module;
};

function resolveExportedValueWithModule(modulePath, exportName, seen = new Set()) {
	const absolutePath = path.normalize(modulePath);
	const key = `${absolutePath}:${normalizeExportKey(exportName)}`;
	if (seen.has(key)) return { node: null, moduleInfo: null };
	seen.add(key);

	const moduleInfo = getModuleInfo(absolutePath);
	const exportEntry = moduleInfo.exports.get(exportName);
	if (!exportEntry) {
		for (const wildcard of moduleInfo.exportAll) {
			const wildcardValue = resolveExportedValueWithModule(
				wildcard,
				exportName,
				seen
			);
			if (wildcardValue.node) {
				seen.delete(key);
				return wildcardValue;
			}
		}
		seen.delete(key);
		return { node: null, moduleInfo: null };
	}

	if (exportEntry.type === 'local') {
		const value = exportEntry.node;
		if (value.type === 'Identifier') {
			const local = moduleInfo.values.get(value.name);
			if (local) {
				seen.delete(key);
				return { node: local, moduleInfo };
			}
			seen.delete(key);
			return { node: value, moduleInfo };
		}
		seen.delete(key);
		return { node: value, moduleInfo };
	}

	if (exportEntry.type === 'aliasLocal') {
		const local = moduleInfo.values.get(exportEntry.localName);
		if (local) {
			seen.delete(key);
			return { node: local, moduleInfo };
		}
		const aliased = resolveExportedValueWithModule(
			absolutePath,
			exportEntry.localName,
			seen
		);
		seen.delete(key);
		return aliased;
	}

	if (exportEntry.type === 'reExport') {
		const reExported = resolveExportedValueWithModule(
			exportEntry.sourceFile,
			exportEntry.localName,
			seen
		);
		seen.delete(key);
		return reExported;
	}

	seen.delete(key);
	return { node: null, moduleInfo: null };
}

function getExportedValue(modulePath, exportName, seen = new Set()) {
	const { node } = resolveExportedValueWithModule(modulePath, exportName, seen);
	return node;
}

function resolveIdentifierWithModule(moduleInfo, name, seen) {
	if (!name || !moduleInfo) return { node: null, moduleInfo: null };
	if (moduleInfo.values.has(name)) {
		return { node: moduleInfo.values.get(name), moduleInfo };
	}

	const importInfo = moduleInfo.imports.get(name);
	if (importInfo && importInfo.type !== 'namespace') {
		const direct = resolveExportedValueWithModule(
			importInfo.sourceFile,
			importInfo.importedName,
			seen
		);
		if (direct.node) return direct;
		if (importInfo.type === 'default') {
			return resolveExportedValueWithModule(
				importInfo.sourceFile,
				'default',
				seen
			);
		}
		return { node: null, moduleInfo: null };
	}

	const local = getExportedValue(moduleInfo.path, name, seen);
	if (!local) return { node: null, moduleInfo: null };
	return { node: local, moduleInfo };
}

function resolveMemberExpressionWithModule(
	moduleInfo,
	node,
	seen,
	scope = new Map()
) {
	if (!node || node.type !== 'MemberExpression' || !moduleInfo) {
		return { node: null, moduleInfo: null };
	}

	const propertyName = getMemberPropertyName(node, moduleInfo, seen, scope);
	if (!propertyName) return { node: null, moduleInfo: null };

	let objectValue = { node: node.object, moduleInfo };
	if (node.object.type === 'Identifier') {
		const importInfo = moduleInfo.imports.get(node.object.name);
		if (importInfo?.type === 'namespace') {
			return resolveExportedValueWithModule(
				importInfo.sourceFile,
				propertyName,
				seen
			);
		}
		objectValue = resolveIdentifierWithModule(
			moduleInfo,
			node.object.name,
			seen
		);
	} else if (node.object.type === 'MemberExpression') {
		objectValue = resolveMemberExpressionWithModule(
			moduleInfo,
			node.object,
			seen,
			scope
		);
	}

	if (!objectValue.node) return { node: null, moduleInfo: null };
	if (objectValue.node.type === 'Identifier') {
		objectValue = resolveIdentifierWithModule(
			objectValue.moduleInfo || moduleInfo,
			objectValue.node.name,
			seen
		);
	}

	if (objectValue.node?.type !== 'ObjectExpression') {
		return { node: null, moduleInfo: null };
	}

	const objectModuleInfo = objectValue.moduleInfo || moduleInfo;
	for (const property of objectValue.node.properties) {
		if (property.type !== 'ObjectProperty') continue;
		if (getPropKey(property, objectModuleInfo, seen, scope) !== propertyName)
			continue;
		return {
			node: property.value,
			moduleInfo: objectModuleInfo,
		};
	}

	return { node: null, moduleInfo: null };
}

function resolveIdentifierValue(moduleInfo, name, seen) {
	return resolveIdentifierWithModule(moduleInfo, name, seen).node;
}

function resolveImportedValue(sourceFile, importedName, seen) {
	const { node } = resolveExportedValueWithModule(
		sourceFile,
		importedName,
		seen
	);
	return node;
}

const getImportedSymbol = (calleeName, moduleInfo) => {
	const importInfo = moduleInfo?.imports.get(calleeName);
	return importInfo ? importInfo.importedName : calleeName;
};

const extractFunctionResultNode = (
	functionNode,
	args,
	seen,
	scope = new Map()
) => {
	if (!functionNode) return null;
	if (
		functionNode.type !== 'ArrowFunctionExpression' &&
		functionNode.type !== 'FunctionDeclaration' &&
		functionNode.type !== 'FunctionExpression'
	) {
		return null;
	}

	const localScope = new Map(scope);
	const parameters = functionNode.params || [];
	for (let index = 0; index < parameters.length; index += 1) {
		const param = parameters[index];
		if (param.type === 'Identifier') {
			localScope.set(param.name, args[index]);
		}
	}

	let body = functionNode.body;
	if (body.type === 'BlockStatement') {
		const returnStatement = body.body.find(
			statement => statement.type === 'ReturnStatement'
		);
		if (!returnStatement || !returnStatement.argument) return null;
		body = returnStatement.argument;
	}

	if (body.type !== 'Identifier' &&
		body.type !== 'StringLiteral' &&
		body.type !== 'TemplateLiteral' &&
		body.type !== 'ObjectExpression' &&
		body.type !== 'ArrayExpression' &&
		body.type !== 'CallExpression') {
		return null;
	}

	if (body.type === 'Identifier' && localScope.has(body.name)) {
		body = localScope.get(body.name);
	}

	return { node: body, scope: localScope };
};

const resolveCallArgument = (
	argument,
	moduleInfo,
	seen,
	scope = new Map()
) => {
	if (!argument) return { node: null, moduleInfo, scope };

	if (
		argument.type === 'ObjectExpression' ||
		argument.type === 'StringLiteral' ||
		argument.type === 'TemplateLiteral'
	) {
		return { node: argument, moduleInfo, scope };
	}

	if (argument.type === 'Identifier') {
		const resolved = resolveIdentifierWithModule(
			moduleInfo,
			argument.name,
			seen
		);
		if (!resolved.node || resolved.node === argument) {
			return { node: argument, moduleInfo, scope };
		}
		return resolveCallArgument(
			resolved.node,
			resolved.moduleInfo || moduleInfo,
			seen,
			scope
		);
	}

	if (argument.type === 'MemberExpression') {
		const resolved = resolveMemberExpressionWithModule(
			moduleInfo,
			argument,
			seen,
			scope
		);
		if (!resolved.node || resolved.node === argument) {
			return { node: argument, moduleInfo, scope };
		}
		return resolveCallArgument(
			resolved.node,
			resolved.moduleInfo || moduleInfo,
			seen,
			scope
		);
	}

	if (argument.type === 'CallExpression') {
		const resolvedCall = resolveCallExpression(
			argument,
			moduleInfo,
			seen,
			scope
		);
		if (!resolvedCall?.node) return null;
		if (resolvedCall.node.type === 'Identifier') {
			return { node: argument, moduleInfo, scope };
		}
		return resolveCallArgument(
			resolvedCall.node,
			resolvedCall.moduleInfo || moduleInfo,
			seen,
			resolvedCall.scope || scope
		);
	}

	return { node: argument, moduleInfo, scope };
};

const toArgMap = (node, moduleInfo, seen, scope = new Map()) => {
	const resolvedNode = resolveCallArgument(node, moduleInfo, seen, scope);
	if (!resolvedNode?.node || resolvedNode.node.type !== 'ObjectExpression') {
		return new Map();
	}

	const { node: nodeValue, moduleInfo: contextModuleInfo, scope: contextScope } =
		resolvedNode;
	const map = new Map();
	for (const property of nodeValue.properties) {
		if (property.type !== 'ObjectProperty') continue;
		const key = getPropKey(property, contextModuleInfo, seen, contextScope);
		if (!key) continue;
		map.set(
			key,
			resolveCallArgument(
				property.value,
				contextModuleInfo,
				seen,
				contextScope
			)
		);
	}

	return map;
};

const resolveCallExpression = (
	callExpression,
	moduleInfo,
	seen,
	scope = new Map()
) => {
	if (!callExpression || callExpression.type !== 'CallExpression') return null;

	const callee = callExpression.callee;
	let functionModule = null;
	if (callee.type === 'Identifier') {
		functionModule = resolveIdentifierWithModule(
			moduleInfo,
			callee.name,
			seen
		);
	} else if (
		callee.type === 'MemberExpression' &&
		callee.object.type === 'Identifier' &&
		callee.property.type === 'Identifier'
	) {
		const importInfo = moduleInfo?.imports.get(callee.object.name);
		if (importInfo && importInfo.type === 'namespace') {
			functionModule = resolveExportedValueWithModule(
				importInfo.sourceFile,
				callee.property.name,
				seen
			);
		}
	}

	if (!functionModule?.node || !functionModule.moduleInfo) return null;
	if (
		functionModule.node.type !== 'FunctionDeclaration' &&
		functionModule.node.type !== 'FunctionExpression' &&
		functionModule.node.type !== 'ArrowFunctionExpression'
	) {
		return {
			node: functionModule.node,
			scope,
			moduleInfo: functionModule.moduleInfo,
		};
	}

	const functionResult = extractFunctionResultNode(
		functionModule.node,
		callExpression.arguments,
		seen,
		scope
	);
	if (!functionResult) return null;

	return {
		node: functionResult.node,
		scope: functionResult.scope,
		moduleInfo: functionModule.moduleInfo,
	};
};
const collectKeysFromStyleNode = (
	node,
	moduleInfo,
	seen = new Set(),
	scope = new Map()
) => {
	const keys = new Set();
	if (!node) return keys;

	if (node.type === 'StringLiteral') {
		keys.add(node.value);
		return keys;
	}

	if (node.type === 'TemplateLiteral') {
		const value = getLiteralString(node);
		if (value) keys.add(value);
		return keys;
	}

	if (node.type === 'Identifier') {
		const resolved = resolveIdentifierWithModule(moduleInfo, node.name, seen);
		if (!resolved.node || resolved.node === node) return keys;
		return collectKeysFromStyleNode(
			resolved.node,
			resolved.moduleInfo || moduleInfo,
			seen,
			scope
		);
	}

	if (node.type === 'MemberExpression') {
		const resolved = resolveMemberExpressionWithModule(
			moduleInfo,
			node,
			seen,
			scope
		);
		if (!resolved.node || resolved.node === node) return keys;
		return collectKeysFromStyleNode(
			resolved.node,
			resolved.moduleInfo || moduleInfo,
			seen,
			scope
		);
	}

	if (node.type === 'ArrayExpression') {
		for (const element of node.elements) {
			for (const key of collectKeysFromStyleNode(
				element,
				moduleInfo,
				seen,
				scope
			)) {
				keys.add(key);
			}
		}
		return keys;
	}

	if (node.type === 'ObjectExpression') {
		for (const property of node.properties) {
			if (property.type === 'ObjectProperty') {
				const key = getPropKey(property, moduleInfo, seen, scope);
				if (key && !key.startsWith('_')) keys.add(key);
				continue;
			}
			if (property.type === 'SpreadElement') {
				for (const key of collectKeysFromStyleNode(
					property.argument,
					moduleInfo,
					seen,
					scope
				)) {
					keys.add(key);
				}
			}
		}
		return keys;
	}

	if (node.type !== 'CallExpression') return keys;

	const resolvedCall = resolveCallExpression(node, moduleInfo, seen, scope);
	if (!resolvedCall?.node) return keys;

	const callee = node.callee;
	let functionName = null;
	if (callee.type === 'Identifier') {
		functionName = getImportedSymbol(callee.name, moduleInfo);
	} else if (
		callee.type === 'MemberExpression' &&
		callee.object.type === 'Identifier' &&
		callee.property.type === 'Identifier'
	) {
		const importInfo = moduleInfo?.imports.get(callee.object.name);
		if (importInfo && importInfo.type === 'namespace') {
			functionName = callee.property.name;
		}
	}

	if (!functionName) {
		return collectKeysFromStyleNode(
			resolvedCall.node,
			resolvedCall.moduleInfo || moduleInfo,
			seen,
			resolvedCall.scope || scope
		);
	}

	const firstArg = node.arguments[0] || {};
	const args = toArgMap(firstArg, moduleInfo, seen, scope);
	const secondArg = node.arguments[1];

	if (functionName === 'transitionAttributesCreator') {
		keys.add('transition');
		const transitionRef = args.get('transition') || {};
		const transitionTypes = transitionRef.node
			? collectKeysFromStyleNode(
					transitionRef.node,
					transitionRef.moduleInfo || moduleInfo,
					seen,
					transitionRef.scope || scope
			  )
			: new Set(['canvas']);

		if (args.has('selectors')) {
			transitionTypes.add('transform');
		}

		for (const type of transitionTypes) {
			keys.add(`transition-${type}-selected`);
		}
		return keys;
	}

	if (functionName === 'breakpointAttributesCreator') {
		const argRef = args.get('obj') || {};
		const raw = collectKeysFromStyleNode(
			argRef.node,
			argRef.moduleInfo || moduleInfo,
			seen,
			argRef.scope || scope
		);
		const noBreakpointAttr = new Set(
			getLiteralStringsFromArray(
				(args.get('noBreakpointAttr') || {}).node
			)
		);
		for (const key of raw) {
			if (noBreakpointAttr.has(key)) {
				keys.add(key);
				continue;
			}
			for (const bp of BREAKPOINTS) keys.add(`${key}-${bp}`);
		}
		return keys;
	}

	if (functionName === 'paletteAttributesCreator') {
		const prefix =
			resolveLiteralString(
				(args.get('prefix') || {}).node,
				moduleInfo,
				seen
			) || '';
		for (const key of makePaletteKeys(prefix)) keys.add(key);
		return keys;
	}

	if (functionName === 'prefixAttributesCreator') {
		const objRef = args.get('obj') || {};
		const newAttrRef = args.get('newAttr') || {};
		const raw = collectKeysFromStyleNode(
			objRef.node,
			objRef.moduleInfo || moduleInfo,
			seen,
			objRef.scope || scope
		);
		const exclAttr = new Set(
			getLiteralStringsFromArray((args.get('exclAttr') || {}).node)
		);
		const prefix =
			resolveLiteralString((args.get('prefix') || {}).node, moduleInfo, seen) ||
			'';
		for (const key of raw) {
			if (exclAttr.has(key)) continue;
			keys.add(`${prefix}${key}`);
		}
		for (const key of collectKeysFromStyleNode(
			newAttrRef.node,
			newAttrRef.moduleInfo || moduleInfo,
			seen,
			newAttrRef.scope || scope
		)) {
			keys.add(key);
		}
		return keys;
	}

	if (functionName === 'hoverAttributesCreator') {
		const objRef = args.get('obj') || {};
		const newAttrRef = args.get('newAttr') || {};
		const raw = collectKeysFromStyleNode(
			objRef.node,
			objRef.moduleInfo || moduleInfo,
			seen,
			objRef.scope || scope
		);
		for (const key of raw) keys.add(`${key}-hover`);
		for (const key of collectKeysFromStyleNode(
			newAttrRef.node,
			newAttrRef.moduleInfo || moduleInfo,
			seen,
			newAttrRef.scope || scope
		)) {
			keys.add(key);
		}
		return keys;
	}

	if (functionName === 'activeAttributesCreator') {
		const objRef = args.get('obj') || {};
		const newAttrRef = args.get('newAttr') || {};
		const raw = collectKeysFromStyleNode(
			objRef.node,
			objRef.moduleInfo || moduleInfo,
			seen,
			objRef.scope || scope
		);
		for (const key of raw) keys.add(`active-${key}`);
		for (const key of collectKeysFromStyleNode(
			newAttrRef.node,
			newAttrRef.moduleInfo || moduleInfo,
			seen,
			newAttrRef.scope || scope
		)) {
			keys.add(key);
		}
		return keys;
	}

	if (functionName === 'linkAttributesCreator') {
		const withDefaults = getLiteralBoolean(firstArg) ?? true;
		const prefixes = ['link-', 'link-hover-', 'link-active-', 'link-visited-'];
		for (const prefix of prefixes) {
			for (const bp of BREAKPOINTS) {
				for (const key of makePaletteKeys(prefix)) {
					keys.add(`${key}-${bp}`);
				}
			}
		}
		return keys;
	}

	if (functionName === 'typographyAttributesCreator') {
		const withDefaults = getLiteralBoolean(firstArg) ?? true;
		const disableBottomGap = getLiteralBoolean(secondArg) ?? false;
		const raw = new Set([
			'font-family',
			'font-size-unit',
			'font-size',
			'line-height-unit',
			'line-height',
			'letter-spacing-unit',
			'letter-spacing',
			'font-weight',
			'text-transform',
			'font-style',
			'text-decoration',
			'text-shadow',
			'vertical-align',
			'custom-formats',
			'text-indent',
			'text-indent-unit',
			'text-orientation',
			'text-direction',
			'text-wrap',
			'white-space',
			'word-spacing',
			'word-spacing-unit',
		]);
		for (const key of withDefaults ? makePaletteKeys('') : []) raw.add(key);
		for (const key of withDefaults ? makePaletteKeys('list-') : [])
			raw.add(key);
		if (!disableBottomGap) {
			raw.add('bottom-gap');
			raw.add('bottom-gap-unit');
		}
		for (const key of raw) {
			if (key === 'custom-formats') {
				keys.add(key);
				continue;
			}
			for (const bp of BREAKPOINTS) keys.add(`${key}-${bp}`);
		}
		return keys;
	}

	return collectKeysFromStyleNode(
		resolvedCall.node,
		resolvedCall.moduleInfo || moduleInfo,
		seen,
		resolvedCall.scope || scope
	);
};

const getTemplateNode = templateName => {
	if (!templateName) return null;
	const normalizedTemplate = normalizeKey(templateName);
	if (TEMPLATE_CACHE.has(normalizedTemplate)) {
		return TEMPLATE_CACHE.get(normalizedTemplate);
	}
	const templateObj = collectTemplateObjects(STYLE_TEMPLATES_PATH);
	const templateNode = templateObj.get(normalizedTemplate) || null;
	TEMPLATE_CACHE.set(normalizedTemplate, templateNode);
	return templateNode;
};

const collectTemplateObjects = templateModulePath => {
	const result = new Map();
	const moduleInfo = getModuleInfo(templateModulePath);
	const ast = moduleInfo.ast;
	for (const statement of ast.program.body) {
		if (statement.type !== 'VariableDeclaration') continue;
		for (const declaration of statement.declarations) {
			if (
				declaration.id.type === 'Identifier' &&
				declaration.id.name === 'templates' &&
				declaration.init?.type === 'ObjectExpression'
			) {
				for (const property of declaration.init.properties) {
					if (property.type !== 'ObjectProperty') continue;
					const key = getPropKey(property, moduleInfo);
					if (!key || property.value.type !== 'ObjectExpression') continue;
					result.set(key, property.value);
				}
				return result;
			}
		}
	}
	return result;
};

const hasControlKey = key => ['template', 'prefix'].includes(key);
const controlBoolKeys = new Set(['hasBreakpoints', 'isPalette', 'isHover']);

const mergeTemplateAndOverride = (templateNode, overrideNode) => {
	if (!templateNode) return overrideNode;
	const map = new Map();
	const computedOverrides = [];
	for (const property of templateNode.properties) {
		if (property.type !== 'ObjectProperty') continue;
		const key = getPropKey(property);
		if (!key) continue;
		map.set(key, property);
	}
	for (const property of overrideNode.properties) {
		if (property.type !== 'ObjectProperty') continue;
		const key = getPropKey(property);
		if (key === 'template') continue;
		if (!key) {
			computedOverrides.push(property);
			continue;
		}
		map.set(key, property);
	}

	const merged = [];
	for (const property of templateNode.properties) {
		const key = getPropKey(property);
		if (!key) continue;
		if (map.get(key) && map.get(key) !== property) {
			merged.push(map.get(key));
			map.delete(key);
			continue;
		}
		merged.push(property);
		map.delete(key);
	}
	for (const property of map.values()) {
		merged.push(property);
	}
	for (const property of computedOverrides) {
		merged.push(property);
	}
	return {
		type: 'ObjectExpression',
		properties: merged,
	};
};

const expandFromProps = (
	node,
	context,
	moduleInfo,
	seen,
	scope = new Map()
) => {
	const result = new Set();
	if (!node) return result;

	const rawValues = new Set();
	if (node.type === 'StringLiteral') {
		rawValues.add(normalizeKey(node.value));
	} else if (node.type === 'TemplateLiteral') {
		const resolved = resolveLiteralString(node, moduleInfo, seen, scope);
		if (resolved) {
			rawValues.add(normalizeKey(resolved));
		}
	} else if (node.type === 'Identifier') {
		const resolved = resolveIdentifierWithModule(moduleInfo, node.name, seen);
		if (resolved.node) {
			for (const key of collectKeysFromStyleNode(
				resolved.node,
				resolved.moduleInfo || moduleInfo,
				seen,
				scope
			)) {
				rawValues.add(normalizeKey(key));
			}
		}
	} else if (node.type === 'ArrayExpression') {
		for (const element of node.elements) {
			if (!element) continue;
			if (element.type === 'StringLiteral') {
				rawValues.add(normalizeKey(element.value));
				continue;
			}
			if (element.type === 'Identifier') {
				const resolved = resolveIdentifierWithModule(
					moduleInfo,
					element.name,
					seen
				);
				if (!resolved.node) continue;
				for (const value of collectKeysFromStyleNode(
					resolved.node,
					resolved.moduleInfo || moduleInfo,
					seen,
					scope
				)) {
					rawValues.add(normalizeKey(value));
				}
			} else if (element.type === 'CallExpression') {
				const resolvedCall = resolveCallExpression(
					element,
					moduleInfo,
					seen,
					scope
				);
				if (!resolvedCall?.node) continue;
				for (const value of collectKeysFromStyleNode(
					resolvedCall.node,
					resolvedCall.moduleInfo || moduleInfo,
					seen,
					resolvedCall.scope || scope
				)) {
					rawValues.add(normalizeKey(value));
				}
			}
		}
	} else if (node.type === 'CallExpression') {
		const resolvedCall = resolveCallExpression(node, moduleInfo, seen, scope);
		if (resolvedCall?.node) {
			for (const value of collectKeysFromStyleNode(
				resolvedCall.node,
				resolvedCall.moduleInfo || moduleInfo,
				seen,
				resolvedCall.scope || scope
			)) {
				rawValues.add(normalizeKey(value));
			}
		}
	}

	for (const baseKey of rawValues) {
		let expanded = [context.prefix ? `${context.prefix}${baseKey}` : baseKey];
		if (context.isPalette) {
			expanded = expanded.flatMap(p => makePaletteKeys(`${p}-`));
		}
		if (context.hasBreakpoints) {
			expanded = expanded.flatMap(p => BREAKPOINTS.map(bp => `${p}-${bp}`));
		}
		if (context.isHover) {
			expanded = expanded.map(p => `${p}-hover`);
		}
		for (const key of expanded) {
			result.add(key);
		}
	}

	return result;
};

const expandFromGroupAttributes = (node, context, moduleInfo) => {
	const rawGroups = new Set();
	if (node.type === 'StringLiteral') {
		rawGroups.add(node.value);
	} else if (node.type === 'ArrayExpression') {
		for (const value of node.elements) {
			const literal = getLiteralString(value);
			if (literal) rawGroups.add(literal);
		}
	} else if (node.type === 'Identifier') {
		const resolved = resolveIdentifierWithModule(
			moduleInfo,
			node.name,
			new Set()
		);
		if (resolved.node) {
			for (const value of collectKeysFromStyleNode(
				resolved.node,
				resolved.moduleInfo || moduleInfo,
				new Set()
			)) {
				rawGroups.add(value);
			}
		}
	}

	const output = new Set();
	for (const groupName of rawGroups) {
		for (const key of getGroupAttributeKeys(groupName)) {
			output.add(context.prefix ? `${context.prefix}${key}` : key);
		}
	}
	return output;
};

const getGroupAttributeKeys = groupName => {
	if (!groupName) return [];
	if (GROUP_ATTRIBUTE_CACHE.has(groupName)) {
		return GROUP_ATTRIBUTE_CACHE.get(groupName);
	}

	const resolved = resolveExportedValueWithModule(
		DEFAULTS_INDEX_PATH,
		groupName,
		new Set()
	);
	if (!resolved.node) {
		GROUP_ATTRIBUTE_CACHE.set(groupName, []);
		return [];
	}
	const keys = collectKeysFromStyleNode(
		resolved.node,
		resolved.moduleInfo || getModuleInfo(DEFAULTS_INDEX_PATH),
		new Set()
	);
	const ordered = Array.from(keys);
	GROUP_ATTRIBUTE_CACHE.set(groupName, ordered);
	return ordered;
};

const collectCopyPasteKeys = (
	node,
	moduleInfo,
	context = {},
	seen = new Set(),
	scope = new Map(),
	callStack = new Set()
) => {
	const output = new Set();
	if (!node) return output;
	if (callStack.has(node)) return output;
	callStack.add(node);

	if (
		node.type === 'StringLiteral' ||
		node.type === 'ArrayExpression' ||
		node.type === 'TemplateLiteral'
	) {
		for (const key of expandFromProps(
			node,
			context,
			moduleInfo,
			seen,
			scope
		)) {
			output.add(key);
		}
		callStack.delete(node);
		return output;
	}

	if (node.type === 'Identifier') {
		const resolved = resolveIdentifierWithModule(moduleInfo, node.name, seen);
		if (resolved.node && resolved.node !== node) {
			for (const key of collectCopyPasteKeys(
				resolved.node,
				resolved.moduleInfo || moduleInfo,
				context,
				seen,
				scope,
				callStack
			)) {
				output.add(key);
			}
		}
		callStack.delete(node);
		return output;
	}

	if (node.type === 'CallExpression') {
		const resolvedCall = resolveCallExpression(node, moduleInfo, seen, scope);
		if (resolvedCall?.node) {
			for (const key of collectCopyPasteKeys(
				resolvedCall.node,
				resolvedCall.moduleInfo || moduleInfo,
				context,
				seen,
				resolvedCall.scope || scope,
				callStack
			)) {
				output.add(key);
			}
		}
		callStack.delete(node);
		return output;
	}

	if (node.type !== 'ObjectExpression') {
		callStack.delete(node);
		return output;
	}

	let workingNode = node;
	const templateName = getLiteralString(
		getObjectEntries(node, moduleInfo, seen, scope).find(
			entry => entry.key === 'template'
		)?.value
	);
	const templateNode = getTemplateNode(templateName);
	if (templateNode) {
		workingNode = mergeTemplateAndOverride(templateNode, node);
	}

	const nextContext = { ...context };
	const properties = workingNode?.properties || [];
	for (const property of properties) {
		if (property.type !== 'ObjectProperty') continue;
		const key = getPropKey(property, moduleInfo, seen, scope);
		if (key === 'template' && templateNode) continue;
		if (key === 'prefix' && property.value.type === 'StringLiteral') {
			nextContext.prefix = property.value.value;
			continue;
		}
		if (key === 'prefix') {
			const resolvedPrefix = resolveLiteralString(
				property.value,
				moduleInfo,
				seen,
				scope
			);
			if (resolvedPrefix) nextContext.prefix = resolvedPrefix;
			continue;
		}
		if (
			key === 'hasBreakpoints' &&
			resolveLiteralBoolean(property.value, moduleInfo, seen) === true
		) {
			nextContext.hasBreakpoints = true;
			continue;
		}
		if (
			key === 'isPalette' &&
			resolveLiteralBoolean(property.value, moduleInfo, seen) === true
		) {
			nextContext.isPalette = true;
			continue;
		}
		if (
			key === 'isHover' &&
			resolveLiteralBoolean(property.value, moduleInfo, seen) === true
		) {
			nextContext.isHover = true;
			continue;
		}
	}

	const hasLeafSignal = properties.some(
		property =>
			property.type === 'ObjectProperty' &&
			['props', 'group', 'groupAttributes'].includes(
				getPropKey(property, moduleInfo, seen, scope)
			)
	);
	const getEntryByKey = key =>
		properties.find(
			property =>
				property.type === 'ObjectProperty' &&
				getPropKey(property, moduleInfo, seen, scope) === key
		);

	if (hasLeafSignal) {
		const propsEntry = getEntryByKey('props');
		if (propsEntry?.value) {
			for (const key of expandFromProps(
				propsEntry.value,
				nextContext,
				moduleInfo,
				seen,
				scope
			)) {
				output.add(key);
			}
		}

		const groupAttrsEntry = getEntryByKey('groupAttributes');
		if (groupAttrsEntry?.value) {
			for (const key of expandFromGroupAttributes(
				groupAttrsEntry.value,
				nextContext,
				moduleInfo
			)) {
				output.add(key);
			}
		}

		const groupEntry = getEntryByKey('group');
		if (groupEntry?.value) {
			for (const key of collectCopyPasteKeys(
				groupEntry.value,
				moduleInfo,
				nextContext,
				seen,
				scope,
				callStack
			)) {
				output.add(key);
			}
		}
	}

	for (const property of properties) {
		if (property.type === 'ObjectProperty') {
			const key = getPropKey(property, moduleInfo, seen, scope);
			if (key?.startsWith('_')) continue;
			if (controlBoolKeys.has(key) || hasControlKey(key)) continue;
			if (['props', 'group', 'groupAttributes'].includes(key))
				continue;

			for (const key of collectCopyPasteKeys(
				property.value,
				moduleInfo,
				nextContext,
				seen,
				scope,
				callStack
			)) {
				output.add(key);
			}
			continue;
		}

		if (property.type === 'SpreadElement') {
			for (const key of collectCopyPasteKeys(
				property.argument,
				moduleInfo,
				nextContext,
				seen,
				scope,
				callStack
			)) {
				output.add(key);
			}
		}
	}

	callStack.delete(node);
	return output;
};

const getCopyPasteMapping = blockDataPath => {
	const moduleInfo = getModuleInfo(blockDataPath);
	const mappingNode = getExportedValue(blockDataPath, 'copyPasteMapping');
	const exactMapped = new Set(collectCopyPasteKeys(mappingNode, moduleInfo, {}));
	const mapped = new Set();
	for (const key of exactMapped) {
		mapped.add(key);
		mapped.add(normalizeStyleKey(key));
	}

	const excluded = new Set(GLOBAL_COPY_PASTE_EXCLUDE);
	const excludeNode = getObjectEntries(mappingNode, moduleInfo).find(
		entry => entry.key === '_exclude'
	)?.value;
	for (const key of getLiteralStringsFromArray(excludeNode)) {
		excluded.add(key);
	}

	const styleNode = getExportedValue(blockDataPath, 'attributesToStyles');
	const styleKeys = new Set();
	if (styleNode?.type === 'ObjectExpression') {
		for (const property of styleNode.properties) {
			if (property.type !== 'ObjectProperty') continue;
			const styleKey = getPropKey(property);
			if (!styleKey || property.computed) continue;
			styleKeys.add(styleKey);
		}
	}
	return { mapped, exactMapped, excluded, styleKeys };
};

const getBlockAttributeKeys = blockAttributesPath => {
	const moduleInfo = getModuleInfo(blockAttributesPath);
	const attributesNode =
		getExportedValue(blockAttributesPath, 'default') ||
		getExportedValue(blockAttributesPath, 'attributes');
	return new Set(collectKeysFromStyleNode(attributesNode, moduleInfo));
};

const getCopyPasteCoverageForBlock = (blockName, blockDataPath) => {
	const { mapped, styleKeys } = getCopyPasteMapping(blockDataPath);
	const missingStyleKeys = [];
	for (const styleKey of styleKeys) {
		if (styleKey.startsWith('_')) continue;
		if (styleKey.startsWith('content-')) continue;
		const normalizedStyle = normalizeStyleKey(styleKey);
		if (mapped.has(styleKey) || mapped.has(normalizedStyle)) continue;
		missingStyleKeys.push(styleKey);
	}

	return {
		block: blockName,
		mappedCount: mapped.size,
		styleAttributeCount: styleKeys.size,
		missingStyleKeys: missingStyleKeys.sort(),
		hasCopyPasteMapping: mapped.size > 0,
	};
};

const getCopyPasteAttributeCoverageForBlock = (
	blockName,
	blockAttributesPath,
	blockDataPath
) => {
	const attributeKeys = getBlockAttributeKeys(blockAttributesPath);
	const { exactMapped, excluded } = getCopyPasteMapping(blockDataPath);
	const coveredAttributeKeys = [];
	const excludedAttributeKeys = [];
	const missingAttributeKeys = [];

	for (const attributeKey of attributeKeys) {
		if (attributeKey.startsWith('_')) continue;
		if (excluded.has(attributeKey)) {
			excludedAttributeKeys.push(attributeKey);
			continue;
		}
		if (exactMapped.has(attributeKey)) {
			coveredAttributeKeys.push(attributeKey);
			continue;
		}
		missingAttributeKeys.push(attributeKey);
	}

	const sortKeys = keys => keys.sort((a, b) => a.localeCompare(b));
	const sortedMissingAttributeKeys = sortKeys(missingAttributeKeys);
	const missingAttributeCategories = groupAttributeKeysByCategory(
		sortedMissingAttributeKeys
	);

	return {
		block: blockName,
		attributeCount: attributeKeys.size,
		copyPasteAttributeCount: exactMapped.size,
		coveredAttributeCount: coveredAttributeKeys.length,
		excludedAttributeCount: excludedAttributeKeys.length,
		missingAttributeCount: missingAttributeKeys.length,
		coveredAttributeKeys: sortKeys(coveredAttributeKeys),
		excludedAttributeKeys: sortKeys(excludedAttributeKeys),
		missingAttributeKeys: sortedMissingAttributeKeys,
		missingAttributeCategories,
		missingAttributeCategoryCounts: Object.fromEntries(
			Object.entries(missingAttributeCategories).map(([category, keys]) => [
				category,
				keys.length,
			])
		),
		hasCopyPasteMapping: exactMapped.size > 0,
	};
};

const runCopyPasteCoverageScan = (root = process.cwd()) => {
	const sourceRoot = path.normalize(root);
	const blocksRoot = path.join(sourceRoot, 'src', 'blocks');
	if (!fs.existsSync(blocksRoot)) {
		throw new Error(`Invalid blocks root: ${blocksRoot}`);
	}

	const blocks = fs
		.readdirSync(blocksRoot)
		.filter(name =>
			fs.existsSync(path.join(blocksRoot, name, 'data.js'))
		)
		.sort();

	const report = [];
	for (const block of blocks) {
		if (block === 'cloud-maxi') continue;
		report.push(
			getCopyPasteCoverageForBlock(
				block,
				path.join(blocksRoot, block, 'data.js')
			)
		);
	}

	return report;
};

const runCopyPasteAttributeCoverageScan = (root = process.cwd()) => {
	const sourceRoot = path.normalize(root);
	const blocksRoot = path.join(sourceRoot, 'src', 'blocks');
	if (!fs.existsSync(blocksRoot)) {
		throw new Error(`Invalid blocks root: ${blocksRoot}`);
	}

	const blocks = fs
		.readdirSync(blocksRoot)
		.filter(
			name =>
				fs.existsSync(path.join(blocksRoot, name, 'data.js')) &&
				fs.existsSync(path.join(blocksRoot, name, 'attributes.js'))
		)
		.sort();

	return blocks
		.filter(block => block !== 'cloud-maxi')
		.map(block =>
			getCopyPasteAttributeCoverageForBlock(
				block,
				path.join(blocksRoot, block, 'attributes.js'),
				path.join(blocksRoot, block, 'data.js')
			)
		);
};

module.exports = {
	categorizeAttributeKey,
	collectKeysFromStyleNode,
	getBlockAttributeKeys,
	getGroupAttributeKeys,
	resolveExportedValueWithModule,
	getModuleInfo,
	runCopyPasteAttributeCoverageScan,
	runCopyPasteCoverageScan,
	getCopyPasteAttributeCoverageForBlock,
	getCopyPasteCoverageForBlock,
	getCopyPasteMapping: getCopyPasteMapping,
};

