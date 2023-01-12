const name = 'Text link';

const isEligible = blockAttributes => {
	const { content, 'is-whole-link-general': isWholeLinkAttr } =
		blockAttributes;

	const isWholeLink =
		content?.split('</a>').length === 2 &&
		content?.startsWith('<a') &&
		content?.indexOf('</a>') === content.length - 4;

	return isWholeLink && !isWholeLinkAttr;
};

const migrate = newAttributes => ({
	...newAttributes,
	'is-whole-link-general': true,
});

export default {
	name,
	isEligible,
	migrate,
};
