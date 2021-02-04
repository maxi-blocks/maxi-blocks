/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useSelect } = wp.data;

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

	const { defaultBreakpoints } = useSelect(select => {
		const defaultBreakpoints = select(
			'maxiBlocks'
		).receiveMaxiBreakpoints();

		return {
			defaultBreakpoints,
		};
	});

	const classes = classnames('maxi-responsive-control', className);

	return (
		<div className={classes}>
			<NumberControl
				label={__('Breakpoint', 'maxi-blocks')}
				className='maxi-responsive-control__breakpoint'
				value={
					props[`breakpoints-${breakpoint}`]
						? props[`breakpoints-${breakpoint}`]
						: defaultBreakpoints[
								breakpoint === 'xxl' ? 'xl' : breakpoint
						  ]
				}
				defaultValue={
					defaultBreakpoints[breakpoint === 'xxl' ? 'xl' : breakpoint]
				}
				onChange={val =>
					onChange({
						[`breakpoints-${
							breakpoint === 'xxl' ? 'xl' : breakpoint
						}`]: val,
					})
				}
				min={0}
				max={9999}
			/>
		</div>
	);
};

export default ResponsiveControl;
