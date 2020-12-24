/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue, getDefaultProp } from '../../../../utils';
import SizeControl from '../../../size-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';

/**
 * General
 */
const EXCLUDED_BLOCKS = [
	'maxi-blocks/image-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/font-icon-maxi',
];

/**
 * Size
 */
const Size = props => {
	const {
		blockName,
		fullWidth,
		onChangeFullWidth,
		onChangeSize,
		isFirstOnHierarchy,
		breakpoint,
		clientId,
	} = props;

	if (EXCLUDED_BLOCKS.includes(blockName)) return null;

	const size = { ...props.size };
	const defaultSize = getDefaultProp(clientId, 'size');

	return (
		<ToolbarPopover
			className='toolbar-item__size'
			tooltip={__('Size', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='width height'
			content={
				<div className='toolbar-item__size__popover'>
					{isFirstOnHierarchy &&
						blockName === 'maxi-blocks/container-maxi' && (
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
								onChange={fullWidth =>
									onChangeFullWidth(fullWidth)
								}
							/>
						)}
					<SizeControl
						label={__('Width', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							size,
							'widthUnit',
							breakpoint
						)}
						onChangeUnit={val => {
							size[breakpoint].widthUnit = val;

							onChangeSize(size);
						}}
						defaultValue={defaultSize[breakpoint].width}
						defaultUnit={defaultSize[breakpoint].widthUnit}
						value={getLastBreakpointValue(
							size,
							'width',
							breakpoint
						)}
						onChangeValue={val => {
							size[breakpoint].width = val;

							onChangeSize(size);
						}}
					/>
					<SizeControl
						label={__('Max Width', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							size,
							'max-widthUnit',
							breakpoint
						)}
						onChangeUnit={val => {
							size[breakpoint]['max-widthUnit'] = val;

							onChangeSize(size);
						}}
						defaultValue={defaultSize[breakpoint]['max-width']}
						defaultUnit={defaultSize[breakpoint]['max-widthUnit']}
						value={getLastBreakpointValue(
							size,
							'max-width',
							breakpoint
						)}
						onChangeValue={val => {
							size[breakpoint]['max-width'] = val;

							onChangeSize(size);
						}}
					/>
				</div>
			}
		/>
	);
};

export default Size;
