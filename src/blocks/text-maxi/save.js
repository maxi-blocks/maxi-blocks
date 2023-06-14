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
	const value = content?.replace(/\n/g, '<br />');

	return (
		<MaxiBlock.save
			classes={`${isList ? 'maxi-list-block' : ''}`}
			{...getMaxiBlockAttributes({ ...props, name })}
		>
			<RichText.Content
				style={dcStatus && { display: 'none' }}
				className={className}
				value={dcStatus ? '$text-to-replace' : value}
				// TODO: avoid DC for lists
				tagName={isList && !dcStatus ? typeOfList : textLevel}
				{...(!dcStatus && {
					reversed: !!listReversed,
					start: listStart,
				})}
			/>
		</MaxiBlock.save>
	);
};

export default save;
