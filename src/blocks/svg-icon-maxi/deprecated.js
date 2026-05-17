/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { WithLink } from '@extensions/save/utils';
import { getGroupAttributes } from '@extensions/styles';
import { addAlt } from './save';

const save = props => {
	const { attributes } = props;
	const { linkSettings } = attributes;
	const dynamicContent = getGroupAttributes(attributes, 'dynamicContent');

	const name = 'maxi-blocks/svg-icon-maxi';
	const icon = (
		<RawHTML className='maxi-svg-icon-block__icon'>
			{addAlt(
				attributes.content,
				attributes.altTitle,
				attributes.altDescription,
				attributes.uniqueID
			)}
		</RawHTML>
	);
	// Before linkElement existed, SVG icon links were saved around the canvas.
	const shouldWrapLegacyCanvas = linkSettings?.linkElement === undefined;
	const shouldWrapIcon =
		linkSettings?.linkElement !== 'canvas' && !shouldWrapLegacyCanvas;

	const block = (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={attributes.ariaLabels?.canvas}
		>
			{shouldWrapIcon ? (
				<WithLink
					linkSettings={linkSettings ?? {}}
					dynamicContent={dynamicContent}
				>
					{icon}
				</WithLink>
			) : (
				icon
			)}
		</MaxiBlock.save>
	);

	if (shouldWrapLegacyCanvas) {
		return (
			<WithLink
				linkSettings={linkSettings ?? {}}
				dynamicContent={dynamicContent}
			>
				{block}
			</WithLink>
		);
	}

	return block;
};

const deprecated = attributes => [
	{
		attributes,
		save,
	},
];

export default deprecated;
