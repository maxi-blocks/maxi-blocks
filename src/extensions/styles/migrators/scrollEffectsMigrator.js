/**
 * Internal dependencies
 */
import { scrollTypes } from '@extensions/styles/defaults/scroll';

const name = 'Scroll effects zones';

const maxiVersions = [
	'0.1',
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
	'1.3',
	'1.3.1',
	'1.4.1',
	'1.4.2',
	'1.5.0',
	'1.5.1',
	'1.5.2',
	'1.5.3',
	'1.5.4',
	'1.5.5',
	'1.5.6',
	'1.5.7',
	'1.5.8',
	'1.6.0',
	'1.6.1',
	'1.7.0',
];

const attributes = () => ({
	'scroll-vertical-offset-start-general': {
		type: 'number',
		default: -400,
	},
	'scroll-vertical-offset-mid-general': {
		type: 'number',
		default: 0,
	},
	'scroll-vertical-offset-end-general': {
		type: 'number',
		default: 400,
	},
	'scroll-horizontal-offset-start-general': {
		type: 'number',
		default: -200,
	},
	'scroll-horizontal-offset-mid-general': {
		type: 'number',
		default: 0,
	},
	'scroll-horizontal-offset-end-general': {
		type: 'number',
		default: 200,
	},
	'scroll-rotate-rotate-start-general': {
		type: 'number',
		default: 90,
	},
	'scroll-rotate-rotate-mid-general': {
		type: 'number',
		default: 0,
	},
	'scroll-rotate-rotate-end-general': {
		type: 'number',
		default: 0,
	},
	'scroll-scale-scale-start-general': {
		type: 'number',
		default: 70,
	},
	'scroll-scale-scale-mid-general': {
		type: 'number',
		default: 100,
	},
	'scroll-scale-scale-end-general': {
		type: 'number',
		default: 100,
	},
	'scroll-fade-opacity-start-general': {
		type: 'number',
		default: 0,
	},
	'scroll-fade-opacity-mid-general': {
		type: 'number',
		default: 100,
	},
	'scroll-fade-opacity-end-general': {
		type: 'number',
		default: 100,
	},
	'scroll-blur-blur-start-general': {
		type: 'number',
		default: 10,
	},
	'scroll-blur-blur-mid-general': {
		type: 'number',
		default: 0,
	},
	'scroll-blur-blur-end-general': {
		type: 'number',
		default: 0,
	},
});

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return (
		(maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin) &&
		scrollTypes.some(
			type => blockAttributes[`scroll-${type}-status-general`]
		)
	);
};

const migrate = attributes => {
	const createZone = prefix => {
		const startAttr = `${prefix}start-general`;
		const midAttr = `${prefix}mid-general`;
		const endAttr = `${prefix}end-general`;
		return {
			0: attributes[startAttr],
			...(attributes[midAttr] !== attributes[endAttr]
				? {
						50: attributes[midAttr],
						100: attributes[endAttr],
				  }
				: {
						50: attributes[midAttr],
				  }),
		};
	};

	attributes['scroll-vertical-zones-general'] = createZone(
		'scroll-vertical-offset-'
	);
	attributes['scroll-horizontal-zones-general'] = createZone(
		'scroll-horizontal-offset-'
	);
	attributes['scroll-rotate-zones-general'] = createZone(
		'scroll-rotate-rotate-'
	);
	attributes['scroll-scale-zones-general'] = createZone(
		'scroll-scale-scale-'
	);
	attributes['scroll-fade-zones-general'] = createZone(
		'scroll-fade-opacity-'
	);
	attributes['scroll-blur-zones-general'] = createZone('scroll-blur-blur-');

	attributes['scroll-vertical-is-block-zone-general'] = true;
	attributes['scroll-horizontal-is-block-zone-general'] = true;
	attributes['scroll-rotate-is-block-zone-general'] = true;
	attributes['scroll-scale-is-block-zone-general'] = true;
	attributes['scroll-fade-is-block-zone-general'] = true;
	attributes['scroll-blur-is-block-zone-general'] = true;

	const attributesToDelete = [
		'scroll-vertical-offset-start-general',
		'scroll-vertical-offset-mid-general',
		'scroll-vertical-offset-end-general',
		'scroll-horizontal-offset-start-general',
		'scroll-horizontal-offset-mid-general',
		'scroll-horizontal-offset-end-general',
		'scroll-rotate-rotate-start-general',
		'scroll-rotate-rotate-mid-general',
		'scroll-rotate-rotate-end-general',
		'scroll-scale-scale-start-general',
		'scroll-scale-scale-mid-general',
		'scroll-scale-scale-end-general',
		'scroll-fade-opacity-start-general',
		'scroll-fade-opacity-mid-general',
		'scroll-fade-opacity-end-general',
		'scroll-blur-blur-start-general',
		'scroll-blur-blur-mid-general',
		'scroll-blur-blur-end-general',
	];

	for (const attr of attributesToDelete) {
		delete attributes[attr];
	}

	return attributes;
};

export default { attributes, migrate, isEligible, name };
