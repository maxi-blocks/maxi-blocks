/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const TransitionControl = props => {
	const { onChange, className, breakpoint } = props;

	const classes = classnames('maxi-transition-control', className);

	return (
		<AdvancedNumberControl
			label={__('Transition duration', 'maxi-blocks')}
			className={classes}
			defaultValue={getDefaultAttribute(
				`transition-duration-${breakpoint}`
			)}
			value={getLastBreakpointAttribute({
				target: 'transition-duration',
				breakpoint,
				attributes: props,
			})}
			onChangeValue={val => {
				onChange({
					[`transition-duration-${breakpoint}`]:
						val !== undefined && val !== '' ? val : '',
				});
			}}
			min={0.3}
			max={5}
			step={0.1}
			initial={0.3}
			onReset={() =>
				onChange({
					[`transition-duration-${breakpoint}`]: getDefaultAttribute(
						`transition-duration-${breakpoint}`
					),
				})
			}
			initialPosition={getDefaultAttribute(
				`transition-duration-${breakpoint}`
			)}
		/>
	);
};

export default TransitionControl;
