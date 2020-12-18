/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import {
	ShapeDivider,
	BackgroundDisplayer,
	ArrowDisplayer,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Save
 */
const save = props => {
	const {
		attributes: {
			uniqueID,
			isFirstOnHierarchy,
			blockStyle,
			defaultBlockStyle,
			fullWidth,
			background,
			extraClassName,
			arrow,
		},
		className,
	} = props;
	const shapeDivider = { ...props.attributes.shapeDivider };

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
					<ArrowDisplayer arrow={arrow} />
					{!!shapeDivider.top.status && (
						<ShapeDivider shapeDividerOptions={shapeDivider} />
					)}
					<div className='maxi-container-block__wrapper'>
						<BackgroundDisplayer background={background} />
						<div className='maxi-container-block__container'>
							<InnerBlocks.Content />
						</div>
					</div>
					{!!shapeDivider.bottom.status && (
						<ShapeDivider
							position='bottom'
							shapeDividerOptions={shapeDivider}
						/>
					)}
				</section>
			)}
			{!isFirstOnHierarchy && (
				<div
					className={classes}
					data-gx_initial_block_class={defaultBlockStyle}
				>
					{!!shapeDivider.top.status && (
						<ShapeDivider shapeDividerOptions={shapeDivider} />
					)}
					<div className='maxi-container-block__wrapper'>
						<BackgroundDisplayer background={background} />
						<InnerBlocks.Content />
					</div>
					{!!shapeDivider.bottom.status && (
						<ShapeDivider
							position='bottom'
							shapeDividerOptions={shapeDivider}
						/>
					)}
				</div>
			)}
		</Fragment>
	);
};

export default save;
