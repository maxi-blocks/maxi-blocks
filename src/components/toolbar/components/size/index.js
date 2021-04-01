/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { RadioControl } = wp.components;
const { Fragment } = wp.element;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import SizeControl from '../../../size-control';
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
const EXCLUDED_BLOCKS = ['maxi-blocks/column-maxi', 'maxi-blocks/image-maxi'];
const EXCLUDED_BLOCKS_SIZE = [
	'maxi-blocks/group-maxi',
	'maxi-blocks/font-icon-maxi',
	'maxi-blocks/svg-icon-maxi',
];

/**
 * Size
 */
const Size = props => {
	const {
		blockName,
		fullWidth,
		onChange,
		isFirstOnHierarchy,
		breakpoint,
	} = props;

	if (EXCLUDED_BLOCKS.includes(blockName)) return null;
	if (!isFirstOnHierarchy && EXCLUDED_BLOCKS_SIZE.includes(blockName))
		return null;

	const currentBlockRoot = select('core/block-editor').getBlockRootClientId(
		select('core/block-editor').getSelectedBlockClientId()
	);

	return (
		<ToolbarPopover
			className='toolbar-item__size'
			tooltip={__('Size', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='width height'
			content={
				<div className='toolbar-item__size__popover'>
					{(isFirstOnHierarchy ||
						blockName === 'maxi-blocks/row-maxi') && (
						<RadioControl
							className='toolbar-item__popover__toggle-btn'
							label={__('Full Width', 'maxi-blocks')}
							selected={fullWidth}
							options={[
								{
									label: __('No', 'maxi-blocks'),
									value: 'normal',
								},
								{
									label: __('Yes', 'maxi-blocks'),
									value: 'full',
								},
							]}
							onChange={fullWidth => onChange({ fullWidth })}
						/>
					)}
					{!EXCLUDED_BLOCKS_SIZE.includes(blockName) && (
						<Fragment>
							{currentBlockRoot && (
								<SizeControl
									label={__('Width', 'maxi-blocks')}
									unit={getLastBreakpointAttribute(
										'width-unit',
										breakpoint,
										props
									)}
									onChangeUnit={val =>
										onChange({
											[`width-unit-${breakpoint}`]: val,
										})
									}
									defaultValue={getDefaultAttribute(
										`width-${breakpoint}`
									)}
									defaultUnit={getDefaultAttribute(
										`width-unit-${breakpoint}`
									)}
									value={getLastBreakpointAttribute(
										'width',
										breakpoint,
										props
									)}
									onChangeValue={val =>
										onChange({
											[`width-${breakpoint}`]: val,
										})
									}
								/>
							)}
							<SizeControl
								label={__('Max Width', 'maxi-blocks')}
								unit={getLastBreakpointAttribute(
									'max-width-unit',
									breakpoint,
									props
								)}
								onChangeUnit={val =>
									onChange({
										[`max-width-unit-${breakpoint}`]: val,
									})
								}
								defaultValue={getDefaultAttribute(
									`max-width-${breakpoint}`
								)}
								defaultUnit={getDefaultAttribute(
									`max-width-unit-${breakpoint}`
								)}
								value={getLastBreakpointAttribute(
									'max-width',
									breakpoint,
									props
								)}
								onChangeValue={val =>
									onChange({
										[`max-width-${breakpoint}`]: val,
									})
								}
							/>
						</Fragment>
					)}
				</div>
			}
		/>
	);
};

export default Size;
