/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	ArrowDisplayer,
	BackgroundDisplayer,
	ShapeDivider,
} from '../../components';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes, className, clientId } = props;
	const {
		uniqueID,
		blockStyle,
		defaultBlockStyle,
		fullWidth,
		extraClassName,
	} = attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-container-block',
		blockStyle,
		getPaletteClasses(
			attributes,
			blockStyle,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
			],
			'',
			clientId
		),
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
