/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import {
	limitFormat,
	processDate,
	relationTypes,
	getParametersFirstSeparator,
	getSimpleText,
} from '../src/components/toolbar/components/dynamic-content/utils';
import { formatDateOptions } from '../src/components/toolbar/components/date-formatting/utils';

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

		const getRESTContent = async dc => {
			const type = dc['dc-type'];
			const author = dc['dc-author'];
			const relation = dc['dc-relation'];
			const field = dc['dc-field'];
			const id = dc['dc-id'];
			const isCustomDate = dc['dc-custom-date'];
			const era = dc['dc-era'];
			const year = dc['dc-year'];
			const month = dc['dc-month'];
			const weekday = dc['dc-weekday'];
			const day = dc['dc-day'];
			const hour = dc['dc-hour'];
			const minute = dc['dc-minute'];
			const second = dc['dc-second'];
			const hour12 = dc['dc-hour12'];
			const dateFormat = dc['dc-format'];
			const locale = dc['dc-locale'];
			const timeZoneName = dc['dc-timezone-name'];
			const timeZone = dc['dc-timezone'];
			const show = dc['dc-show'];
			const limit = dc['dc-limit'];

			let response = '';

			const firstSeparator = getParametersFirstSeparator(restUrl);

			const getUrlByRelation = () => {
				switch (relation) {
					case 'date':
					case 'modified':
						if (!['previous', 'next'].includes(show)) {
							return `${restUrl}wp/v2/${type}${firstSeparator}orderby=${relation}&per_page=1&_fields=${field},id`;
						}
						return `${restUrl}wp/v2/${type}/${id}${firstSeparator}_fields=${field}`;
					case 'random':
						return `${restUrl}wp/v2/${type}${firstSeparator}orderby=rand&per_page=1&_fields=${field}`;
					default:
						return `${restUrl}wp/v2/${type}/${id}${firstSeparator}_fields=${field}`;
				}
			};

			const getUrlByType = () => {
				if (field === 'author')
					return `${restUrl}maxi-blocks/v1.0/dc${firstSeparator}type=author&field=${id}`;
				switch (type) {
					case relationTypes.includes(type) ? type : false:
						return getUrlByRelation();
					case 'users':
						return `${restUrl}wp/v2/${type}/${
							author.current ? author.current : id
						}/${firstSeparator}_fields=${field}`;
					case 'settings':
						return `${restUrl}maxi-blocks/v1.0/dc${firstSeparator}type=${type}&field=${field}`;
					default:
						return `${restUrl}wp/v2/${type}${firstSeparator}_fields=${field}`;
				}
			};

			const path = getUrlByType();

			await apiFetch({
				path,
			})
				.catch(err => console.error(err))
				.then(result => {
					const value = result?.[field] || result?.[0]?.[field];

					if (field === 'date') {
						const options = formatDateOptions({
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
						response = processDate(
							value,
							isCustomDate,
							dateFormat,
							locale,
							options
						);
					} else if (field === 'excerpt') {
						response = limitFormat(value?.rendered, limit);
					} else if (field === 'content') {
						response = limitFormat(
							getSimpleText(value?.rendered),
							limit
						);
					} else response = value?.rendered ?? value;
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

						element.innerHTML = result;
						element.classList.remove(
							'maxi-text-block__dynamic_content__is-rendering'
						);
					}
				});
		}

		Object.keys(elements).forEach(key => {
			getDynamicContentPerBlock(key, elements[key]);
		});

		return true;
	};
}

window.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line no-new
	new DynamicContent();
});
