/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import SelectControl from '../../../select-control';
import SettingTabsControl from '../../../setting-tabs-control';
import TextControl from '../../../text-control';
import ToggleSwitch from '../../../toggle-switch';
import { DateOptions } from './utils';

/**
 * External dependencies
 */

/**
 * Styles & Icons
 */
import './editor.scss';

export const formatOptions = props => {
	const {
		day,
		era,
		hour,
		hour12,
		minute,
		month,
		second,
		timeZone,
		timeZoneName,
		weekday,
		year,
	} = props;

	return {
		day: day === 'undefined' ? undefined : day,
		era: era === 'undefined' ? undefined : era,
		hour: hour === 'undefined' ? undefined : hour,
		hour12: hour12 === 'false' ? false : hour12 === 'true' ? true : hour12,
		minute: minute === 'undefined' ? undefined : minute,
		month: month === 'undefined' ? undefined : month,
		second: second === 'undefined' ? undefined : second,
		timeZone: timeZone === 'undefined' ? undefined : timeZone,
		timeZoneName: timeZoneName === 'undefined' ? undefined : timeZoneName,
		weekday: weekday === 'undefined' ? undefined : weekday,
		year: year === 'undefined' ? undefined : year,
	};
};

const DateFormatting = props => {
	const contentRef = useRef(props.content);

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
		const length = [
			'd',
			'D',
			'dd',
			'dD',
			'Dd',
			'DD',
			'm',
			'M',
			'mm',
			'mM',
			'Mm',
			'MM',
			't',
			'y',
			'Y',
			'yy',
			'yY',
			'Yy',
			'YY',
		].reduce((acc, cur) => {
			acc[cur] = str.split(cur).length - 1;
			return acc;
		}, {});

		if (
			length.dd === 0 &&
			length.dD === 0 &&
			length.Dd === 0 &&
			length.DD === 0 &&
			length.mm === 0 &&
			length.mM === 0 &&
			length.Mm === 0 &&
			length.MM === 0 &&
			length.yy === 0 &&
			length.yY === 0 &&
			length.Yy === 0 &&
			length.YY === 0 &&
			length.d + length.D < 4 &&
			length.m + length.M < 4 &&
			length.t < 2 &&
			length.y + length.Y < 4
		) {
			const word = '([dDmMyYt]{0,1}|MS{0,1}|DS{0,1}|DV{0,1})';
			const interWord = '(\\s{0,1})([-,\\.\\/]{0,3})(\\s{0,1})';
			const regex = new RegExp(
				`^\\s{0,1}${word}${interWord}${word}${interWord}${word}${interWord}${word}${interWord}${word}$`
			);
			if (regex.test(str)) {
				setFormat(str);
			}
		}
	};

	const dateFormat = value => {
		const options = formatOptions({
			day,
			era,
			hour,
			hour12,
			minute,
			month,
			second,
			timeZone,
			timeZoneName,
			weekday,
			year,
		});

		const data = {
			format,
			options,
			status,
			zone,
		};

		if (value) {
			const NewDate = new Date(value);
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
				<Popover
					className='date-popover maxi-popover-button'
					position='top right'
				>
					<p>
						<b>{__('d', 'maxi-blocks')}</b> -
						{__('day in numeric format', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('D', 'maxi-blocks')}</b> -
						{__('day in text format', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('DS', 'maxi-blocks')}</b> -
						{__('day in text format, short', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('DV', 'maxi-blocks')}</b> -
						{__('day in text format, very short', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('m', 'maxi-blocks')}</b> -
						{__('month in numeric format', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('M', 'maxi-blocks')}</b> -
						{__('month in text format', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('MS', 'maxi-blocks')}</b> -
						{__('month in text format, short', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('y', 'maxi-blocks')}</b> -
						{__('year in short format', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('Y', 'maxi-blocks')}</b> -
						{__('full year', 'maxi-blocks')}
					</p>
					<p>
						<b>{__('t', 'maxi-blocks')}</b> -
						{__('time', 'maxi-blocks')}
					</p>
				</Popover>
			)}
			<ToggleSwitch
				label={__(
					`${!status ? 'Default' : 'Custom'} date`,
					'maxi-blocks'
				)}
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
						placeholder={__('d.m.Y t', 'maxi-blocks')}
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
								label={__('Format', 'maxi-blocks')}
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
								label={__('Timezone name', 'maxi-blocks')}
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
