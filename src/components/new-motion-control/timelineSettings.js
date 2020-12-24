/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl, SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';

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

	return (
		<div className='maxi-motion-control__timeline-item-settings'>
			{!isNil(getCurrentTimelineItem()) && (
				<Fragment>
					<hr />
					<RangeControl
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
				</Fragment>
			)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'move' && (
					<Fragment>
						<div className='maxi-motion-control__timeline-item-settings__setting'>
							<RangeControl
								label={__('X', 'maxi-blocks')}
								help={
									isEmpty(
										getTimelineItemSettingValue('unitX')
									)
										? 'px'
										: getTimelineItemSettingValue('unitX')
								}
								value={getTimelineItemSettingValue('x')}
								onChange={value =>
									updateTimelineItemSettings(value, 'x')
								}
								min={-500}
								max={500}
							/>
							<SelectControl
								className='components-maxi-dimensions-control__units'
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
							<RangeControl
								label={__('Y', 'maxi-blocks')}
								help={
									isEmpty(
										getTimelineItemSettingValue('unitY')
									)
										? 'px'
										: getTimelineItemSettingValue('unitY')
								}
								value={getTimelineItemSettingValue('y')}
								onChange={value =>
									updateTimelineItemSettings(value, 'y')
								}
								min={-500}
								max={500}
							/>
							<SelectControl
								className='components-maxi-dimensions-control__units'
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
							<RangeControl
								label={__('Z', 'maxi-blocks')}
								help={
									isEmpty(
										getTimelineItemSettingValue('unitZ')
									)
										? 'px'
										: getTimelineItemSettingValue('unitZ')
								}
								value={getTimelineItemSettingValue('z')}
								onChange={value =>
									updateTimelineItemSettings(value, 'z')
								}
								min={-500}
								max={500}
							/>
							<SelectControl
								className='components-maxi-dimensions-control__units'
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
					</Fragment>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'rotate' && (
					<Fragment>
						<RangeControl
							label={__('X', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('x')}
							onChange={value =>
								updateTimelineItemSettings(value, 'x')
							}
							min={-180}
							max={180}
						/>
						<RangeControl
							label={__('Y', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('y')}
							onChange={value =>
								updateTimelineItemSettings(value, 'y')
							}
							min={-180}
							max={180}
						/>
						<RangeControl
							label={__('Z', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('z')}
							onChange={value =>
								updateTimelineItemSettings(value, 'z')
							}
							min={-180}
							max={180}
						/>
					</Fragment>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'skew' && (
					<Fragment>
						<RangeControl
							label={__('X', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('x')}
							onChange={value =>
								updateTimelineItemSettings(value, 'x')
							}
							min={-80}
							max={80}
						/>
						<RangeControl
							label={__('Y', 'maxi-blocks')}
							help='deg'
							value={getTimelineItemSettingValue('y')}
							onChange={value =>
								updateTimelineItemSettings(value, 'y')
							}
							min={-80}
							max={80}
						/>
					</Fragment>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'scale' && (
					<Fragment>
						<RangeControl
							label={__('X', 'maxi-blocks')}
							value={getTimelineItemSettingValue('x')}
							onChange={value =>
								updateTimelineItemSettings(value, 'x')
							}
							min={-2}
							max={2}
							step={0.1}
						/>
						<RangeControl
							label={__('Y', 'maxi-blocks')}
							value={getTimelineItemSettingValue('y')}
							onChange={value =>
								updateTimelineItemSettings(value, 'y')
							}
							min={-2}
							max={2}
							step={0.1}
						/>
						<RangeControl
							label={__('Z', 'maxi-blocks')}
							value={getTimelineItemSettingValue('z')}
							onChange={value =>
								updateTimelineItemSettings(value, 'z')
							}
							min={-2}
							max={2}
							step={0.1}
						/>
					</Fragment>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'opacity' && (
					<Fragment>
						<RangeControl
							label={__('Opacity', 'maxi-blocks')}
							help='%'
							value={getTimelineItemSettingValue('opacity')}
							onChange={value =>
								updateTimelineItemSettings(value, 'opacity')
							}
							initialPosition={1}
							min={0}
							max={1}
							step={0.1}
						/>
					</Fragment>
				)}
			{!isNil(getCurrentTimelineItem()) &&
				getCurrentTimelineItem().type === 'blur' && (
					<Fragment>
						<RangeControl
							label={__('Blur', 'maxi-blocks')}
							help='px'
							value={getTimelineItemSettingValue('blur')}
							onChange={value =>
								updateTimelineItemSettings(value, 'blur')
							}
							initialPosition={1}
							min={0}
							max={100}
							step={1}
						/>
					</Fragment>
				)}
			{!isNil(getCurrentTimelineItem()) && (
				<Fragment>
					<hr />
					<FancyRadioControl
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
					<FancyRadioControl
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
					<FancyRadioControl
						label={__('Tablet', 'maxi-blocks')}
						selected={+props['motion-tablet-status']}
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
							onChange({ 'motion-tablet-status': !!val })
						}
					/>
					<FancyRadioControl
						label={__('Mobile', 'maxi-blocks')}
						selected={+props['motion-mobile-status']}
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
							onChange({ 'motion-mobile-status': !!val })
						}
					/>
				</Fragment>
			)}
		</div>
	);
};
export default TimelineSettings;
