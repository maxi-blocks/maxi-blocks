/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import SelectControl from '../../select-control';
import SettingTabsControl from '../../setting-tabs-control';
import TextControl from '../../text-control';
import ToggleSwitch from '../../toggle-switch';
import DateOptions from './constants';
import InfoBox from '../../info-box';

/**
 * Styles & Icons
 */
import './editor.scss';

const DateHelperPopover = () => (
	<Popover className='maxi-date-helper-popover maxi-popover-button'>
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
			<b>{__('Y', 'maxi-blocks')}</b> -{__('full year', 'maxi-blocks')}
		</p>
		<p>
			<b>{__('t', 'maxi-blocks')}</b> -{__('time', 'maxi-blocks')}
		</p>
	</Popover>
);

const DateFormatting = props => {
	const { allowCustomDate, onChange } = props;

	const [showHelp, setShowHelp] = useState(false);
	const [linkStatus, setLinkStatus] = useState('year');

	const {
		dc_cd: customDate,
		dc_da: day,
		dc_era: era,
		dc_fo: format,
		dc_hou: hour,
		dc_h12: hour12,
		dc_min: minute,
		dc_mo: month,
		dc_sec: second,
		dc_loc: locale,
		dc_tz: timeZone,
		dc_tzn: timeZoneName,
		dc_wd: weekday,
		dc_y: year,
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
				changeProps({ dc_fo: str });
			}
		}
	};

	return (
		<div className='maxi-custom-date-formatting'>
			{showHelp && <DateHelperPopover />}
			<ToggleSwitch
				label={__('Custom date', 'maxi-blocks')}
				selected={customDate}
				onChange={value => changeProps({ dc_cd: value })}
			/>
			{!customDate && (
				<div className='maxi-custom-date-formatting__help-trigger'>
					<div
						className='maxi-custom-date-formatting__help-icon'
						onClick={() => setShowHelp(state => !state)}
					>
						<span className='maxi-custom-date-formatting__help-icon-span'>
							i
						</span>
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
			{customDate && (
				<>
					{allowCustomDate && (
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
										onChange={value =>
											changeProps({ dc_era: value })
										}
									/>
									<SelectControl
										label={__('Years', 'maxi-blocks')}
										value={year}
										options={DateOptions.year}
										onChange={value =>
											changeProps({ dc_y: value })
										}
									/>
									<SelectControl
										label={__('Month', 'maxi-blocks')}
										value={month}
										options={DateOptions.month}
										onChange={value =>
											changeProps({ dc_mo: value })
										}
									/>
									<SelectControl
										label={__('Day', 'maxi-blocks')}
										value={day}
										options={DateOptions.day}
										onChange={value =>
											changeProps({ dc_da: value })
										}
									/>
									<SelectControl
										label={__('Weekday', 'maxi-blocks')}
										value={weekday}
										options={DateOptions.weekday}
										onChange={value =>
											changeProps({ dc_wd: value })
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
											changeProps({ dc_h12: value })
										}
									/>
									<SelectControl
										label={__('Hour', 'maxi-blocks')}
										value={hour}
										options={DateOptions.hour}
										onChange={value =>
											changeProps({ dc_hou: value })
										}
									/>
									<SelectControl
										label={__('Minute', 'maxi-blocks')}
										value={minute}
										options={DateOptions.minute}
										onChange={value =>
											changeProps({ dc_min: value })
										}
									/>
									<SelectControl
										label={__('Second', 'maxi-blocks')}
										value={second}
										options={DateOptions.second}
										onChange={value =>
											changeProps({ dc_sec: value })
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
											changeProps({ dc_loc: value })
										}
									/>
									<SelectControl
										label={__('Timezone', 'maxi-blocks')}
										value={timeZone}
										options={DateOptions.timeZone}
										onChange={value =>
											changeProps({
												dc_tz: value,
											})
										}
									/>
									<SelectControl
										label={__(
											'Timezone name',
											'maxi-blocks'
										)}
										value={timeZoneName}
										options={DateOptions.timeZoneName}
										onChange={value =>
											changeProps({
												dc_tzn: value,
											})
										}
									/>
								</>
							)}
						</>
					)}
					{!allowCustomDate && (
						<InfoBox
							key='maxi-custom-date-formatting__custom-date-warning'
							message={__(
								'To modify custom date, use the panel settings',
								'maxi-blocks'
							)}
							links={[
								{
									title: __('Dynamic content', 'maxi-blocks'),
									panel: 'dynamic content',
								},
							]}
							tab={1}
						/>
					)}{' '}
				</>
			)}
		</div>
	);
};

export default DateFormatting;
