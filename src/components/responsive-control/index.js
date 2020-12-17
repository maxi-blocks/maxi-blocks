/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import NumberControl from '../number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
			<NumberControl
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
