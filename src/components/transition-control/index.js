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
	const { onChange, className, breakpoint, type } = props;
	const selected = props[`transition-${type}-selected`] || 'none';

	const onChangeTransition = obj => {
		const newObj = {
			transition: {
				...props?.transition,
				[type]: {
					...(props?.transition?.[type] || []),
					[selected]: {
						...(props?.transition?.[type]?.[selected] || {}),
						...obj,
					},
				},
			},
		};

		onChange(newObj);

		return newObj;
	};

	const getDefaultTransitionAttribute = prop => {
		const defaultTransition = getDefaultAttribute('transition');

		return defaultTransition[type][selected][`${prop}-${breakpoint}`];
	};

	const transitionObj = props.transition[type][selected];

	const classes = classnames('maxi-transition-control', className);

	return (
		<div className={classes}>
			<AdvancedNumberControl
				label={__('Transition duration', 'maxi-blocks')}
				className='maxi-transition-control__duration'
				defaultValue={getDefaultTransitionAttribute(
					'transition-duration'
				)}
				value={getLastBreakpointAttribute({
					target: 'transition-duration',
					breakpoint,
					attributes: transitionObj,
				})}
				onChangeValue={val => {
					onChangeTransition({
						[`transition-duration-${breakpoint}`]:
							val !== undefined && val !== '' ? val : '',
					});
				}}
				min={0}
				max={5}
				step={0.1}
				initial={0.3}
				onReset={() =>
					onChangeTransition({
						[`transition-duration-${breakpoint}`]:
							getDefaultTransitionAttribute(
								'transition-duration'
							),
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Transition delay', 'maxi-blocks')}
				className='maxi-transition-control__delay'
				defaultValue={getDefaultTransitionAttribute('transition-delay')}
				value={getLastBreakpointAttribute({
					target: 'transition-delay',
					breakpoint,
					attributes: transitionObj,
				})}
				onChangeValue={val => {
					onChangeTransition({
						[`transition-delay-${breakpoint}`]:
							val !== undefined && val !== '' ? val : '',
					});
				}}
				min={0}
				max={5}
				step={0.1}
				initial={0}
				onReset={() =>
					onChangeTransition({
						[`transition-delay-${breakpoint}`]:
							getDefaultTransitionAttribute('transition-delay'),
					})
				}
			/>
			<SelectControl
				label={__('Easing', 'maxi-blocks')}
				className='maxi-transition-control__easing'
				value={getLastBreakpointAttribute({
					target: 'easing',
					breakpoint,
					attributes: transitionObj,
				})}
				options={[
					{ label: __('Ease', 'maxi-blocks'), value: 'ease' },
					{ label: __('Ease-in', 'maxi-blocks'), value: 'ease-in' },
					{ label: __('Ease-out', 'maxi-blocks'), value: 'ease-out' },
					{
						label: __('Ease-in-out', 'maxi-blocks'),
						value: 'ease-in-out',
					},
					{ label: __('Linear', 'maxi-blocks'), value: 'linear' },
				]}
				onChange={val => {
					onChangeTransition({
						[`easing-${breakpoint}`]:
							val !== undefined && val !== '' ? val : '',
					});
				}}
				onReset={() =>
					onChangeTransition({
						[`easing-${breakpoint}`]:
							getDefaultTransitionAttribute('easing'),
					})
				}
			/>
		</div>
	);
};

export default TransitionControl;
