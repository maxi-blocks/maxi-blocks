/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {} from '@wordpress/element';

/**
 * Internal dependencies
 */
// import SelectControl from '../select-control';
// import RadioControl from '../radio-control';
// import RangeSliderControl from '../range-slider-control';

/**
 * External dependencies
 */
import { isEmpty, isNil, has, filter } from 'lodash';

/**
 * Component
 */
const TimelineSettings = props => {
	const { onChange } = props;

	const getCurrentTimelineItem = () => {
		if (
			props['motion-time-line'] &&
			!isEmpty(
				props['motion-time-line'][props['motion-active-time-line-time']]
			)
		) {
			return props['motion-time-line'][
				props['motion-active-time-line-time']
			][props['motion-active-time-line-index']];
		}
	};

	const updateTimelineItemPosition = (prevTime, newTime) => {
		const newTimeline = { ...props['motion-time-line'] };
		const prevItem =
			newTimeline[prevTime][props['motion-active-time-line-index']];
		prevItem.settings.effectPosition = newTime;

		const result = filter(newTimeline[prevTime], o => {
			return o.type !== prevItem.type;
		});

		const removeResult = isEmpty(result)
			? delete newTimeline[prevTime] && newTimeline
			: {
					...newTimeline,
					[prevTime]: [...result],
			  };

		let addResult = {};
		if (!has(removeResult, newTime)) {
			addResult = {
				...removeResult,
				[newTime]: [prevItem],
			};
		} else {
			removeResult[newTime].unshift(prevItem);
			addResult = {
				...removeResult,
			};
		}

		onChange({
			'motion-time-line': { ...addResult },
			'motion-active-time-line-time': +newTime,
			'motion-active-time-line-index': 0,
		});
	};

	const updateTimelineItemSettings = (value, name) => {
		if (
			!isEmpty(
				props['motion-time-line'][props['motion-active-time-line-time']]
			)
		) {
			const newTimeline = { ...props['motion-time-line'] };
			newTimeline[props['motion-active-time-line-time']][
				props['motion-active-time-line-index']
			].settings[name] = value;

			onChange({
				'motion-time-line': newTimeline,
			});
		}
	};

	const getTimelineItemSettingValue = name => {
		if (
			!isEmpty(
				props['motion-time-line'][props['motion-active-time-line-time']]
			)
		) {
			return props['motion-time-line'][
				props['motion-active-time-line-time']
			][props['motion-active-time-line-index']].settings[name];
		}
	};
	/*
		RangeSliderControl should be replaced with AdvancedNumberControl but we are working on the new version of Motions Effect maybe we will remove this component completely, so hold them for now and will get the correct decision future :)
		*/
	/*
	return (

		<div className='maxi-motion-control__timeline-item-settings'>
			{!isNil(getCurrentTimelineItem()) && (
				<>
					<hr />
					<RangeSliderControl
						label={__('Position', 'maxi-blocks')}
						value={getTimelineItemSettingValue('effectPosition')}
						onChange={value => {
							const re = /^(100|[1-9]?[0-9])$/;
							if (re.test(value)) {
								updateTimelineItemPosition(
									getTimelineItemSettingValue(
										'effectPosition'
									),
									value
								);
							}
						}}
						min={0}
						max={100}
					/>
					<hr />
				</>
			)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'move' && (
					<>
						<div className='maxi-motion-control__timeline-item-settings__setting'>
							<RangeSliderControl
								label={__('X', 'maxi-blocks')}
								help={
									isEmpty(
										getTimelineItemSettingValue('unitX')
									)
										? 'px'
										: getTimelineItemSettingValue('unitX')
								}
								value={getTimelineItemSettingValue('x')}
								onChange={val => {
									updateTimelineItemSettings(val, 'x');
								}}
								min={-500}
								max={500}
							/>
							<SelectControl
								className='maxi-dimensions-control__units'
								options={[
									{
										label: __('PX', 'maxi-blocks'),
										value: 'px',
									},
									{
										label: __('%', 'maxi-blocks'),
										value: '%',
									},
									{
										label: __('EM', 'maxi-blocks'),
										value: 'em',
									},
									{
										label: __('VW', 'maxi-blocks'),
										value: 'vw',
									},
								]}
								value={getTimelineItemSettingValue('unitX')}
								onChange={value =>
									updateTimelineItemSettings(value, 'unitX')
								}
							/>
						</div>
						<div className='maxi-motion-control__timeline-item-settings__setting'>
							<RangeSliderControl
								label={__('Y', 'maxi-blocks')}
								help={
									isEmpty(
										getTimelineItemSettingValue('unitY')
									)
										? 'px'
										: getTimelineItemSettingValue('unitY')
								}
								value={getTimelineItemSettingValue('y')}
								onChange={val => {
									updateTimelineItemSettings(val, 'y');
								}}
								min={-500}
								max={500}
							/>
							<SelectControl
								className='maxi-dimensions-control__units'
								options={[
									{
										label: __('PX', 'maxi-blocks'),
										value: 'px',
									},
									{
										label: __('%', 'maxi-blocks'),
										value: '%',
									},
									{
										label: __('EM', 'maxi-blocks'),
										value: 'em',
									},
									{
										label: __('VW', 'maxi-blocks'),
										value: 'vw',
									},
								]}
								value={getTimelineItemSettingValue('unitY')}
								onChange={value =>
									updateTimelineItemSettings(value, 'unitY')
								}
							/>
						</div>
						<div className='maxi-motion-control__timeline-item-settings__setting'>
							<RangeSliderControl
								label={__('Z', 'maxi-blocks')}
								help={
									isEmpty(
										getTimelineItemSettingValue('unitZ')
									)
										? 'px'
										: getTimelineItemSettingValue('unitZ')
								}
								value={getTimelineItemSettingValue('z')}
								onChange={val => {
									updateTimelineItemSettings(val, 'z');
								}}
								min={-500}
								max={500}
							/>
							<SelectControl
								className='maxi-dimensions-control__units'
								options={[
									{
										label: __('PX', 'maxi-blocks'),
										value: 'px',
									},
									{
										label: __('%', 'maxi-blocks'),
										value: '%',
									},
									{
										label: __('EM', 'maxi-blocks'),
										value: 'em',
									},
									{
										label: __('VW', 'maxi-blocks'),
										value: 'vw',
									},
								]}
								value={getTimelineItemSettingValue('unitZ')}
								onChange={value =>
									updateTimelineItemSettings(value, 'unitZ')
								}
							/>
						</div>
					</>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'rotate' && (
					<>
						<RangeSliderControl
							label={__('X', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('x')}
							onChange={val => {
								updateTimelineItemSettings(val, 'x');
							}}
							min={-180}
							max={180}
						/>
						<RangeSliderControl
							label={__('Y', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('y')}
							onChange={val => {
								updateTimelineItemSettings(val, 'y');
							}}
							min={-180}
							max={180}
						/>
						<RangeSliderControl
							label={__('Z', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('z')}
							onChange={val => {
								updateTimelineItemSettings(val, 'z');
							}}
							min={-180}
							max={180}
						/>
					</>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'skew' && (
					<>
						<RangeSliderControl
							label={__('X', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('x')}
							onChange={val => {
								updateTimelineItemSettings(val, 'x');
							}}
							min={-80}
							max={80}
						/>
						<RangeSliderControl
							label={__('Y', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('y')}
							onChange={val => {
								updateTimelineItemSettings(val, 'y');
							}}
							min={-80}
							max={80}
						/>
					</>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'scale' && (
					<>
						<RangeSliderControl
							label={__('X', 'maxi-blocks')}
							value={getTimelineItemSettingValue('x')}
							onChange={val => {
								updateTimelineItemSettings(val, 'x');
							}}
							min={-2}
							max={2}
							step={0.1}
						/>
						<RangeSliderControl
							label={__('Y', 'maxi-blocks')}
							value={getTimelineItemSettingValue('y')}
							onChange={val => {
								updateTimelineItemSettings(val, 'y');
							}}
							min={-2}
							max={2}
							step={0.1}
						/>
						<RangeSliderControl
							label={__('Z', 'maxi-blocks')}
							value={getTimelineItemSettingValue('z')}
							onChange={val => {
								updateTimelineItemSettings(val, 'z');
							}}
							min={-2}
							max={2}
							step={0.1}
						/>
					</>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'opacity' && (
					<>
						<RangeSliderControl
							label={__('Opacity', 'maxi-blocks')}
							help='%'
							value={getTimelineItemSettingValue('opacity')}
							onChange={val => {
								updateTimelineItemSettings(val, 'opacity');
							}}
							initialPosition={1}
							min={0}
							max={1}
							step={0.1}
						/>
					</>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'blur' && (
					<>
						<RangeSliderControl
							label={__('Blur', 'maxi-blocks')}
							help='px'
							value={getTimelineItemSettingValue('blur')}
							onChange={val => {
								updateTimelineItemSettings(val, 'blur');
							}}
							initialPosition={1}
							min={0}
							max={100}
							step={1}
						/>
					</>
				)}
			{!isNil(getCurrentTimelineItem()) && (
				<>
					<hr />
					<RadioControl
						label={__('X-Axis', 'maxi-blocks')}
						selected={props['motion-transform-origin-x']}
						options={[
							{
								label: __('Left', 'maxi-blocks'),
								value: 'left',
							},
							{
								label: __('Center', 'maxi-blocks'),
								value: 'center',
							},
							{
								label: __('Right', 'maxi-blocks'),
								value: 'right',
							},
						]}
						onChange={val =>
							onChange({ 'motion-transform-origin-x': val })
						}
					/>
					<RadioControl
						label={__('Y-Axis', 'maxi-blocks')}
						selected={props['motion-transform-origin-y']}
						options={[
							{
								label: __('Top', 'maxi-blocks'),
								value: 'top',
							},
							{
								label: __('Center', 'maxi-blocks'),
								value: 'center',
							},
							{
								label: __('Bottom', 'maxi-blocks'),
								value: 'bottom',
							},
						]}
						onChange={val =>
							onChange({ 'motion-transform-origin-y': val })
						}
					/>
					<hr />
					<RadioControl
						label={__('Tablet', 'maxi-blocks')}
						selected={props['motion-tablet-status']}
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
							onChange({ 'motion-tablet-status': val })
						}
					/>
					<RadioControl
						label={__('Mobile', 'maxi-blocks')}
						selected={props['motion-mobile-status']}
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
							onChange({ 'motion-mobile-status': val })
						}
					/>
				</>
			)}
		</div>

	);
	*/
};
export default TimelineSettings;
