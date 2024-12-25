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

const name = 'List item';

const isEligible = (blockAttributes, innerBlocks) => {
	const { content, isList } = blockAttributes;
	return isList && isEmpty(innerBlocks) && content?.includes('<li>');
};

const migrate = newAttributes => {
	const { content } = newAttributes;
	const innerBlocksArray = content.match(/<li>(.*?)<\/li>/g) || [];
	const newInnerBlocks = innerBlocksArray.map(li => {
		const liContent = li.replace(/<\/?li>/g, '');
		return createBlock('maxi-blocks/list-item-maxi', {
			content: liContent,
		});
	});

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

	const name = 'maxi-blocks/text-maxi';
	const className = 'maxi-text-block__content';
	const value = content?.replace(/\n/g, '<br />');

	return (
		<MaxiBlock.save
			classes={classnames(isList && 'maxi-list-block')}
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

export default { name, isEligible, migrate, save };
