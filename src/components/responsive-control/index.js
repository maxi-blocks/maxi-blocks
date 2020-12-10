/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import __experimentalNumberControl from '../number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Component
 */
const ResponsiveControl = props => {
	const { onChange, className, breakpoint } = props;

	const breakpoints = { ...props.breakpoints };
	const defaultBreakpoints = { ...props.defaultBreakpoints };

	const classes = classnames('maxi-responsive-control', className);

	return (
		<div className={classes}>
			<__experimentalNumberControl
				label={__('Breakpoint', 'maxi-blocks')}
				className='maxi-responsive-control__breakpoint'
				value={breakpoints[breakpoint]}
				defaultBreakpoints={defaultBreakpoints[breakpoint]}
				onChange={val => {
					breakpoints[breakpoint] = val;
					onChange(breakpoints);
				}}
				min={0}
				max={9999}
			/>
		</div>
	);
};

export default ResponsiveControl;
