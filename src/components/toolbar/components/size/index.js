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
} from '../../../../extensions/styles';

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
							selected={
								props[`full-width-${breakpoint}`] === 'full'
							}
							onChange={val => {
								const full = val ? 'full' : 'normal';
								onChange({
									[`full-width-${breakpoint}`]: full,
								});
							}}
						/>
					</div>
				)}
				{props[`full-width-${breakpoint}`] === 'normal' && (
					<>
						<AdvancedNumberControl
							label={__('Width', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute({
								target: 'width-unit',
								breakpoint,
								attributes: props,
							})}
							onChangeUnit={val =>
								onChange({
									[`width-unit-${breakpoint}`]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: 'width',
								breakpoint,
								attributes: props,
							})}
							allowedUnits={['px', 'em', 'vw', '%']}
							onChangeValue={val =>
								onChange({
									[`width-${breakpoint}`]: val,
								})
							}
							onReset={() =>
								onChange({
									[`width-${breakpoint}`]:
										getDefaultAttribute(
											`width-${breakpoint}`
										),
									[`width-unit-${breakpoint}`]:
										getDefaultAttribute(
											`width-unit-${breakpoint}`
										),
									isReset: true,
								})
							}
						/>
						{BLOCKS_MAX_WIDTH.includes(blockName) &&
							props['size-advanced-options'] && (
								<AdvancedNumberControl
									label={__('Max width', 'maxi-blocks')}
									enableUnit
									unit={getLastBreakpointAttribute({
										target: 'max-width-unit',
										breakpoint,
										attributes: props,
									})}
									onChangeUnit={val =>
										onChange({
											[`max-width-unit-${breakpoint}`]:
												val,
										})
									}
									onReset={() =>
										onChange({
											[`max-width-${breakpoint}`]:
												getDefaultAttribute(
													`max-width-${breakpoint}`
												),
											[`max-width-unit-${breakpoint}`]:
												getDefaultAttribute(
													`max-width-unit-${breakpoint}`
												),
											isReset: true,
										})
									}
									value={getLastBreakpointAttribute({
										target: 'max-width',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val =>
										onChange({
											[`max-width-${breakpoint}`]: val,
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
