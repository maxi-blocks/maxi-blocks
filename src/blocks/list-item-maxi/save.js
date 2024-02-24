/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const {
		content,
		listReversed,
		listStart,
		'dc-status': dcStatus,
	} = props.attributes;

	const name = 'maxi-blocks/list-item-maxi';
	const className = 'maxi-list-item-block__content';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
		>
			<RichText.Content
				className={className}
				value={content}
				tagName='li'
				{...(!dcStatus && {
					reversed: !!listReversed,
					start: listStart,
				})}
			/>
		</MaxiBlock.save>
	);
};

export default save;
