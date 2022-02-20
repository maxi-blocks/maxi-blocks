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

/**
 * Component
 */
const ColumnSizeControl = props => {
	const { verticalAlign, rowPattern, clientId, onChange, breakpoint } = props;

	return (
		<>
			<AdvancedNumberControl
				label={__('Column Size (%)', 'maxi-blocks')}
				value={getLastBreakpointAttribute(
					'column-size',
					breakpoint,
					props
				)}
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
						[`column-size-${breakpoint}`]: getColumnDefaultValue(
							rowPattern,
							{
								...getGroupAttributes(props, 'columnSize'),
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
