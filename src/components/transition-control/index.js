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
import SelectControl from '../select-control';

/**
 * Component
 */
const TransitionControl = props => {
	const { onChange, className, breakpoint } = props;

	const classes = classnames('maxi-transition-control', className);

	return (
		<>
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
			min={0}
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
		<AdvancedNumberControl
			label={__('Transition delay', 'maxi-blocks')}
			className={classes}
			defaultValue={getDefaultAttribute(
				`transition-delay-${breakpoint}`
			)}
			value={getLastBreakpointAttribute({
				target: 'transition-delay',
				breakpoint,
				attributes: props,
			})}
			onChangeValue={val => {
				onChange({
					[`transition-delay-${breakpoint}`]:
						val !== undefined && val !== '' ? val : '',
				});
			}}
			min={0}
			max={5}
			step={0.1}
			initial={0}
			onReset={() =>
				onChange({
					[`transition-delay-${breakpoint}`]: getDefaultAttribute(
						`transition-delay-${breakpoint}`
					),
				})
			}
			initialPosition={getDefaultAttribute(
				`transition-delay-${breakpoint}`
			)}
		/>
		<SelectControl
			label={__('Easing', 'maxi-blocks')}
			className={classes}
			value={getLastBreakpointAttribute({
				target: 'easing',
				breakpoint,
				attributes: props,
			})}
			options={[
				{ label: __('Ease', 'maxi-blocks'), value: 'ease' },
				{ label: __('Ease-in', 'maxi-blocks'), value: 'ease-in' },
				{ label: __('Ease-out', 'maxi-blocks'), value: 'ease-out' },
				{ label: __('Ease-in-out', 'maxi-blocks'), value: 'ease-in-out' },
				{ label: __('Linear', 'maxi-blocks'), value: 'linear' },
			]}
			onChange={val => {
				onChange({
					[`easing-${breakpoint}`]: val !== undefined && val !== ''
						? val
						: '',
				});
			}}
			onReset={() =>
				onChange({
					[`easing-${breakpoint}`]: getDefaultAttribute(
						`easing-${breakpoint}`
					),
				})
			}
			initialPosition={getDefaultAttribute(`easing-${breakpoint}`)}
		/>
		</>
	);
};

export default TransitionControl;
