/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
			classes={classnames(
				isList && 'maxi-list-block',
				dcStatus && 'maxi-text-block__dc'
			)}
			{...getMaxiBlockAttributes({ ...props, name })}
		>
			<RichText.Content
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
