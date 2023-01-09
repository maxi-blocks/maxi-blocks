import apiFetch from '@wordpress/api-fetch';

class DynamicContent {
	constructor() {
		this.dynamicContent = this.getElements();
		this.init();
	}

	init() {
		// eslint-disable-next-line @wordpress/no-global-event-listener
		document.addEventListener('DOMContentLoaded', [
			this.getElements.bind(this),
		]);
	}

	getElements = () => {
		// eslint-disable-next-line no-undef
		if (!maxiDynamicContent) return null;

		console.log(maxiDynamicContent);

		// eslint-disable-next-line no-undef
		const elements = Array.from(maxiDynamicContent[0]);
		// eslint-disable-next-line no-undef
		const restUrl = maxiDynamicContent[1];

		if (!elements || !restUrl) return null;

		const response = {};

		const getTitle = async (type, id) => {
			let response = '';
			await apiFetch({
				path: `${restUrl}wp/v2/${type}/${id}?&_fields=title`,
			})
				.catch(err => console.error(err))
				.then(result => {
					if (!result) return null;
					response = result?.title?.rendered;
				});

			return response;
		};

		async function getContent(element) {
			const dcType = element?.getAttribute('data-dynamic-content');
			const dcTypeArray = dcType?.trim()?.split(' ');

			const type = dcTypeArray[0];
			const author = dcTypeArray[1];
			const relation = dcTypeArray[2];
			const id = dcTypeArray[3];

			await getTitle(type, id)
				.catch(err => console.error(err))
				.then(result => {
					element.innerHTML = result;
				});
		}

		elements.forEach(element => {
			// getContent(element);
			// dcTypeArray.forEach(element => {
			// 	// response[id][type] = this.getScrollData(element, type);
			// });
		});

		return response;
	};
}

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line no-new
	new DynamicContent();
});
