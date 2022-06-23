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
	const {
		textLevel,
		isList,
		typeOfList,
		content,
		listReversed,
		listStart,
		'dc-status': dcStatus,
	} = props.attributes;

	const name = 'maxi-blocks/text-maxi';
	const className = 'maxi-text-block__content';

	const DCTagName = textLevel;

	const value = content?.replace(/\n/g, '<br />');

	return (
		<MaxiBlock.save
			classes={`${isList ? 'maxi-list-block' : ''}`}
			{...getMaxiBlockAttributes({ ...props, name })}
			{...extendedAttributes}
		>
			{!dcStatus && (
				<RichText.Content
					className={className}
					value={value}
					tagName={isList ? typeOfList : textLevel}
					reversed={!!listReversed}
					start={listStart}
				/>
			)}
			{dcStatus && (
				<DCTagName className={className}>$text-to-replace</DCTagName>
			)}
		</MaxiBlock.save>
	);
};

export default save;
