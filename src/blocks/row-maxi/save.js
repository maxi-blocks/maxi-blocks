/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

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
	const { attributes } = props;
	const { uniqueID, fullWidth, parentBlockStyle } = attributes;

	const classes = classnames(
		'maxi-row-block',
		fullWidth === 'full' ? 'alignfull' : null,
		getPaletteClasses(
			attributes,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
			],
			'maxi-blocks/row-maxi',
			parentBlockStyle
		)
	);

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			tagName='figure'
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			<InnerBlocks.Content />
		</MaxiBlock>
	);
};

export default save;
