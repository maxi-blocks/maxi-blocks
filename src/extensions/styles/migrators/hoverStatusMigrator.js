// Pre-compute prefixes array to avoid recreation
const PREFIXES = Object.freeze([
	'block',
	'button',
	'content',
	'header',
	'input',
	'overlay',
	'svg',
	'video',
]);

// Constants
const NAME = 'Hover status';
const HOVER_STATUS = 'hover-status';
const STATUS_HOVER = 'status-hover';

// Pre-compute attribute template for better performance
const attributeTemplate = { type: 'boolean' };

const attributes = () => {
	const result = {};

	// Use for loop instead of reduce for better performance
	for (let i = 0; i < PREFIXES.length; i++) {
		result[`${PREFIXES[i]}-background-${HOVER_STATUS}`] = attributeTemplate;
	}

	return result;
};

const isEligible = blockAttributes => {
	// Use for...of for better performance with break capability
	for (const key of Object.keys(blockAttributes)) {
		if (key.includes(HOVER_STATUS)) return true;
	}
	return false;
};

const migrate = newAttributes => {
	// Use for...of instead of forEach for better performance
	for (const [key, value] of Object.entries(newAttributes)) {
		if (key.includes(HOVER_STATUS)) {
			const newKey = key.replace(HOVER_STATUS, STATUS_HOVER);
			newAttributes[newKey] = value;
			delete newAttributes[key];
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, attributes, migrate };
