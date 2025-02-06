import { isNil } from 'lodash';

// Constants
const NAME = 'DC Class Name';
const VERSIONS = new Set([
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
]);

// Pre-define attribute template
const DC_HIDE_ATTRIBUTE = {
	type: 'boolean',
	default: false,
};

const attributes = () => ({
	'dc-hide': DC_HIDE_ATTRIBUTE,
});

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
		'dc-status': dcStatus,
		'dc-hide': dcHide,
	} = blockAttributes;

	return (
		(VERSIONS.has(maxiVersionCurrent) || !maxiVersionOrigin) &&
		dcStatus &&
		isNil(dcHide)
	);
};

const migrate = attributes => {
	attributes['dc-hide'] = false;
	return attributes;
};

export default { name: NAME, attributes, isEligible, migrate };
