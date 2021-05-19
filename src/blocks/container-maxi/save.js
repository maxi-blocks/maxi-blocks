/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { ArrowDisplayer, ShapeDivider } from '../../components';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

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

	const name = 'maxi-blocks/container-maxi';

	const classes = classnames(fullWidth === 'full' ? 'alignfull' : null);

	const paletteClasses = getPaletteClasses(
		attributes,
		[
			'background',
			'background-hover',
			'border',
			'border-hover',
			'box-shadow',
			'box-shadow-hover',
		],
		name,
		parentBlockStyle
	);

	return (
		<MaxiBlock
			tagName='section'
			classes={classes}
			paletteClasses={paletteClasses}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			<ArrowDisplayer {...getGroupAttributes(attributes, 'arrow')} />
			{attributes['shape-divider-top-status'] && (
				<ShapeDivider
					{...getGroupAttributes(attributes, 'shapeDivider')}
					location='top'
				/>
			)}
			<div className='maxi-container-block__container'>
				<InnerBlocks.Content />
			</div>
			{attributes['shape-divider-bottom-status'] && (
				<ShapeDivider
					{...getGroupAttributes(attributes, 'shapeDivider')}
					location='bottom'
				/>
			)}
		</MaxiBlock>
	);
};

export default save;
