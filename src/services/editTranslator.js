const DEFAULT_INTENTS = [
	{
		intent: 'backgroundColor',
		matches: [/\bbackground\b/, /\bbg\b/],
		valueType: 'color',
	},
	{
		intent: 'textColor',
		matches: [/\btext color\b/, /\bfont color\b/, /\bcolor\b/],
		valueType: 'color',
	},
	{
		intent: 'fontSize',
		matches: [/\bfont size\b/, /\btext size\b/, /\bsize\b/],
		valueType: 'size',
	},
	{
		intent: 'padding',
		matches: [/\bpadding\b/],
		valueType: 'size',
	},
	{
		intent: 'margin',
		matches: [/\bmargin\b/],
		valueType: 'size',
	},
	{
		intent: 'borderRadius',
		matches: [/\bradius\b/, /\brounded\b/],
		valueType: 'size',
	},
	{
		intent: 'alignment',
		matches: [/\balign\b/, /\balignment\b/, /\bcenter\b/, /\bleft\b/, /\bright\b/, /\bjustify\b/],
		valueType: 'alignment',
	},
	{
		intent: 'width',
		matches: [/\bwidth\b/, /\bwide\b/, /\bfull width\b/],
		valueType: 'size',
	},
	{
		intent: 'height',
		matches: [/\bheight\b/, /\btall\b/],
		valueType: 'size',
	},
	{
		intent: 'opacity',
		matches: [/\bopacity\b/, /\btransparent\b/],
		valueType: 'opacity',
	},
];

const COLOR_NAMES = [
	'black',
	'white',
	'gray',
	'grey',
	'red',
	'green',
	'blue',
	'yellow',
	'purple',
	'orange',
	'pink',
	'teal',
	'cyan',
	'brown',
];

const DEFAULT_ATTRIBUTE_HINTS = {
	backgroundColor: ['background-color', 'background-color-general'],
	textColor: ['palette-color', 'color', 'text-color', 'font-color'],
	fontSize: ['font-size', 'font-size-general'],
	padding: ['padding', 'padding-general'],
	margin: ['margin', 'margin-general'],
	borderRadius: ['border-radius', 'radius'],
	alignment: ['text-alignment', 'textAlignment', 'alignment'],
	width: ['width', 'size-width'],
	height: ['height', 'size-height'],
	opacity: ['opacity'],
};

const normalizePrompt = prompt => (prompt || '').trim().toLowerCase();

const getBlockAbilities = blockSchema => {
	if (!blockSchema) return [];

	if (Array.isArray(blockSchema.abilities)) {
		return blockSchema.abilities;
	}

	if (blockSchema?.metadata?.abilities) {
		return blockSchema.metadata.abilities;
	}

	if (blockSchema.abilities && typeof blockSchema.abilities === 'object') {
		return Object.values(blockSchema.abilities);
	}

	return [];
};

const parsePaletteIndex = prompt => {
	const paletteMatch = prompt.match(/\bpalette\s*(\d+)\b/);
	if (paletteMatch) {
		return Number.parseInt(paletteMatch[1], 10);
	}

	const colorMatch = prompt.match(/\bcolor\s*(\d+)\b/);
	if (colorMatch) {
		return Number.parseInt(colorMatch[1], 10);
	}

	return null;
};

const parseColor = prompt => {
	const hexMatch = prompt.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/);
	if (hexMatch) {
		return `#${hexMatch[1]}`;
	}

	const rgbMatch = prompt.match(
		/\brgba?\((\s*\d+\s*),(\s*\d+\s*),(\s*\d+\s*)(?:,(\s*\d*\.?\d+\s*))?\)/
	);
	if (rgbMatch) {
		return rgbMatch[0].replace(/\s+/g, '');
	}

	const namedColor = COLOR_NAMES.find(color => prompt.includes(color));
	return namedColor || null;
};

const parseSize = prompt => {
	if (!prompt || typeof prompt !== 'string') return null;

	const withUnitMatch = prompt.match(
		/\b(\d+(?:\.\d+)?)(px|em|rem|%|vw|vh)\b/i
	);
	if (withUnitMatch) {
		const value = Number.parseFloat(withUnitMatch[1]);
		const unit = withUnitMatch[2].toLowerCase();
		return `${value}${unit}`;
	}

	const keywordMatch = prompt.match(
		/\b(?:font\s*size|font-size|size|width|height|padding|margin|radius|border\s*radius)\b[^\d]*(\d+(?:\.\d+)?)/i
	);
	if (keywordMatch) {
		const value = Number.parseFloat(keywordMatch[1]);
		return `${value}px`;
	}

	const reverseKeywordMatch = prompt.match(
		/(\d+(?:\.\d+)?)[^\d]*(?:font\s*size|font-size|size|width|height|padding|margin|radius|border\s*radius)\b/i
	);
	if (reverseKeywordMatch) {
		const value = Number.parseFloat(reverseKeywordMatch[1]);
		return `${value}px`;
	}

	return null;
};

const parseAlignment = prompt => {
	if (prompt.includes('center')) return 'center';
	if (prompt.includes('left')) return 'left';
	if (prompt.includes('right')) return 'right';
	if (prompt.includes('justify')) return 'justify';

	return null;
};

const clampOpacity = value => Math.min(1, Math.max(0, value));

