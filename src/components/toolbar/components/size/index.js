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
	'maxi-blocks/text-maxi',
	'maxi-blocks/button-maxi',
];
const ELEMENT_BLOCKS = [
	{
		name: 'maxi-blocks/button-maxi',
		prefix: 'button-',
		attrLabel: 'fullWidth',
	},
];
const BLOCKS_MAX_WIDTH = [
	'maxi-blocks/divider-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/map-maxi',
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
			advancedOptions='height width'
		>
			<div className='toolbar-item__size__popover'>
				{(isFirstOnHierarchy ||
					blockName === 'maxi-blocks/row-maxi') && (
					<div>
						<ToggleSwitch
							label={__('Enable full width', 'maxi-blocks')}
							selected={props[attrLabel] === 'full'}
							onChange={val => {
								const full = val ? 'full' : 'normal';
								onChange({ [attrLabel]: full });
							}}
						/>
					</div>
				)}
				{props[attrLabel] === 'normal' && (
					<>
						<AdvancedNumberControl
							label={__('Width', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute({
								target: `${prefix}width-unit`,
								breakpoint,
								attributes: props,
							})}
							onChangeUnit={val =>
								onChange({
									[`${prefix}width-unit-${breakpoint}`]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: `${prefix}width`,
								breakpoint,
								attributes: props,
							})}
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
								unit={getLastBreakpointAttribute({
									target: `${prefix}max-width-unit`,
									breakpoint,
									attributes: props,
								})}
								onChangeUnit={val =>
									onChange({
										[`${prefix}max-width-unit-${breakpoint}`]:
											val,
									})
								}
								onReset={() =>
									onChange({
										[`${prefix}max-width-${breakpoint}`]:
											getDefaultAttribute(
												`${prefix}max-width-${breakpoint}`
											),
										[`${prefix}max-width-unit-${breakpoint}`]:
											getDefaultAttribute(
												`${prefix}max-width-unit-${breakpoint}`
											),
									})
								}
								value={getLastBreakpointAttribute({
									target: `${prefix}max-width`,
									breakpoint,
									attributes: props,
								})}
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
