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
		'dc-content': dcContent,
		'dc-status': dcStatus,
		'dc-type': dsType,
		'dc-author': dsAuthor,
		'dc-relation': dsRelation,
		'dc-id': dsId,
	} = props.attributes;

	const name = 'maxi-blocks/text-maxi';
	const className = 'maxi-text-block__content';
	const value = content?.replace(/\n/g, '<br />');

	console.log(dcContent);
	console.log(dcStatus);

	return (
		<MaxiBlock.save
			classes={`${isList ? 'maxi-list-block' : ''}`}
			{...getMaxiBlockAttributes({ ...props, name })}
		>
			<RichText.Content
				className={className}
				value={dcStatus ? dcContent : value}
				tagName={isList && !dcStatus ? typeOfList : textLevel}
				{...(dcStatus && {
					'data-dynamic-content': `${dsType} ${dsAuthor} ${dsRelation} ${dsId}`,
				})}
				{...(!dcStatus && {
					reversed: !!listReversed,
					start: listStart,
				})}
			/>
		</MaxiBlock.save>
	);
};

export default save;
