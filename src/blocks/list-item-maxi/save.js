/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * Save
 */
const save = props => {
	const {
		content,
		listReversed,
		listStart,
		'dc-status': dcStatus,
		ariaLabels = {},
	} = props.attributes;

	const name = 'maxi-blocks/list-item-maxi';
	const className = 'maxi-list-item-block__content';

	return (
		<MaxiBlock.save
			tagName='li'
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={ariaLabels['list item wrapper']}
		>
			<RichText.Content
				className={className}
				value={content}
				tagName='div'
				aria-label={ariaLabels['list item']}
				{...(!dcStatus && {
					reversed: !!listReversed,
					start: listStart,
				})}
			/>
		</MaxiBlock.save>
	);
};

export default save;
