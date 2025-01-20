/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	getMaxiBlockAttributes,
	MaxiBlock,
} from '@components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

// Constants
const NAME = 'List item';
const LIST_ITEM_BLOCK = 'maxi-blocks/list-item-maxi';
const TEXT_BLOCK = 'maxi-blocks/text-maxi';
const LI_REGEX = /<li>(.*?)<\/li>/g;
const LI_CLEAN_REGEX = /<\/?li>/g;
const BR_REGEX = /\n/g;

const isEligible = (blockAttributes, innerBlocks) => {
	const { content, isList } = blockAttributes;
	return isList && isEmpty(innerBlocks) && content?.includes('<li>');
};

const migrate = newAttributes => {
	const { content } = newAttributes;

	// Use match only once and store result
	const matches = content.match(LI_REGEX) || [];

	// Preallocate array size for better memory management
	const newInnerBlocks = new Array(matches.length);

	// Use traditional for loop for better performance
	for (let i = 0; i < matches.length; i++) {
		const liContent = matches[i].replace(LI_CLEAN_REGEX, '');
		newInnerBlocks[i] = createBlock(LIST_ITEM_BLOCK, { content: liContent });
	}

	return [newAttributes, newInnerBlocks];
};

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

	// Compute values once
	const value = dcStatus ? '$text-to-replace' : content?.replace(BR_REGEX, '<br />');
	const tagName = isList && !dcStatus ? typeOfList : textLevel;

	// Prepare props conditionally
	const extraProps = !dcStatus ? {
		reversed: !!listReversed,
		start: listStart,
	} : {};

	return (
		<MaxiBlock.save
			classes={classnames(isList && 'maxi-list-block')}
			{...getMaxiBlockAttributes({ ...props, name: TEXT_BLOCK })}
		>
			<RichText.Content
				className='maxi-text-block__content'
				value={value}
				tagName={tagName}
				{...extraProps}
			/>
		</MaxiBlock.save>
	);
};

export default { name: NAME, isEligible, migrate, save };
