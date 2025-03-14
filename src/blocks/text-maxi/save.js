/**
 * WordPress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

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
		'dc-field': dcField,
		ariaLabels = {},
		'dc-sub-field': dcSubField,
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
			aria-label={ariaLabels['text wrapper']}
		>
			{!isList && (
				<RichText.Content
					className={className}
					value={
						dcStatus &&
						dcField !== 'static_text' &&
						dcSubField !== 'static_text'
							? '$text-to-replace'
							: value
					}
					// TODO: avoid DC for lists
					tagName={
						isList &&
						(!dcStatus ||
							dcField === 'static_text' ||
							dcSubField === 'static_text')
							? typeOfList
							: textLevel
					}
					aria-label={ariaLabels.text}
					{...((!dcStatus ||
						dcField === 'static_text' ||
						dcSubField === 'static_text') && {
						reversed: !!listReversed,
						start: listStart,
					})}
				/>
			)}
			{isList && (
				<ListTagName
					{...useInnerBlocksProps.save({
						className,
						'aria-label': ariaLabels.list,
						reversed: !!listReversed,
						start: listStart,
					})}
				/>
			)}
		</MaxiBlock.save>
	);
};

export default save;
