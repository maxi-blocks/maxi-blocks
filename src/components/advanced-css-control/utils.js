const splitCssDeclarations = css => {
	const declarations = [];
	let quote = null;
	let escapeNext = false;
	let parenthesisDepth = 0;
	let declaration = '';

	for (let index = 0; index < css.length; index += 1) {
		const char = css[index];

		if (escapeNext) {
			declaration += char;
			escapeNext = false;
			continue;
		}

		if (quote) {
			declaration += char;
			if (char === '\\') escapeNext = true;
			else if (char === quote) quote = null;
			continue;
		}

		if (char === '"' || char === "'") {
			quote = char;
			declaration += char;
			continue;
		}

		if (char === '(') parenthesisDepth += 1;
		else if (char === ')' && parenthesisDepth > 0) parenthesisDepth -= 1;

		if (char === ';' && parenthesisDepth === 0) {
			declarations.push(declaration);
			declaration = '';
			continue;
		}

		declaration += char;
	}

	if (declaration.trim()) declarations.push(declaration);

	return declarations;
};

const stripCssComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '');

const isValidDeclarationList = css => {
	const declarations = splitCssDeclarations(stripCssComments(css));

	return declarations.every(declaration => {
		const trimmedDeclaration = declaration.trim();
		if (!trimmedDeclaration) return true;

		const colonIndex = trimmedDeclaration.indexOf(':');
		if (colonIndex <= 0) return false;

		const propertyName = trimmedDeclaration.substring(0, colonIndex).trim();
		return /^-{0,2}[_a-zA-Z][-_a-zA-Z0-9]*$/.test(propertyName);
	});
};

const getInnermostDeclarationLists = css => {
	const lists = [];
	const stack = [];
	let quote = null;
	let escapeNext = false;
	let inComment = false;

	for (let index = 0; index < css.length; index += 1) {
		const char = css[index];
		const nextChar = css[index + 1];

		if (inComment) {
			if (char === '*' && nextChar === '/') {
				inComment = false;
				index += 1;
			}
			continue;
		}

		if (escapeNext) {
			escapeNext = false;
			continue;
		}

		if (quote) {
			if (char === '\\') escapeNext = true;
			else if (char === quote) quote = null;
			continue;
		}

		if (char === '/' && nextChar === '*') {
			inComment = true;
			index += 1;
			continue;
		}

		if (char === '"' || char === "'") {
			quote = char;
			continue;
		}

		if (char === '{') {
			if (stack.length) stack[stack.length - 1].hasChildBlock = true;
			stack.push({ start: index + 1, hasChildBlock: false });
			continue;
		}

		if (char === '}') {
			const block = stack.pop();
			if (!block) return null;
			if (!block.hasChildBlock) lists.push(css.substring(block.start, index));
		}
	}

	if (quote || inComment || stack.length) return null;

	return lists;
};

export const isValidAdvancedCss = (code, transformCssCode = value => value) => {
	if (!code?.trim()) return true;

	const transformedCode = transformCssCode(code);
	const declarationLists = getInnermostDeclarationLists(transformedCode);

	if (!declarationLists) return false;

	return declarationLists.every(isValidDeclarationList);
};

export const getAdvancedCssChange = ({
	code,
	currentValue,
	transformCssCode,
}) => {
	const nextCode = code ?? '';

	if (isValidAdvancedCss(nextCode, transformCssCode)) {
		const valueToPersist = nextCode.trim() ? nextCode : undefined;

		return {
			isValid: true,
			notValidCode: undefined,
			valueToPersist,
			shouldUpdateAttribute: valueToPersist !== currentValue,
		};
	}

	return {
		isValid: false,
		notValidCode: nextCode,
		valueToPersist: undefined,
		shouldUpdateAttribute: currentValue !== undefined,
	};
};
