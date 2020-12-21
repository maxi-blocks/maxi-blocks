/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl, SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { getLastBreakpointValue, getDefaultProp } from '../../../../utils';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';

/**
 * ColumnSize
 */
const ColumnSize = props => {
	const {
		clientId,
		blockName,
		verticalAlign,
		uniqueID,
		onChange,
		breakpoint,
	} = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	const columnSize = { ...props.columnSize };

	return (
		<ToolbarPopover
			className='toolbar-item__column-size'
			tooltip={__('ColumnSize', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='column settings'
			content={
				<div className='toolbar-item__column-size__popover'>
					<RangeControl
						label={__('Column Size', 'maxi-blocks')}
						value={getLastBreakpointValue(
							columnSize,
							'size',
							breakpoint
						)}
						onChange={val => {
							columnSize[breakpoint].size = val;
							document.querySelector(
								`.maxi-column-block__resizer__${uniqueID}`
							).style.width = `${val}%`;

							onChange({
								columnSize,
								verticalAlign,
							});
						}}
						min='0'
						max='100'
						step={0.1}
						allowReset
						initialPosition={
							getDefaultProp(clientId, 'columnSize')[breakpoint]
								.size
						}
					/>
					<SelectControl
						label={__('Vertical align', 'maxi-blocks')}
						value={verticalAlign}
						options={[
							{
								label: __('Top', 'maxi-blocks'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'maxi-blocks'),
								value: 'center',
							},
							{
								label: __('Bottom', 'maxi-blocks'),
								value: 'flex-end',
							},
							{
								label: __('Space between', 'maxi-blocks'),
								value: 'space-between',
							},
							{
								label: __('Space around', 'maxi-blocks'),
								value: 'space-around',
							},
						]}
						onChange={verticalAlign =>
							onChange({
								columnSize,
								verticalAlign,
							})
						}
					/>
				</div>
			}
		/>
	);
};

export default ColumnSize;
