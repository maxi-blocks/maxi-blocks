/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import __experimentalAxisControl from '../axis-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Component
 */
const PositionControl = props => {
	const { className, onChange, breakpoint = 'general' } = props;

	const position = { ...props.position };
	const defaultPosition = { ...props.defaultPosition };

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
				value={getLastBreakpointValue(position, 'position', breakpoint)}
				onChange={val => {
					position[breakpoint].position = val;
					if (isEmpty(val))
						position.options[breakpoint] = cleanOptions;
					onChange(position);
				}}
			/>
			{!isEmpty(
				getLastBreakpointValue(position, 'position', breakpoint)
			) && (
				<__experimentalAxisControl
					values={position.options}
					defaultPosition={defaultPosition.options}
					onChange={options => {
						position.options = options;
						onChange(position);
					}}
					breakpoint={breakpoint}
					disableAuto
				/>
			)}
		</div>
	);
};

export default PositionControl;
