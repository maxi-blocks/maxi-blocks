/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import getLastBreakpointValue from '../../extensions/styles/getLastBreakpointValue';
import AxisControl from '../axis-control/newAxisControl';

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

	const classes = classnames('maxi-position-control', className);

	const cleanOptions = {
		top: '',
		right: '',
		bottom: '',
		left: '',
		sync: false,
		unit: '',
	};

	const getCleanOptions = () => {
		return {
			[`position-top-${breakpoint}`]: '',
			[`position-right-${breakpoint}`]: '',
			[`position-bottom-${breakpoint}`]: '',
			[`position-left-${breakpoint}`]: '',
			[`position-sync-${breakpoint}`]: false,
			[`position-unit-${breakpoint}`]: '',
		};
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
				value={getLastBreakpointValue('position', breakpoint, props)}
				onChange={val =>
					onChange({
						[`position-${breakpoint}`]: val,
						...(isEmpty(val) && getCleanOptions()),
					})
				}
			/>
			{!isEmpty(
				getLastBreakpointValue('position', breakpoint, props)
			) && (
				<AxisControl
					{...props}
					target='position'
					onChange={obj => onChange(obj)}
					breakpoint={breakpoint}
					disableAuto
				/>
			)}
		</div>
	);
};

export default PositionControl;
