/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../../../advanced-number-control';
import ToggleSwitch from '../../../toggle-switch';
import ToolbarPopover from '../toolbar-popover';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getAttributesValue,
} from '../../../../extensions/attributes';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';

/**
 * General
 */
const EXCLUDED_BLOCKS = [
	'maxi-blocks/column-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/number-counter-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/video-maxi',
];

const BLOCKS_MAX_WIDTH = [
	'maxi-blocks/divider-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/map-maxi',
	'maxi-blocks/slider-maxi',
];

/**
 * Size
 */
const Size = props => {
	const { blockName, breakpoint, isFirstOnHierarchy, onChange } = props;

	if (EXCLUDED_BLOCKS.includes(blockName)) return null;

	const fullWidth = getAttributesValue({
		target: '_fw',
		props,
		breakpoint,
	});

	return (
		<ToolbarPopover
			className='toolbar-item__size'
			tooltip={__('Size', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='height width'
		>
			<div className='toolbar-item__size__popover'>
				{(isFirstOnHierarchy ||
					blockName === 'maxi-blocks/row-maxi') && (
					<div>
						<ToggleSwitch
							label={__('Enable full width', 'maxi-blocks')}
							selected={fullWidth === 'full'}
							onChange={val => {
								const full = val ? 'full' : 'normal';
								onChange({
									[`_fw-${breakpoint}`]: full,
								});
							}}
						/>
					</div>
				)}
				{fullWidth === 'normal' && (
					<>
						<AdvancedNumberControl
							label={__('Width', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute({
								target: '_w.u',
								breakpoint,
								attributes: props,
							})}
							onChangeUnit={val =>
								onChange({
									[`_w.u-${breakpoint}`]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: '_w',
								breakpoint,
								attributes: props,
							})}
							allowedUnits={['px', 'em', 'vw', '%']}
							onChangeValue={val =>
								onChange({
									[`_w-${breakpoint}`]: val,
								})
							}
							onReset={() =>
								onChange({
									[`_w-${breakpoint}`]: getDefaultAttribute(
										`_w-${breakpoint}`
									),
									[`_w.u-${breakpoint}`]: getDefaultAttribute(
										`_w.u-${breakpoint}`
									),
									isReset: true,
								})
							}
						/>
						{BLOCKS_MAX_WIDTH.includes(blockName) &&
							getAttributesValue({
								target: '_sao',
								props,
							}) && (
								<AdvancedNumberControl
									label={__('Max width', 'maxi-blocks')}
									enableUnit
									unit={getLastBreakpointAttribute({
										target: '_mw.u',
										breakpoint,
										attributes: props,
									})}
									onChangeUnit={val =>
										onChange({
											[`_mw.u-${breakpoint}`]: val,
										})
									}
									onReset={() =>
										onChange({
											[`_mw-${breakpoint}`]:
												getDefaultAttribute(
													`_mw-${breakpoint}`
												),
											[`_mw.u-${breakpoint}`]:
												getDefaultAttribute(
													`_mw.u-${breakpoint}`
												),
											isReset: true,
										})
									}
									value={getLastBreakpointAttribute({
										target: '_mw',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val =>
										onChange({
											[`_mw-${breakpoint}`]: val,
										})
									}
								/>
							)}
					</>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default Size;
