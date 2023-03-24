import moment from 'moment';

export const formatDateOptions = props => {
	const {
		'dc-day': day,
		'dc-era': era,
		'dc-hour': hour,
		'dc-hour12': hour12,
		'dc-minute': minute,
		'dc-month': month,
		'dc-second': second,
		'dc-timezone': timeZone,
		'dc-timezone-name': timeZoneName,
		'dc-weekday': weekday,
		'dc-year': year,
	} = props;

	return {
		day: day === 'none' ? undefined : day,
		era: era === 'none' ? undefined : era,
		hour: hour === 'none' ? undefined : hour,
		hour12: hour12 === 'false' ? false : hour12 === 'true' ? true : hour12,
		minute: minute === 'none' ? undefined : minute,
		month: month === 'none' ? undefined : month,
		second: second === 'none' ? undefined : second,
		timeZone: timeZone === 'none' ? 'UTC' : timeZone,
		timeZoneName: timeZoneName === 'none' ? undefined : timeZoneName,
		weekday: weekday === 'none' ? undefined : weekday,
		year: year === 'none' ? undefined : year,
	};
};

const processDCDate = (dateValue, isCustomDate, format, locale, options) => {
	const NewDate = new Date(dateValue);

	let content;
	let newFormat;

	if (!isCustomDate) {
		newFormat = format
			.replace(/DV/g, 'x')
			.replace(/DS/g, 'z')
			.replace(/MS/g, 'c');
		const map = {
			z: 'ddd',
			x: 'dd',
			c: 'MMM',
			d: 'D',
			D: 'dddd',
			m: 'MM',
			M: 'MMMM',
			y: 'YY',
			Y: 'YYYY',
			t: 'HH:MM:SS',
		};
		newFormat = newFormat.replace(/[xzcdDmMyYt]/g, m => map[m]);
		content = moment(NewDate).format(newFormat);
	} else {
		content = NewDate.toLocaleString(locale, options);
	}
	return content;
};

export default processDCDate;
