const name = 'DC Inline Links';

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
	'1.7.1',
	'1.7.2',
	'1.7.3',
];

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return (
		(maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin) &&
		blockAttributes['dc-post-taxonomy-links-status']
	);
};

const migrate = attributes => {
	const newAttributes = { ...attributes };

	// Instead of saving saving the inline link status, save selected field as link target and enable the link
	delete newAttributes['dc-post-taxonomy-links-status'];
	newAttributes['dc-link-target'] = newAttributes['dc-field'];
	newAttributes['dc-link-status'] = true;

	return newAttributes;
};

export default { migrate, isEligible, name };
