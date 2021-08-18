/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import AxisControl from '../axis-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

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

	const getCleanOptions = () => {
		return {
			[`position-top-${breakpoint}`]: getDefaultAttribute(
				`position-top-${breakpoint}`
			),
			[`position-right-${breakpoint}`]: getDefaultAttribute(
				`position-right-${breakpoint}`
			),
			[`position-bottom-${breakpoint}`]: getDefaultAttribute(
				`position-bottom-${breakpoint}`
			),
			[`position-left-${breakpoint}`]: getDefaultAttribute(
				`position-left-${breakpoint}`
			),
			[`position-sync-${breakpoint}`]: getDefaultAttribute(
				`position-sync-${breakpoint}`
			),
			[`position-unit-${breakpoint}`]: getDefaultAttribute(
				`position-unit-${breakpoint}`
			),
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
				value={getLastBreakpointAttribute(
					'position',
					breakpoint,
					props
				)}
				onChange={val =>
					onChange({
						[`position-${breakpoint}`]: val,
						...(isEmpty(val) && getCleanOptions()),
					})
				}
			/>
			{!isEmpty(
				getLastBreakpointAttribute('position', breakpoint, props)
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
