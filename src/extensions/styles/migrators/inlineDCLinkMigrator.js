// Constants
const NAME = 'DC Inline Links';
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
	'1.5.6',
	'1.5.7',
	'1.5.8',
	'1.6.0',
	'1.6.1',
	'1.7.0',
	'1.7.1',
	'1.7.2',
	'1.7.3',
]);

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
		'dc-post-taxonomy-links-status': dcPostTaxonomyLinksStatus,
	} = blockAttributes;

	// Early return if no taxonomy links status
	if (!dcPostTaxonomyLinksStatus) return false;

	return VERSIONS.has(maxiVersionCurrent) || !maxiVersionOrigin;
};

const migrate = attributes => {
	// Direct property mutations for better performance
	attributes['dc-link-target'] = attributes['dc-field'];
	attributes['dc-link-status'] = true;
	delete attributes['dc-post-taxonomy-links-status'];

	return attributes;
};

export default { name: NAME, isEligible, migrate };
