/**
 * WordPress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';

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

	const ListTagName = typeOfList;

	return (
		<MaxiBlock.save
			classes={classnames(
				// https://github.com/yeahcan/maxi-blocks/issues/3555 sometimes causes validation error,
				// remove next line once it is fixed.
				'wp-block-maxi-blocks-text-maxi',
				isList && 'maxi-list-block'
			)}
			{...getMaxiBlockAttributes({ ...props, name })}
		>
			{!isList && (
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
			)}
			{isList && (
				<ListTagName
					{...useInnerBlocksProps.save({
						className,
						reversed: !!listReversed,
						start: listStart,
					})}
				/>
			)}
		</MaxiBlock.save>
	);
};

export default save;
