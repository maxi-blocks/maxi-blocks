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
const save = (props, extendedAttributes = {}) => {
	const { textLevel, isList, typeOfList, content, listReversed, listStart } =
		props.attributes;

	const name = 'maxi-blocks/text-maxi';

	const value = content?.replace(/\n/g, '<br />');

	return (
		<MaxiBlock.save
			classes={`${isList ? 'maxi-list-block' : ''}`}
			{...getMaxiBlockAttributes({ ...props, name })}
			{...extendedAttributes}
		>
			<RichText.Content
				className='maxi-text-block__content'
				value={value}
				tagName={isList ? typeOfList : textLevel}
				reversed={!!listReversed}
				start={listStart}
			/>
		</MaxiBlock.save>
	);
};

export default save;
