/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const SelectControl = loadable(() => import('../../select-control'));
const SettingTabsControl = loadable(() => import('../../setting-tabs-control'));
const TextControl = loadable(() => import('../../text-control'));
const DateOptions = loadable(() => import('./constants'));

/**
 * Styles & Icons
 */
import './editor.scss';

const DateHelperPopover = () => (
	<Popover className='maxi-date-helper-popover maxi-popover-button'>
		<p>
			<b>d - </b>
			{__('day in numeric format', 'maxi-blocks')}
		</p>
		<p>
			<b>D - </b>
			{__('day in text format', 'maxi-blocks')}
		</p>
		<p>
			<b>DS - </b>
			{__('day in text format, short', 'maxi-blocks')}
		</p>
		<p>
			<b>DV - </b>
			{__('day in text format, very short', 'maxi-blocks')}
		</p>
		<p>
			<b>m - </b>
			{__('month in numeric format', 'maxi-blocks')}
		</p>
		<p>
			<b>M - </b>
			{__('month in text format', 'maxi-blocks')}
		</p>
		<p>
			<b>MS - </b>
			{__('month in text format, short', 'maxi-blocks')}
		</p>
		<p>
			<b>y - </b>
			{__('year in short format', 'maxi-blocks')}
		</p>
		<p>
			<b>Y - </b>
			{__('full year', 'maxi-blocks')}
		</p>
		<p>
			<b>t - </b>
			{__('time', 'maxi-blocks')}
		</p>
	</Popover>
);

const DateFormatting = props => {
	const { onChange } = props;

	const [showHelp, setShowHelp] = useState(false);
	const [linkStatus, setLinkStatus] = useState('year');

	const {
		'dc-custom-date': customDate,
		'dc-day': day,
		'dc-era': era,
		'dc-format': format,
		'dc-hour': hour,
		'dc-hour12': hour12,
		'dc-minute': minute,
		'dc-month': month,
		'dc-second': second,
		'dc-locale': locale,
		'dc-timezone': timeZone,
		'dc-timezone-name': timeZoneName,
		'dc-weekday': weekday,
		'dc-year': year,
	} = props;

	const changeProps = params => {
		const hasChangesToSave = Object.entries(props).some(([key, val]) => {
			if (!(key in params)) return false;

			return params[key] !== val;
		});

		if (hasChangesToSave) onChange(params);
	};

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
				changeProps({ 'dc-format': str });
			}
		}
	};

	return (
		<div className='maxi-custom-date-formatting'>
			{showHelp && <DateHelperPopover />}
			{/* Hide custom date until we figure out moment.parseFormat for other languages */}
			{/* <ToggleSwitch
				label={__('Custom date', 'maxi-blocks')}
				selected={customDate}
				onChange={value => changeProps({ 'dc-custom-date': value })}
			/> */}
			{!customDate && (
				<div className='maxi-custom-date-formatting__help-trigger'>
					<TextControl
						label={__('Date format', 'maxi-blocks')}
						help={false}
						placeholder={__('d.m.Y t', 'maxi-blocks')}
						value={format}
						onChange={val => validateAnchor(val)}
					/>
					<div
						className='maxi-custom-date-formatting__help-icon'
						onClick={() => setShowHelp(state => !state)}
					>
						<span className='maxi-custom-date-formatting__help-icon-span'>
							i
						</span>
					</div>
				</div>
			)}
			{customDate && (
				<>
					<SettingTabsControl
						type='buttons'
						fullWidthMode
						selected={linkStatus}
						hasBorder
						items={[
							{
								label: __('Date', 'maxi-blocks'),
								value: 'year',
							},
							{
								label: __('Time', 'maxi-blocks'),
								value: 'time',
							},
							{
								label: __('Zone', 'maxi-blocks'),
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
								onChange={value =>
									changeProps({ 'dc-era': value })
								}
							/>
							<SelectControl
								label={__('Years', 'maxi-blocks')}
								value={year}
								options={DateOptions.year}
								onChange={value =>
									changeProps({ 'dc-year': value })
								}
							/>
							<SelectControl
								label={__('Month', 'maxi-blocks')}
								value={month}
								options={DateOptions.month}
								onChange={value =>
									changeProps({ 'dc-month': value })
								}
							/>
							<SelectControl
								label={__('Day', 'maxi-blocks')}
								value={day}
								options={DateOptions.day}
								onChange={value =>
									changeProps({ 'dc-day': value })
								}
							/>
							<SelectControl
								label={__('Weekday', 'maxi-blocks')}
								value={weekday}
								options={DateOptions.weekday}
								onChange={value =>
									changeProps({ 'dc-weekday': value })
								}
							/>
						</>
					)}
					{linkStatus === 'time' && (
						<>
							<SelectControl
								label={__('Format', 'maxi-blocks')}
								value={hour12}
								options={DateOptions.hour12}
								onChange={value =>
									changeProps({ 'dc-hour12': value })
								}
							/>
							<SelectControl
								label={__('Hour', 'maxi-blocks')}
								value={hour}
								options={DateOptions.hour}
								onChange={value =>
									changeProps({ 'dc-hour': value })
								}
							/>
							<SelectControl
								label={__('Minute', 'maxi-blocks')}
								value={minute}
								options={DateOptions.minute}
								onChange={value =>
									changeProps({ 'dc-minute': value })
								}
							/>
							<SelectControl
								label={__('Second', 'maxi-blocks')}
								value={second}
								options={DateOptions.second}
								onChange={value =>
									changeProps({ 'dc-second': value })
								}
							/>
						</>
					)}
					{linkStatus === 'zone' && (
						<>
							<SelectControl
								label={__('Locale', 'maxi-blocks')}
								value={locale}
								options={DateOptions.locale}
								onChange={value =>
									changeProps({ 'dc-locale': value })
								}
							/>
							<SelectControl
								label={__('Timezone', 'maxi-blocks')}
								value={timeZone}
								options={DateOptions.timeZone}
								onChange={value =>
									changeProps({
										'dc-timezone': value,
									})
								}
							/>
							<SelectControl
								label={__('Timezone name', 'maxi-blocks')}
								value={timeZoneName}
								options={DateOptions.timeZoneName}
								onChange={value =>
									changeProps({
										'dc-timezone-name': value,
									})
								}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default DateFormatting;
