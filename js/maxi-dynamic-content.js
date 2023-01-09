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
		const elements = maxiDynamicContent[0];
		// eslint-disable-next-line no-undef
		const restUrl = maxiDynamicContent[1];

		if (!elements || !restUrl) return null;

		const response = {};

		const getRESTContent = async (type, id, field) => {
			let response = '';
			console.log(`${restUrl}wp/v2/${type}/${id}?&_fields=${field}`);
			await apiFetch({
				path: `${restUrl}wp/v2/${type}/${id}?&_fields=${field}`,
			})
				.catch(err => console.error(err))
				.then(result => {
					if (!result) return null;
					switch (field) {
						case 'date':
							response = result?.[field];
							break;

						default:
							response = result?.[field]?.rendered;
					}
				});

			return response;
		};

		async function getContent(elementId, elementSettings) {
			const type = elementSettings['dc-type'];
			const author = elementSettings['dc-author'];
			const relation = elementSettings['dc-relation'];
			const field = elementSettings['dc-field'];
			const id = elementSettings['dc-id'];

			await getRESTContent(type, id, field)
				.catch(err => console.error(err))
				.then(result => {
					document.querySelector(
						`#${elementId} .maxi-text-block__content`
					).innerHTML = result;
				});
		}

		Object.keys(elements).forEach(key => {
			getContent(key, elements[key]);
		});

		return response;
	};
}

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line no-new
	new DynamicContent();
});
