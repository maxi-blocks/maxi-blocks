import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import SelectControl from '../../../select-control';
import ToggleSwitch from '../../../toggle-switch';
import { DateOptions } from './utils';

const DateFormatting = props => {
	const { content } = props;
	const contentRef = useRef(content);
	const [status, setStatus] = useState(props.status);
	const [weekday, setWeekday] = useState(props.weekday);
	const [year, setYear] = useState(props.year);
	const [month, setMonth] = useState(props.month);
	const [day, setDay] = useState(props.day);
	const [hour, setHour] = useState(props.hour);
	const [minute, setMinute] = useState(props.minute);
	const [second, setSecond] = useState(props.second);
	const [zone, setZone] = useState(props.zone);
	const [timezone, setTimezone] = useState(props.timezone);
	const [timezoneName, setTimezoneName] = useState(props.timezoneName);

	const dateFormat = _value => {
		const options = {
			weekday: weekday,
			year: year,
			month: month,
			day: day,
			hour: hour,
			minute: minute,
			second: second,
		};
		const data = {
			zone: zone,
			options: options,
			status: status,
		};
		if (_value) {
			data.options.weekday = weekday === 'false' ? false : weekday;
			data.options.year = year === 'false' ? false : year;
			data.options.month = month === 'false' ? false : month;
			data.options.day = day === 'false' ? false : day;
			data.options.hour = hour === 'false' ? false : hour;
			data.options.minute = minute === 'false' ? false : minute;
			data.options.second = second === 'false' ? false : second;
			const NewDate = new Date(_value);
			contentRef.current = NewDate.toLocaleString(zone, options);
			data.content = contentRef.current;
		}
		props.parentCallback(data);
	};
	useEffect(
		() => dateFormat(contentRef.current),
		[weekday, year, month, day, hour, minute, second, status]
	);
	return (
		<>
			<ToggleSwitch
				label={__('Date setting', 'maxi-blocks')}
				selected={status}
				onChange={() => setStatus(!status)}
			/>
			{/* <SelectControl
				label={__('Date format', 'maxi-blocks')}
				value={dateRef.current}
				options={DateOptions.params}
				onChange={value => switchOnChange('date', value)}
			/> */}
			{status && (
				<>
					<SelectControl
						label={__('Weekday', 'maxi-blocks')}
						value={weekday}
						options={DateOptions.weekday}
						onChange={value => setWeekday(value)}
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
					<SelectControl
						label={__('Zone', 'maxi-blocks')}
						value={zone}
						options={DateOptions.zone}
						onChange={value => setZone(value)}
					/>
					<SelectControl
						label={__('Timezone', 'maxi-blocks')}
						value={timezone}
						options={DateOptions.timezone}
						onChange={value => setTimezone(value)}
					/>
					<SelectControl
						label={__('Timezone Name', 'maxi-blocks')}
						value={timezoneName}
						options={DateOptions.timezoneName}
						onChange={value => setTimezoneName(value)}
					/>
				</>
			)}
		</>
	);
};

export default DateFormatting;
