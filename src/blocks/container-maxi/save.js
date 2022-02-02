/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { ArrowDisplayer, ShapeDivider } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock from '../../components/maxi-block';
import { getMaxiBlockAttributes } from '../../extensions/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { fullWidth } = attributes;

	const name = 'maxi-blocks/container-maxi';

	const classes = classnames(fullWidth === 'full' ? 'alignfull' : null);

	return (
		<MaxiBlock
			tagName='section'
			classes={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
			isSave
		>
			<ArrowDisplayer
				{...getGroupAttributes(
					attributes,
					['blockBackground', 'arrow', 'border'],
					true
				)}
			/>
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
