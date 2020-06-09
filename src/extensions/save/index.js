/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks;

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/section-maxi',
];

/**
 * Add hyperlink element on Maxi Blocks with toolbar link activated
 *
 * @param {object} BlockSave Original saved object.
 * @return {string} Wrapped component.
 */

const withSave = (element, blockType, attributes) => {
	if (
		allowedBlocks.includes(blockType.name) &&
		!!attributes.linkSettings &&
		!!JSON.parse(attributes.linkSettings).url
	){
		const linkSettings = JSON.parse(attributes.linkSettings);

		return (
			<a
				className="maxi-link-wrapper"
				href={linkSettings.url}
				target={!!linkSettings.opensInNewTab ? '_blank' : '_self'}
			>
				{element}
			</a>
		)
	}

	return element;
}

addFilter(
	'blocks.getSaveElement',
	'maxi-blocks/save',
	withSave
);