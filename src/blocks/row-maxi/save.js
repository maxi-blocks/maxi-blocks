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
	const { fullWidth, parentBlockStyle } = attributes;

	const name = 'maxi-blocks/row-maxi';

	const classes = classnames(fullWidth === 'full' ? 'alignfull' : null);

	const paletteClasses = getPaletteClasses(attributes, parentBlockStyle);

	return (
		<MaxiBlock
			className={classes}
			paletteClasses={paletteClasses}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			<InnerBlocks.Content />
		</MaxiBlock>
	);
};

export default save;
