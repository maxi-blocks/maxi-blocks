/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import TextControl from '@components/text-control';

/**
 * Styles & Icons
 */
import './editor.scss';

const DateHelperPopover = () => (
	<Popover className='maxi-info-helper-popover maxi-popover-button'>
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

	const { 'dc-format': format } = props;

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
			const word = '([dDmMyYt]{0,1}|MS{0,1}|DS{0,1})';
			const interWord = '(\\s{0,1})([-,\\.\\/]{0,3})(\\s{0,1})';
			const regex = new RegExp(
				`^\\s{0,1}${word}${interWord}${word}${interWord}${word}${interWord}${word}$`
			);
			if (regex.test(str)) {
				changeProps({ 'dc-format': str });
			}
		}
	};

	return (
		<div className='maxi-info'>
			<div className='maxi-info__help-trigger'>
				<TextControl
					label={__('Date format', 'maxi-blocks')}
					help={false}
					placeholder={__('d.m.Y t', 'maxi-blocks')}
					value={format}
					onChange={val => validateAnchor(val)}
					showHelp
					helpContent={<DateHelperPopover />}
					autoComplete='off'
				/>
			</div>
		</div>
	);
};

export default DateFormatting;
