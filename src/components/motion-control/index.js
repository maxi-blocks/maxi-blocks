/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';
import Icon from '../icon';
// import AddTimeline from './addTimeline';
// import ShowTimeline from './showTimeline';
// import TimelineSettings from './timelineSettings';
// import TimelinePresets from './timelinePresets';
// import { getGroupAttributes } from '../../extensions/styles';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import SelectControl from '../select-control';

// import { useState } from '@wordpress/element';
// import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
import RangeSliderControl from '../range-slider-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
// import { isEmpty, round } from 'lodash';
/**
 * Styles and icons
 */
import {
	styleNone,
	motionHorizontal,
	motionVertical,
	reset,
} from '../../icons';
import './editor.scss';

/**
 * Component
 */
const MotionControl = props => {
	const { className, onChange, breakpoint = 'general' } = props;

	const motionTypes = [
		'vertical',
		'horizontal',
		'rotate',
		'scale',
		'fade',
		'blur',
	];

	const classes = classnames('maxi-motion-control', className);
	// const [presetLoad, setPresetLoad] = useState('');

	const motionOptions = [
		{ label: <Icon icon={styleNone} />, value: '' },
		{ label: <Icon icon={motionVertical} />, value: 'vertical' },
		{ label: <Icon icon={motionHorizontal} />, value: 'horizontal' },
		{ label: <Icon icon={reset} />, value: 'rotate' },
	];

	const easingOptions = [
		{
			label: __('Ease', 'maxi-blocks'),
			value: 'ease',
		},
		{
			label: __('Linear', 'maxi-blocks'),
			value: 'linear',
		},
		{
			label: __('Ease In', 'maxi-blocks'),
			value: 'ease-in',
		},
		{
			label: __('Ease Out', 'maxi-blocks'),
			value: 'ease-out',
		},
		{
			label: __('Ease In Out', 'maxi-blocks'),
			value: 'ease-in-out',
		},
		{
			label: __('Cubic Bezier', 'maxi-blocks'),
			value: 'cubic-bezier',
		},
	];

	const getDirectionOptions = type => {
		const directionVerticalOptions = [
			{
				label: __('Scroll Up', 'maxi-blocks'),
				value: 'up',
			},
			{
				label: __('Scroll Down', 'maxi-blocks'),
				value: 'down',
			},
		];

		const directionHorizontalOptions = [
			{
				label: __('To Left', 'maxi-blocks'),
				value: 'left',
			},
			{
				label: __('To Right', 'maxi-blocks'),
				value: 'right',
			},
		];

		switch (type) {
			case 'vertical':
				return directionVerticalOptions;
			case 'horizontal':
				return directionHorizontalOptions;
			default:
				return null;
		}
	};

	return (
		<div className={classes}>
			<FancyRadioControl
				fullWidthMode
				selected={
					getLastBreakpointAttribute(
						'motion-active',
						breakpoint,
						props
					) || ''
				}
				options={motionOptions}
				optionType='string'
				onChange={val =>
					onChange({ [`motion-active-${breakpoint}`]: val })
				}
			/>
			{/* <FancyRadioControl
						 label={__('Preview', 'maxi-blocks')}
						 selected={props['motion-preview-status']}
						 options={[
							 { label: __('Yes', 'maxi-blocks'), value: 1 },
							 { label: __('No', 'maxi-blocks'), value: 0 },
						 ]}
						 onChange={val =>
							 onChange({ 'motion-preview-status': val })
						 }
					 /> */}
			{motionTypes.map(type => {
				{
					/* console.log(`type ${type}`);
				console.log(props['motion-active']);
				console.log(props['motion-active'] === type);
				console.log('================================='); */
				}
				const typeCapitalize =
					type.charAt(0).toUpperCase() + type.slice(1);
				return (
					<div key={`maxi-motion-control-${type}-${breakpoint}`}>
						{props[`motion-active-${breakpoint}`] === type && (
							<FancyRadioControl
								label={__(
									`Enable ${typeCapitalize}`,
									'maxi-blocks'
								)}
								selected={getLastBreakpointAttribute(
									`motion-status-${type}`,
									breakpoint,
									props
								)}
								options={[
									{
										label: __('Yes', 'maxi-blocks'),
										value: 1,
									},
									{
										label: __('No', 'maxi-blocks'),
										value: 0,
									},
								]}
								onChange={val =>
									onChange({
										[`motion-status-${type}-${breakpoint}`]:
											val,
									})
								}
							/>
						)}
						{props[`motion-active-${breakpoint}`] === type &&
							props[`motion-status-${type}-${breakpoint}`] && (
								<>
									<SelectControl
										label={__('Easing', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`motion-easing-${type}`,
											breakpoint,
											props
										)}
										onChange={val =>
											onChange({
												[`motion-easing-${type}-${breakpoint}`]:
													val,
											})
										}
										options={easingOptions}
									/>
									<SelectControl
										label={__('Direction', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`motion-direction-${type}`,
											breakpoint,
											props
										)}
										options={getDirectionOptions(type)}
										onChange={val =>
											onChange({
												[`motion-direction-${type}-${breakpoint}`]:
													val,
											})
										}
									/>
									<AdvancedNumberControl
										label={__('Speed', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`motion-speed-${type}`,
											breakpoint,
											props
										)}
										onChangeValue={val => {
											onChange({
												[`motion-speed-${type}-${breakpoint}`]:
													val !== undefined &&
													val !== ''
														? val
														: '',
											});
										}}
										min={0}
										step={0.1}
										max={10}
										onReset={() =>
											onChange({
												[`motion-speed-${type}-${breakpoint}`]:
													getDefaultAttribute(
														`motion-speed-${type}-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`motion-speed-${type}-general`
										)}
									/>
									<RangeSliderControl
										label={__('Offset', 'maxi-blocks')}
										step={0.1}
										min={0}
										max={100}
										values={[
											getLastBreakpointAttribute(
												`motion-offset-start-${type}`,
												breakpoint,
												props
											),
											getLastBreakpointAttribute(
												`motion-offset-middle-${type}`,
												breakpoint,
												props
											),
											getLastBreakpointAttribute(
												`motion-offset-end-${type}`,
												breakpoint,
												props
											),
										]}
										onChange={values =>
											onChange({
												[`motion-offset-start-${type}-${breakpoint}`]:
													values[0],
												[`motion-offset-middle-${type}-${breakpoint}`]:
													values[1],
												[`motion-offset-end-${type}-${breakpoint}`]:
													values[2],
											})
										}
									/>
								</>
							)}
					</div>
				);
			})}
		</div>
	);
};

export default MotionControl;
