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
	const { content } = props.attributes;

	const name = 'maxi-blocks/list-item-maxi';
	const className = 'maxi-list-item-block__content';
	const value = content?.replace(/\n/g, '<br />');

	return (
		<MaxiBlock.save
			tagName='li'
			{...getMaxiBlockAttributes({ ...props, name })}
		>
			<RichText.Content className={className} value={value} />
		</MaxiBlock.save>
	);
};

export default save;
