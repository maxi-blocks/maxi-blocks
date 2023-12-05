import { isNil } from 'lodash';

const name = 'DC Class Name';

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
];

const attributes = () => ({
	'dc-hide': {
		type: 'boolean',
		default: false,
	},
});

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return (
		maxiVersions.includes(maxiVersionCurrent) ||
		(!maxiVersionOrigin &&
			blockAttributes['dc-status'] &&
			isNil(blockAttributes['dc-hide']))
	);
};

export default { name, attributes, isEligible };
