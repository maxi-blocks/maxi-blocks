/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import moment from 'moment';

class DynamicContent {
	constructor() {
		this.dynamicContent = this.processDynamicContent();
		this.init();
	}

	init() {
		document.addEventListener('DOMContentLoaded', [
			this.processDynamicContent.bind(this),
		]);
	}

	// eslint-disable-next-line class-methods-use-this
	processDynamicContent = () => {
		// eslint-disable-next-line no-undef
		if (!maxiDynamicContent) return null;
		// eslint-disable-next-line no-undef
		const elements = maxiDynamicContent[0];
		// eslint-disable-next-line no-undef
		const restUrl = maxiDynamicContent[1];

		if (!elements || !restUrl) return null;

		const response = {};

		const formatOptions = props => {
			const {
				dayType,
				eraType,
				hourType,
				isHour12,
				minuteType,
				monthType,
				secondType,
				timeZone,
				timeZoneName,
				weekdayType,
				yearType,
			} = props;

			return {
				day: dayType === 'undefined' ? undefined : dayType,
				era: eraType === 'undefined' ? undefined : eraType,
				hour: hourType === 'undefined' ? undefined : hourType,
				hour12:
					isHour12 === 'false'
						? false
						: isHour12 === 'true'
						? true
						: isHour12,
				minute: minuteType === 'undefined' ? undefined : minuteType,
				month: monthType === 'undefined' ? undefined : monthType,
				second: secondType === 'undefined' ? undefined : secondType,
				timeZone: timeZone === 'undefined' ? undefined : timeZone,
				timeZoneName:
					timeZoneName === 'undefined' ? undefined : timeZoneName,
				weekday: weekdayType === 'undefined' ? undefined : weekdayType,
				year: yearType === 'undefined' ? undefined : yearType,
			};
		};

		const getRESTContent = async dc => {
			const type = dc['dc-type'];
			const author = dc['dc-author'];
			const relation = dc['dc-relation'];
			const field = dc['dc-field'];
			const id = dc['dc-id'];
			const isCustomDate = dc['dc-custom-date'];
			const eraType = dc['dc-era'];
			const yearType = dc['dc-year'];
			const monthType = dc['dc-month'];
			const weekdayType = dc['dc-weekday'];
			const dayType = dc['dc-day'];
			const hourType = dc['dc-hour'];
			const minuteType = dc['dc-minute'];
			const secondType = dc['dc-second'];
			const isHour12 = dc['dc-hour12'];
			const dateFormat = dc['dc-format'];
			const timeZoneName = dc['dc-timezone-name'];
			const timeZone = dc['dc-timezone'];
			const show = dc['dc-show'];

			const relationTypes = [
				'posts',
				'pages',
				'media',
				'categories',
				'tags',
				'users',
			];

			const options = formatOptions({
				dayType,
				eraType,
				hourType,
				isHour12,
				minuteType,
				monthType,
				secondType,
				timeZone,
				timeZoneName,
				weekdayType,
				yearType,
			});

			const getForRelation = () => {
				switch (relation) {
					case 'date':
					case 'modified':
						if (!['previous', 'next'].includes(show)) {
							return `${restUrl}wp/v2/${type}?orderby=${relation}&per_page=1&_fields=${field},id`;
						}
						return `${restUrl}wp/v2/${type}/${id}?_fields=${field}`;
					case 'random':
						return `${restUrl}wp/v2/${type}?orderby=rand&per_page=1&_fields=${field}`;
					default:
						return `${restUrl}wp/v2/${type}/${id}?_fields=${field}`;
				}
			};

			const getUrlByRelation = () => {
				if (field === 'author')
					return `${restUrl}maxi-blocks/v1.0/dc?type=author&field=${id}`;
				switch (type) {
					case relationTypes.includes(type) ? type : false:
						return getForRelation();
					case 'users':
						return `${restUrl}wp/v2/${type}/${
							author.current ? author.current : id
						}/?_fields=${field}`;
					case 'settings':
						return `${restUrl}maxi-blocks/v1.0/dc?type=${type}&field=${field}`;
					default:
						return `${restUrl}wp/v2/${type}?_fields=${field}`;
				}
			};

			const processDate = dateValue => {
				const NewDate = new Date(dateValue);
				let content;
				let newFormat;
				if (!isCustomDate) {
					newFormat = dateFormat
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
					console.log(NewDate.toLocaleString('en'));
					console.log(NewDate.toLocaleString('en-US'));
					console.log(NewDate.toLocaleString('en-GB'));
					content = NewDate.toLocaleString(timeZone, options);
				}
				return content;
			};

			let response = '';
			const path = getUrlByRelation();

			await apiFetch({
				path,
			})
				.catch(err => console.error(err))
				.then(result => {
					if (field === 'date') {
						response = processDate(result?.[field]);
					} else if (relation === 'random') {
						response =
							result?.[0]?.[field]?.rendered ??
							result?.[0]?.[field];
					} else
						response = result?.[field]?.rendered ?? result?.[field];
				});

			return response;
		};

		async function getDynamicContentPerBlock(elementId, elementSettings) {
			await getRESTContent(elementSettings)
				.catch(err => console.error(err))
				.then(result => {
					if (result) {
						const element = document.querySelector(
							`#${elementId} .maxi-text-block__content`
						);

						const currentHTML = element.innerHTML;

						if (currentHTML !== result) element.innerHTML = result;

						element.classList.remove(
							'maxi-text-block__dynamic_content__is-rendering'
						);
					}
				});
		}

		Object.keys(elements).forEach(key => {
			getDynamicContentPerBlock(key, elements[key]);
		});

		return response;
	};
}

window.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line no-new
	new DynamicContent();
});
