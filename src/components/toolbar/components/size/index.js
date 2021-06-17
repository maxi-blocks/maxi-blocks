/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../../../advanced-number-control';
import FancyRadioControl from '../../../fancy-radio-control';
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
];
const EXCLUDED_BLOCKS_SIZE = [
	'maxi-blocks/group-maxi',
	'maxi-blocks/svg-icon-maxi',
];

/**
 * Size
 */
const Size = props => {
	const { blockName, fullWidth, onChange, isFirstOnHierarchy, breakpoint } =
		props;

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
		>
			<div className='toolbar-item__size__popover'>
				{(isFirstOnHierarchy ||
					blockName === 'maxi-blocks/row-maxi') && (
					<FancyRadioControl
						label={__('Full Width', 'maxi-blocks')}
						selected={fullWidth}
						options={[
							{
								label: __('Yes', 'maxi-blocks'),
								value: 'full',
							},
							{
								label: __('No', 'maxi-blocks'),
								value: 'normal',
							},
						]}
						optionType='string'
						onChange={fullWidth => onChange({ fullWidth })}
					/>
				)}
				{!EXCLUDED_BLOCKS_SIZE.includes(blockName) && (
					<>
						{currentBlockRoot && (
							<AdvancedNumberControl
								label={__('Width', 'maxi-blocks')}
								enableUnit
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
									})
								}
							/>
						)}
						<AdvancedNumberControl
							label={__('Max Width', 'maxi-blocks')}
							enableUnit
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
					</>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default Size;
