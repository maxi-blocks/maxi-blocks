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

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={attributes.ariaLabels?.canvas}
		>
			{linkSettings?.linkElement === 'canvas' ? (
				icon
			) : (
				<WithLink
					linkSettings={linkSettings ?? {}}
					dynamicContent={dynamicContent}
				>
					{icon}
				</WithLink>
			)}
		</MaxiBlock.save>
	);
};

const deprecated = attributes => [
	{
		attributes,
		save,
	},
];

export default deprecated;
