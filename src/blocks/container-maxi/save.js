/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import {
	__experimentalShapeDivider,
	__experimentalBackgroundDisplayer,
	__experimentalArrowDisplayer,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isObject } from 'lodash';

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
			shapeDivider,
			arrow,
		},
		className,
	} = props;

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
					<__experimentalArrowDisplayer arrow={arrow} />
					{!!shapeDivider.top.status && (
						<__experimentalShapeDivider
							shapeDividerOptions={shapeDivider}
						/>
					)}
					<div className='maxi-container-block__wrapper'>
						<__experimentalBackgroundDisplayer
							background={background}
						/>
						<div className='maxi-container-block__container'>
							<InnerBlocks.Content />
						</div>
					</div>
					{!!shapeDivider.bottom.status && (
						<__experimentalShapeDivider
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
					<__experimentalBackgroundDisplayer
						background={background}
					/>
					{!!shapeDivider.top.status && (
						<__experimentalShapeDivider
							shapeDividerOptions={shapeDivider}
						/>
					)}
					<div className='maxi-container-block__wrapper'>
						<InnerBlocks.Content />
					</div>
					{!!shapeDivider.bottom.status && (
						<__experimentalShapeDivider
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
