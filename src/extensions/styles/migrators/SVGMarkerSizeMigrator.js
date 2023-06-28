const name = 'SVG marker size';

const versions = [
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
];

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
		listStyleCustom,
	} = blockAttributes;

	return (
		(versions.includes(maxiVersionCurrent) || !maxiVersionOrigin) &&
		listStyleCustom &&
		listStyleCustom.includes('</svg>')
	);
};

const migrate = newAttributes => {
	const { listStyleCustom } = newAttributes;

	return {
		...newAttributes,
		listStyleCustom: listStyleCustom
			.replace(/(height|width)=('|").*?('|")/g, '')
			.replace(/\s+/g, ' '),
	};
};

export default { name, isEligible, migrate };
