/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getPaletteClasses } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const {
		uniqueID,
		defaultBlockStyle,
		textLevel,
		isList,
		typeOfList,
		content,
		parentBlockStyle,
	} = props.attributes;

	const classes = classnames(
		'maxi-text-block',
		getPaletteClasses(
			props.attributes,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
				'typography',
				'typography-hover',
			],
			'maxi-blocks/text-maxi',
			parentBlockStyle,
			textLevel
		)
	);

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			<RichText.Content
				className='maxi-text-block__content'
				value={content}
				tagName={isList ? typeOfList : textLevel}
				data-gx_initial_block_class={defaultBlockStyle}
			/>
		</MaxiBlock>
	);
};

export default save;
