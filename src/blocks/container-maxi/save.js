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
	const { uniqueID, fullWidth, parentBlockStyle } = attributes;

	const classes = classnames(
		'maxi-container-block',
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
			'maxi-blocks/container-maxi',
			parentBlockStyle
		)
	);

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			tagName='section'
			{...getMaxiBlockBlockAttributes(props)}
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
