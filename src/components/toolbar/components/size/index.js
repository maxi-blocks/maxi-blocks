/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';
import SizeControl from '../../../size-control';
import ToolbarPopover from '../toolbar-popover';
import { getDefaultProp } from '../../../../utils';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Icons
 */
import { toolbarSizing } from '../../../../icons';

/**
 * General
 */
const EXCLUDED_BLOCKS = [
	'maxi-blocks/image-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/svg-icon-maxi',
];

/**
 * Size
 */
const Size = props => {
	const {
		blockName,
		fullWidth,
		onChangeFullWidth,
		size,
		onChangeSize,
		isFirstOnHierarchy,
		breakpoint,
		clientId,
	} = props;

	if (EXCLUDED_BLOCKS.includes(blockName)) return null;

	const defaultSize = JSON.parse(getDefaultProp(clientId, 'size'));

	const value = !isObject(size) ? JSON.parse(size) : size;

	return (
		<ToolbarPopover
			className='toolbar-item__size'
			tooltip={__('Size', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='width height'
			content={
				<Fragment>
					{isFirstOnHierarchy && (
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
							onChange={fullWidth => onChangeFullWidth(fullWidth)}
						/>
					)}
					<SizeControl
						label={__('Width', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'widthUnit',
							breakpoint
						)}
						onChangeUnit={val => {
							value[breakpoint].widthUnit = val;
							onChangeSize(JSON.stringify(value));
						}}
						defaultValue={defaultSize[breakpoint]['width']}
						defaultUnit={defaultSize[breakpoint]['widthUnit']}
						value={getLastBreakpointValue(
							value,
							'width',
							breakpoint
						)}
						onChangeValue={val => {
							value[breakpoint].width = val;
							onChangeSize(JSON.stringify(value));
						}}
					/>
					<SizeControl
						label={__('Max Width', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'max-widthUnit',
							breakpoint
						)}
						onChangeUnit={val => {
							value[breakpoint]['max-widthUnit'] = val;
							onChangeSize(JSON.stringify(value));
						}}
						defaultValue={defaultSize[breakpoint]['max-width']}
						defaultUnit={defaultSize[breakpoint]['max-widthUnit']}
						value={getLastBreakpointValue(
							value,
							'max-width',
							breakpoint
						)}
						onChangeValue={val => {
							value[breakpoint]['max-width'] = val;
							onChangeSize(JSON.stringify(value));
						}}
					/>
				</Fragment>
			}
		/>
	);
};

export default Size;
