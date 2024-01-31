const name = 'List BR';

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
];

const isEligible = blockAttributes => {
	const {
		isList,
		content,
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return (
		isList &&
		(maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin) &&
		content.match(/<li>.*<\/li><li>/g)
	);
};

const migrate = newAttributes => {
	const { content } = newAttributes;
	newAttributes.content = content.replace(/<\/li><li>/g, '</li><br><li>');
	return newAttributes;
};

export default { name, isEligible, migrate };
