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

	const shapeDividerValue = !isObject(shapeDivider)
		? JSON.parse(shapeDivider)
		: shapeDivider;

	return (
		<Fragment>
			{isFirstOnHierarchy && (
				<section
					className={classes}
					data-gx_initial_block_class={defaultBlockStyle}
					data-motion-id={uniqueID}
				>
					<__experimentalBackgroundDisplayer
						background={background}
					/>
					<__experimentalArrowDisplayer arrow={arrow} />
					{!!shapeDividerValue.top.status && (
						<__experimentalShapeDivider
							shapeDividerOptions={shapeDivider}
						/>
					)}
					<div className='maxi-container-block__wrapper'>
						<div className='maxi-container-block__container'>
							<InnerBlocks.Content />
						</div>
					</div>
					{!!shapeDividerValue.bottom.status && (
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
					{!!shapeDividerValue.top.status && (
						<__experimentalShapeDivider
							shapeDividerOptions={shapeDivider}
						/>
					)}
					<div className='maxi-container-block__wrapper'>
						<InnerBlocks.Content />
					</div>
					{!!shapeDividerValue.bottom.status && (
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
