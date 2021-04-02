/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;
import { Fragment  } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	ArrowDisplayer,
	BackgroundDisplayer,
	ShapeDivider,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes, className } = props;
	const {
		uniqueID,
		blockStyle,
		blockStyleBackground,
		defaultBlockStyle,
		fullWidth,
		extraClassName,
	} = attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-container-block',
		blockStyle,
		blockStyle !== 'maxi-custom' &&
			`maxi-background--${blockStyleBackground}`,
		extraClassName,
		className,
		uniqueID,
		fullWidth === 'full' ? 'alignfull' : null
	);

	return (
		<Fragment>
			<section
				className={classes}
				data-gx_initial_block_class={defaultBlockStyle}
				id={uniqueID}
			>
				<ArrowDisplayer {...getGroupAttributes(attributes, 'arrow')} />

				<BackgroundDisplayer
					{...getGroupAttributes(attributes, [
						'background',
						'backgroundColor',
						'backgroundImage',
						'backgroundVideo',
						'backgroundGradient',
						'backgroundSVG',
						'backgroundHover',
						'backgroundColorHover',
						'backgroundImageHover',
						'backgroundVideoHover',
						'backgroundGradientHover',
						'backgroundSVGHover',
					])}
					blockClassName={uniqueID}
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
			</section>
		</Fragment>
	);
};

export default save;