const parseOpacity = prompt => {
	const percentMatch = prompt.match(/\b(\d+(?:\.\d+)?)%\b/);
	if (percentMatch) {
		return clampOpacity(Number.parseFloat(percentMatch[1]) / 100);
	}

	const valueMatch = prompt.match(/\bopacity\s*(\d+(?:\.\d+)?)\b/);
	if (valueMatch) {
		const rawValue = Number.parseFloat(valueMatch[1]);
		const normalisedValue =
			rawValue > 1 && rawValue <= 100 ? rawValue / 100 : rawValue;
		return clampOpacity(normalisedValue);
	}

	return null;
};

const resolveAbility = (abilities, intent) =>
	abilities.find(ability =>
		[ability.intent, ability.id, ability.name]
			.filter(Boolean)
			.includes(intent)
	);

const getAttributeKeys = blockSchema =>
	Object.keys(blockSchema?.attributes || {});

const findAttributeKey = (attributeKeys, candidates) => {
	if (!attributeKeys.length) return null;

	for (const candidate of candidates) {
		if (attributeKeys.includes(candidate)) return candidate;

		const generalCandidate = `${candidate}-general`;
		if (attributeKeys.includes(generalCandidate)) return generalCandidate;

		const prefixedCandidate = attributeKeys.find(key =>
			key.startsWith(candidate)
		);
		if (prefixedCandidate) return prefixedCandidate;
	}

	return null;
};

const resolveStyleCardToken = (ability, blockSchema) => {
	if (ability?.styleCardToken) return ability.styleCardToken;
	if (ability?.scToken) return ability.scToken;

	if (ability?.scType && ability?.scElement) {
		return `${ability.scType}-${ability.scElement}`;
	}

	const scType = blockSchema?.scProps?.scType;
	const scElements = blockSchema?.scProps?.scElements;

	if (scType && Array.isArray(scElements) && scElements.length > 0) {
		return `${scType}-${scElements[0]}`;
	}

	return null;
};

const normalizeIntentValue = (prompt, intent, valueType) => {
	if (valueType === 'color') return parseColor(prompt);
	if (valueType === 'size') return parseSize(prompt);
	if (valueType === 'alignment') return parseAlignment(prompt);
	if (valueType === 'opacity') return parseOpacity(prompt);

	if (intent === 'alignment') return parseAlignment(prompt);
	if (intent === 'opacity') return parseOpacity(prompt);
	if (intent === 'fontSize') return parseSize(prompt);
	if (intent === 'padding' || intent === 'margin' || intent === 'borderRadius') {
		return parseSize(prompt);
	}

	return null;
};

const mapIntentToPatch = ({
	intent,
	value,
	ability,
	blockSchema,
	patch,
}) => {
	if (ability?.styleCardToken || ability?.scToken || ability?.scType) {
		const token = resolveStyleCardToken(ability, blockSchema);
		if (token && value !== null) {
			patch.styleCardTokens[token] = value;
			return;
		}
	}

	const attributeKeys = getAttributeKeys(blockSchema);
	const abilityAttributes = [
		ability?.attribute,
		...(ability?.attributes || []),
	].filter(Boolean);

	if (abilityAttributes.length > 0) {
		abilityAttributes.forEach(attributeKey => {
			if (attributeKeys.includes(attributeKey)) {
				patch.attrs[attributeKey] = value;
			}
		});

		return;
	}

	const fallbackCandidates = DEFAULT_ATTRIBUTE_HINTS[intent] || [];
	const fallbackAttribute = findAttributeKey(attributeKeys, fallbackCandidates);
	if (fallbackAttribute) {
		patch.attrs[fallbackAttribute] = value;
	}
};

const parsePromptIntents = prompt =>
	DEFAULT_INTENTS.filter(intentConfig =>
		intentConfig.matches.some(match => match.test(prompt))
	);

export const buildGutenbergComment = (blockName, attrs) => {
	const attributes = attrs && Object.keys(attrs).length
		? ` ${JSON.stringify(attrs)}`
		: '';

	return `<!-- wp:${blockName}${attributes} -->`;
};

export const createPatchPreview = patch => ({
	blockName: patch.blockName,
	attrs: patch.attrs,
	styleCardTokens: patch.styleCardTokens,
	comment: buildGutenbergComment(patch.blockName, patch.attrs),
	intents: patch.intents,
});

export const applyPatchWithPreview = async ({ patch, onPreview, onApply }) => {
	const preview = createPatchPreview(patch);
	const shouldApply = onPreview ? await onPreview(preview) : true;

	if (!shouldApply) {
		return { applied: false, preview, patch };
	}

	if (onApply) {
		await onApply(patch);
	}

	return { applied: true, preview, patch };
};

export const translateEditPrompt = ({ prompt, blockSchema }) => {
	const normalizedPrompt = normalizePrompt(prompt);
	const abilities = getBlockAbilities(blockSchema);
	const intents = parsePromptIntents(normalizedPrompt);

	const patch = {
		blockName: blockSchema?.name || 'core/unknown',
		attrs: {},
		styleCardTokens: {},
		intents: intents.map(intentConfig => intentConfig.intent),
	};

	intents.forEach(intentConfig => {
		const ability = resolveAbility(abilities, intentConfig.intent);
		const valueType = ability?.valueType || intentConfig.valueType;
		const value = normalizeIntentValue(
			normalizedPrompt,
			intentConfig.intent,
			valueType
		);
		const paletteIndex =
			valueType === 'color' ? parsePaletteIndex(normalizedPrompt) : null;

		if (value === null && paletteIndex === null) {
			return;
		}

		const resolvedValue = paletteIndex ?? value;
		mapIntentToPatch({
			intent: intentConfig.intent,
			value: resolvedValue,
			ability,
			blockSchema,
			patch,
		});
	});

	return {
		patch,
		preview: createPatchPreview(patch),
	};
};

export default translateEditPrompt;
