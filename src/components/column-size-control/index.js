/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getColumnDefaultValue } from '../../extensions/column-templates';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import AdvancedNumberControl from '../advanced-number-control';
import SelectControl from '../select-control';
import { ToggleSwitch } from '../../components';

/**
 * Component
 */
const ColumnSizeControl = props => {
	const { verticalAlign, rowPattern, clientId, onChange, breakpoint } = props;

	return (
		<>
			<ToggleSwitch
				label={__('Fit content', 'maxi-blocks')}
				className='maxi-column-inspector__fit-content'
				selected={getLastBreakpointAttribute({
					target: 'column-fit-content',
					breakpoint,
					props,
				})}
				onChange={val => {
					onChange({
						[`column-fit-content-${breakpoint}`]: val,
					});
				}}
			/>
			{!getLastBreakpointAttribute({
				target: 'column-fit-content',
				breakpoint,
				props,
			}) && (
				<AdvancedNumberControl
					label={__('Column Size (%)', 'maxi-blocks')}
					value={getLastBreakpointAttribute({
						target: 'column-size',
						breakpoint,
						props,
					})}
					onChangeValue={val => {
						onChange({
							[`column-size-${breakpoint}`]:
								val !== undefined && val !== '' ? val : '',
						});
					}}
					min={0}
					max={100}
					step={0.1}
					onReset={() =>
						onChange({
							[`column-size-${breakpoint}`]:
								getColumnDefaultValue(
									rowPattern,
									{
										...getGroupAttributes(
											props,
											'columnSize'
										),
									},
									clientId,
									breakpoint
								),
						})
					}
					initialPosition={getDefaultAttribute(
						`column-size-${breakpoint}`,
						clientId
					)}
				/>
			)}
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
						verticalAlign,
					})
				}
			/>
		</>
	);
};

export default ColumnSizeControl;
