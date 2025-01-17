// Constants
const NAME = 'SVG marker size';

// Pre-compile version set for O(1) lookup
const VERSIONS = new Set([
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
	'0.0.1-SC5',
	'0.0.1-SC6',
	'1.0.0-RC1',
	'1.0.0-RC2',
	'1.0.0-beta',
	'1.0.0-beta-2',
	'wp-directory-beta-1',
	'1.0.0',
	'1.0.1',
	'1.1.0',
	'1.1.1',
	'1.2.0',
	'1.2.1',
]);

// Pre-compile regex patterns for better performance
const SIZE_PATTERN = /(height|width)=('|").*?('|")/g;
const WHITESPACE_PATTERN = /\s+/g;

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
		listStyleCustom,
	} = blockAttributes;

	// Early returns for quick fails
	if (!listStyleCustom) return false;
	if (!listStyleCustom.includes('</svg>')) return false;

	return VERSIONS.has(maxiVersionCurrent) || !maxiVersionOrigin;
};

const migrate = newAttributes => {
	const { listStyleCustom } = newAttributes;

	// Direct string replacement for better performance
	newAttributes.listStyleCustom = listStyleCustom
		.replace(SIZE_PATTERN, '')
		.replace(WHITESPACE_PATTERN, ' ');

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
