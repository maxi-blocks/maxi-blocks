import { __ } from '@wordpress/i18n';

/**
 * Styles
 */
import './editor.scss';

import { Popover } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import SelectControl from '../../../select-control';
import SettingTabsControl from '../../../setting-tabs-control';
import TextControl from '../../../text-control';
import ToggleSwitch from '../../../toggle-switch';
import { DateOptions } from './utils';

const DateFormatting = props => {
	const { content } = props;
	const contentRef = useRef(content);

	const [day, setDay] = useState(props.day);
	const [era, setEra] = useState(props.era);
	const [format, setFormat] = useState(props.format);
	const [hour, setHour] = useState(props.hour);
	const [hour12, setHour12] = useState(props.hour12);
	const [isVisible, setIsVisible] = useState(false);
	const [linkStatus, setLinkStatus] = useState('year');
	const [minute, setMinute] = useState(props.minute);
	const [month, setMonth] = useState(props.month);
	const [second, setSecond] = useState(props.second);
	const [status, setStatus] = useState(props.status);
	const [timeZone, setTimeZone] = useState(props.timeZone);
	const [timeZoneName, setTimeZoneName] = useState(props.timeZoneName);
	const [weekday, setWeekday] = useState(props.weekday);
	const [year, setYear] = useState(props.year);
	const [zone, setZone] = useState(props.zone);

	const toggleVisible = () => setIsVisible(state => !state);
	const validateAnchor = str => {
		if (
			str.split('d').length + str.split('D').length - 2 < 2 &&
			str.split('m').length + str.split('M').length - 2 < 2 &&
			str.split('y').length + str.split('Y').length - 2 < 2
		) {
			const regex =
				/^([dDmMyY]{0,1})(\s{0,1})([-,\.\/]{0,1})(\s{0,1})([dDmMyY]{0,1})(\s{0,1})([-,\.\/]{0,1})(\s{0,1})([dDmMyY]{0,1})(\s{0,1})([-,\.\/]{0,1})(\s{0,1})([t]{0,1})$/;
			if (regex.test(str)) {
				setFormat(str);
			}
		}
	};

	const dateFormat = _value => {
		const options = {
			day: day === 'undefined' ? undefined : day,
			era: era === 'undefined' ? undefined : era,
			hour: hour === 'undefined' ? undefined : hour,
			hour12:
				hour12 === 'false' ? false : hour12 === 'true' ? true : hour12,
			minute: minute === 'undefined' ? undefined : minute,
			month: month === 'undefined' ? undefined : month,
			second: second === 'undefined' ? undefined : second,
			timeZone: timeZone,
			timeZoneName: timeZoneName,
			weekday: weekday === 'undefined' ? undefined : weekday,
			year: year === 'undefined' ? undefined : year,
		};

		const data = {
			format: format,
			options: options,
			status: status,
			zone: zone,
		};

		if (_value) {
			const NewDate = new Date(_value);
			contentRef.current = NewDate.toLocaleString(zone, options);
			data.content = contentRef.current;
		}
		props.parentCallback(data);
	};
	useEffect(
		() => dateFormat(contentRef.current),
		[
			day,
			era,
			format,
			hour,
			hour12,
			minute,
			month,
			second,
			status,
			timeZone,
			timeZoneName,
			weekday,
			year,
			zone,
		]
	);
	return (
		<div className='date-formatting'>
			{isVisible && (
				<Popover className='date-popover' position='top right'>
					<p>
						<b>d</b> - day in numeric format
					</p>
					<p>
						<b>D</b> - day in text format
					</p>
					<p>
						<b>m</b> - month in numeric format
					</p>
					<p>
						<b>M</b> - month in text format
					</p>
					<p>
						<b>y</b> - year in short format
					</p>
					<p>
						<b>Y</b> - full year
					</p>
					<p>
						<b>t</b> - time
					</p>
				</Popover>
			)}
			<ToggleSwitch
				label={__('Date setting', 'maxi-blocks')}
				selected={status}
				onChange={() => setStatus(!status)}
			/>
			{!status && (
				<div className='date-status'>
					<div className='block-info-icon' onClick={toggleVisible}>
						<span className='block-info-icon-span'>i</span>
					</div>
					<TextControl
						label={__('Date format', 'maxi-blocks')}
						help={false}
						placeholder={__('d.m.Y t')}
						value={format}
						onChange={val => validateAnchor(val)}
					/>
				</div>
			)}
			{status && (
				<>
					<SettingTabsControl
						type='buttons'
						fullWidthMode
						className='maxi-typography-control__link-options'
						selected={linkStatus}
						hasBorder
						items={[
							{
								label: __('Year', 'maxi-block'),
								value: 'year',
							},
							{
								label: __('Time', 'maxi-block'),
								value: 'time',
							},
							{
								label: __('Zone', 'maxi-block'),
								value: 'zone',
							},
						]}
						onChange={value => setLinkStatus(value)}
					/>
					{linkStatus === 'year' && (
						<>
							<SelectControl
								label={__('Era', 'maxi-blocks')}
								value={era}
								options={DateOptions.era}
								onChange={value => setEra(value)}
							/>
							<SelectControl
								label={__('Years', 'maxi-blocks')}
								value={year}
								options={DateOptions.year}
								onChange={value => setYear(value)}
							/>
							<SelectControl
								label={__('Month', 'maxi-blocks')}
								value={month}
								options={DateOptions.month}
								onChange={value => setMonth(value)}
							/>
							<SelectControl
								label={__('Day', 'maxi-blocks')}
								value={day}
								options={DateOptions.day}
								onChange={value => setDay(value)}
							/>
							<SelectControl
								label={__('Weekday', 'maxi-blocks')}
								value={weekday}
								options={DateOptions.weekday}
								onChange={value => setWeekday(value)}
							/>
						</>
					)}
					{linkStatus === 'time' && (
						<>
							<SelectControl
								label={__('hour12', 'maxi-blocks')}
								value={hour12}
								options={DateOptions.hour12}
								onChange={value => setHour12(value)}
							/>
							<SelectControl
								label={__('Hour', 'maxi-blocks')}
								value={hour}
								options={DateOptions.hour}
								onChange={value => setHour(value)}
							/>
							<SelectControl
								label={__('Minute', 'maxi-blocks')}
								value={minute}
								options={DateOptions.minute}
								onChange={value => setMinute(value)}
							/>
							<SelectControl
								label={__('Second', 'maxi-blocks')}
								value={second}
								options={DateOptions.second}
								onChange={value => setSecond(value)}
							/>
						</>
					)}
					{linkStatus === 'zone' && (
						<>
							<SelectControl
								label={__('Zone', 'maxi-blocks')}
								value={zone}
								options={DateOptions.zone}
								onChange={value => setZone(value)}
							/>
							<SelectControl
								label={__('Timezone', 'maxi-blocks')}
								value={timeZone}
								options={DateOptions.timeZone}
								onChange={value => setTimeZone(value)}
							/>
							<SelectControl
								label={__('Timezone Name', 'maxi-blocks')}
								value={timeZoneName}
								options={DateOptions.timeZoneName}
								onChange={value => setTimeZoneName(value)}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default DateFormatting;
