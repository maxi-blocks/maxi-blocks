/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../../../advanced-number-control';
import SettingTabsControl from '../../../setting-tabs-control';
import ToolbarPopover from '../toolbar-popover';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { find } from 'lodash';

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
];
const ELEMENT_BLOCKS = [
	{
		name: 'maxi-blocks/button-maxi',
		prefix: 'button-',
		attrLabel: 'fullWidth',
	},
];
const BLOCKS_MAX_WIDTH = [
	'maxi-blocks/button-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/map-maxi',
	'maxi-blocks/text-maxi',
];

/**
 * Size
 */
const Size = props => {
	const { blockName, breakpoint, isFirstOnHierarchy, onChange } = props;

	if (EXCLUDED_BLOCKS.includes(blockName)) return null;

	const { prefix = '', attrLabel = 'blockFullWidth' } =
		find(ELEMENT_BLOCKS, {
			name: blockName,
		}) ?? {};

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
					<SettingTabsControl
						label={__('Full Width', 'maxi-blocks')}
						type='buttons'
						selected={props[attrLabel]}
						items={[
							{
								label: __('Yes', 'maxi-blocks'),
								value: 'full',
							},
							{
								label: __('No', 'maxi-blocks'),
								value: 'normal',
							},
						]}
						onChange={value => onChange({ [attrLabel]: value })}
					/>
				)}
				{props[attrLabel] === 'normal' && (
					<>
						<AdvancedNumberControl
							label={__('Width', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute(
								`${prefix}width-unit`,
								breakpoint,
								props
							)}
							onChangeUnit={val =>
								onChange({
									[`${prefix}width-unit-${breakpoint}`]: val,
								})
							}
							value={getLastBreakpointAttribute(
								`${prefix}width`,
								breakpoint,
								props
							)}
							onChangeValue={val =>
								onChange({
									[`${prefix}width-${breakpoint}`]: val,
								})
							}
							onReset={() =>
								onChange({
									[`${prefix}width-${breakpoint}`]:
										getDefaultAttribute(
											`${prefix}width-${breakpoint}`
										),
									[`${prefix}width-unit-${breakpoint}`]:
										getDefaultAttribute(
											`${prefix}width-unit-${breakpoint}`
										),
								})
							}
						/>
						{BLOCKS_MAX_WIDTH.includes(blockName) && (
							<AdvancedNumberControl
								label={__('Max Width', 'maxi-blocks')}
								enableUnit
								unit={getLastBreakpointAttribute(
									`${prefix}max-width-unit`,
									breakpoint,
									props
								)}
								onChangeUnit={val =>
									onChange({
										[`${prefix}max-width-unit-${breakpoint}`]:
											val,
									})
								}
								defaultValue={getDefaultAttribute(
									`${prefix}max-width-${breakpoint}`
								)}
								defaultUnit={getDefaultAttribute(
									`${prefix}max-width-unit-${breakpoint}`
								)}
								value={getLastBreakpointAttribute(
									`${prefix}max-width`,
									breakpoint,
									props
								)}
								onChangeValue={val =>
									onChange({
										[`${prefix}max-width-${breakpoint}`]:
											val,
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
