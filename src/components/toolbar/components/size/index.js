/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ToggleSwitch from '@components/toggle-switch';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '@extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '@maxi-icons';

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
	'maxi-blocks/list-item-maxi',
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

	const useBreakpoint =
		breakpoint === 'general'
			? select('maxiBlocks').receiveBaseBreakpoint()
			: breakpoint;
	const showAdvancedOptions =
		breakpoint === 'general'
			? props[`full-width-${useBreakpoint}`] === undefined
				? !props['full-width-general']
				: !props[`full-width-${useBreakpoint}`]
			: !props[`full-width-${useBreakpoint}`];

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
								breakpoint === 'general'
									? props[`full-width-${useBreakpoint}`] ===
									  undefined
										? props['full-width-general']
										: props[`full-width-${useBreakpoint}`]
									: props[`full-width-${useBreakpoint}`]
							}
							onChange={val => {
								onChange({
									[`full-width-${useBreakpoint}`]: val,
								});
							}}
						/>
					</div>
				)}
				{showAdvancedOptions && (
					<>
						<AdvancedNumberControl
							label={__('Width', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute({
								target: 'width-unit',
								breakpoint: useBreakpoint,
								attributes: props,
							})}
							onChangeUnit={val =>
								onChange({
									[`width-unit-${useBreakpoint}`]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: 'width',
								breakpoint: useBreakpoint,
								attributes: props,
							})}
							allowedUnits={['px', 'em', 'vw', '%']}
							onChangeValue={val =>
								onChange({
									[`width-${useBreakpoint}`]: val,
								})
							}
							onReset={() =>
								onChange({
									[`width-${useBreakpoint}`]:
										getDefaultAttribute('width-general'),
									[`width-unit-${useBreakpoint}`]:
										getDefaultAttribute(
											'width-unit-general'
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
										breakpoint: useBreakpoint,
										attributes: props,
									})}
									onChangeUnit={val =>
										onChange({
											[`max-width-unit-${useBreakpoint}`]:
												val,
										})
									}
									onReset={() =>
										onChange({
											[`max-width-${useBreakpoint}`]:
												getDefaultAttribute(
													'max-width-general'
												),
											[`max-width-unit-${useBreakpoint}`]:
												getDefaultAttribute(
													'max-width-unit-general'
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
											[`max-width-${useBreakpoint}`]: val,
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
