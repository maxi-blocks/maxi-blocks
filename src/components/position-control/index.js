/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import AxisControl from '../axis-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isEmpty } from 'lodash';

/**
 * Component
 */
const PositionControl = props => {
	const {
		position,
		defaultPosition,
		className,
		onChange,
		breakpoint = 'general',
	} = props;

	const value = !isObject(position) ? JSON.parse(position) : position;

	const defaultValues = !isObject(defaultPosition)
		? JSON.parse(defaultPosition)
		: defaultPosition;

	const classes = classnames('maxi-position-control', className);

	const cleanOptions = {
		top: '',
		right: '',
		bottom: '',
		left: '',
		sync: false,
		unit: '',
	};

	return (
		<div className={classes}>
			<SelectControl
				label={__('Position', 'maxi-blocks')}
				options={[
					{ label: 'Default', value: '' },
					{ label: 'Relative', value: 'relative' },
					{ label: 'Absolute', value: 'absolute' },
					{ label: 'Fixed', value: 'fixed' },
				]}
				value={getLastBreakpointValue(value, 'position', breakpoint)}
				onChange={val => {
					value[breakpoint].position = val;
					if (isEmpty(val)) value.options[breakpoint] = cleanOptions;
					onChange(JSON.stringify(value));
				}}
			/>
			{!isEmpty(
				getLastBreakpointValue(value, 'position', breakpoint)
			) && (
				<AxisControl
					values={value.options}
					defaultValues={defaultValues.options}
					onChange={val => {
						value.options = JSON.parse(val);
						onChange(JSON.stringify(value));
					}}
					breakpoint={breakpoint}
					disableAuto
				/>
			)}
		</div>
	);
};

export default PositionControl;
