/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import { handleOnReset } from '../../extensions/attributes';

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
		const defaultBreakpoints =
			select('maxiBlocks').receiveMaxiBreakpoints();

		return {
			defaultBreakpoints,
		};
	});

	const classes = classnames('maxi-responsive-control', className);

	return (
		<div className={classes}>
			<AdvancedNumberControl
				label={__('Breakpoint', 'maxi-blocks')}
				defaultValue={
					defaultBreakpoints[breakpoint === 'xxl' ? 'xl' : breakpoint]
				}
				value={props[`breakpoints-${breakpoint}`]}
				onChangeValue={val => {
					onChange({
						[`breakpoints-${
							breakpoint === 'xxl' ? 'xl' : breakpoint
						}`]: val !== undefined && val !== '' ? val : '',
					});
				}}
				min={0}
				max={9999}
				onReset={() =>
					onChange(
						handleOnReset({
							[`breakpoints-${
								breakpoint === 'xxl' ? 'xl' : breakpoint
							}`]:
								defaultBreakpoints[
									breakpoint === 'xxl' ? 'xl' : breakpoint
								],
						})
					)
				}
				initialPosition={
					defaultBreakpoints[breakpoint === 'xxl' ? 'xl' : breakpoint]
				}
			/>
		</div>
	);
};

export default ResponsiveControl;
