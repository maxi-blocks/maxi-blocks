/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { ArrowDisplayer } from '../../components';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import BackgroundDisplayer from '../../components/background-displayer/newBackgroundDisplayer';
import ShapeDivider from '../../components/shape-divider/newShapeDivider';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { attributes, className } = props;
	const {
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		defaultBlockStyle,
		fullWidth,
		extraClassName,
	} = attributes;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-container-block',
		blockStyle,
		extraClassName,
		className,
		fullWidth === 'full' ? 'alignfull' : null,
		!isNil(uniqueID) ? uniqueID : null
	);

	return (
		<Fragment>
			{isFirstOnHierarchy && (
				<section
					className={classes}
					data-gx_initial_block_class={defaultBlockStyle}
					data-motion-id={uniqueID}
				>
					<ArrowDisplayer
						{...getGroupAttributes(attributes, 'arrow')}
					/>
					{attributes['shape-divider-top-status'] && (
						<ShapeDivider
							{...getGroupAttributes(attributes, 'shapeDivider')}
							location='top'
						/>
					)}
					<div className='maxi-container-block__wrapper'>
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
						<div className='maxi-container-block__container'>
							<InnerBlocks.Content />
						</div>
					</div>
					{attributes['shape-divider-bottom-status'] && (
						<ShapeDivider
							{...getGroupAttributes(attributes, 'shapeDivider')}
							location='bottom'
						/>
					)}
				</section>
			)}
			{!isFirstOnHierarchy && (
				<div
					className={classes}
					data-gx_initial_block_class={defaultBlockStyle}
				>
					{attributes['shape-divider-top-status'] && (
						<ShapeDivider
							{...getGroupAttributes(attributes, 'shapeDivider')}
							location='top'
						/>
					)}
					<div className='maxi-container-block__wrapper'>
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
						<InnerBlocks.Content />
					</div>
					{attributes['shape-divider-bottom-status'] && (
						<ShapeDivider
							{...getGroupAttributes(attributes, 'shapeDivider')}
							location='bottom'
						/>
					)}
				</div>
			)}
		</Fragment>
	);
};

export default save;
