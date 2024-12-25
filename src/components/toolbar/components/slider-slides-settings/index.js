/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */

import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import Button from '@components/button';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSlideSettings, toolbarRemove } from '@maxi-icons';

/**
 * Slider settings
 */
const SliderSlidesSettings = () => {
	const { removeBlock, duplicateBlocks } = useDispatch('core/block-editor');

	const { innerBlocks, innerBlockCount } = useSelect(select => {
		const sliderId = wp.data
			.select('core/block-editor')
			.getSelectedBlockClientId();

		const innerBlocks = select('core/block-editor').getBlocks(sliderId);
		const innerBlockCount = innerBlocks?.length || 0;

		return { innerBlocks, innerBlockCount };
	});

	const getInnerBlocksIds = () => {
		const array = Object.values(innerBlocks);

		array.forEach((element, key) => {
			array[key] = element?.clientId;
		});

		return array;
	};

	const slideIds = getInnerBlocksIds();

	return (
		<ToolbarPopover
			className='toolbar-item__slide'
			tooltip={__('Add/Remove slides', 'maxi-blocks')}
			icon={toolbarSlideSettings}
		>
			<div className='toolbar-item__slide__popover'>
				{Array.from(Array(innerBlockCount).keys()).map(i => {
					return (
						<div
							className={classnames(
								'maxi-slider-toolbar__slide',
								`maxi-slider-toolbar__slide--${i}`,
								i === 0 && ' maxi-slider-toolbar__slide--active'
							)}
							key={`maxi-slider-toolbar__slide--${i}`}
						>
							<span>{i + 1}</span>
							<Button
								className={classnames(
									`maxi-slider-toolbar__slide--${i}`,
									'maxi-slider-toolbar__slide-remove'
								)}
								showTooltip='false'
								onClick={() => {
									const id = slideIds[i];
									removeBlock(id);
								}}
								icon={toolbarRemove}
							/>
						</div>
					);
				})}
				<Button
					className={classnames(
						'maxi-slider-toolbar__slide',
						'maxi-slider-toolbar__slide--add'
					)}
					showTooltip='false'
					onClick={() => {
						const id = slideIds[slideIds.length - 1];
						duplicateBlocks([id], false);
					}}
				>
					<span>+</span>
				</Button>
			</div>
		</ToolbarPopover>
	);
};

export default SliderSlidesSettings;
