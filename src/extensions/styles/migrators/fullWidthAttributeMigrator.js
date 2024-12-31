import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const name = 'full-width Attribute Migrator';

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
];

const prefixes = ['', 'button-', 'image-', 'video-'];

const attributes = () => ({
	...breakpointAttributesCreator({
		obj: {
			'full-width': {
				type: 'string',
				default: 'normal',
			},
		},
	}),
	...prefixes.reduce((acc, prefix) => {
		return {
			...acc,
			...breakpointAttributesCreator({
				obj: {
					[`${prefix}full-width`]: {
						type: 'string',
						default: 'normal',
					},
				},
			}),
		};
	}, {}),
});

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return (
		(versions.includes(maxiVersionCurrent) || !maxiVersionOrigin) &&
		Object.entries(blockAttributes).some(([key, value]) => {
			return key.includes('full-width') && typeof value === 'string';
		})
	);
};
const migrate = newAttributes => {
	Object.entries(newAttributes).forEach(([key, value]) => {
		if (key.includes('full-width') && typeof value === 'string')
			newAttributes[key] = value === 'full';
	});

	return newAttributes;
};

export default { name, isEligible, migrate, attributes };
