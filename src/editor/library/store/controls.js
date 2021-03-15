/**
 * WordPress dependencies
 */
const { apiFetch } = wp;

/**
 * External dependencies
 */
import {} from 'lodash';

/**
 * Controls
 */
const controls = {
	async RECEIVE_CLOUD_LIBRARY({ objType, limit = 20 }) {
		const serverURL = await apiFetch({
			path: 'wp/v2/settings',
		}).then(res => {
			const serverURL = res['maxi-blocks-cloud-library-api-server'];
			if (new URL(serverURL)) return serverURL;

			console.error(
				`Ups, seems the server URL you've set is not valid => ${serverURL}. Change it and try again 👍`
			);

			return false;
		});

		if (!serverURL) return [];

		return fetch(
			`${serverURL}/wp-json/maxi-blocks-API/v0.1/${objType}/simple/?num=${limit}`
		)
			.then(response => response.json())
			.then(data => data)
			.catch(err => {
				console.error(
					`RECEIVE_CLOUD_LIBRARY: The plugin didn't receive the data from the server. If you're one of the super devs of Maxi, is possible the Cloud Library API is empty. Anyway, the error: ${err}`
				);
				return false;
			});
	},
	async RECEIVE_CLOUD_INFO() {
		const serverURL = await apiFetch({
			path: 'wp/v2/settings',
		}).then(res => {
			const serverURL = res['maxi-blocks-cloud-library-api-server'];
			if (new URL(serverURL)) return serverURL;

			console.error(
				`Ups, seems the server URL you've set is not valid => ${serverURL}. Change it and try again 👍`
			);

			return false;
		});

		if (!serverURL) return [];

		return fetch(`${serverURL}/wp-json/maxi-blocks-API/v0.1/general_info`)
			.then(response => response.json())
			.then(data => data)
			.catch(err => {
				console.error(
					`RECEIVE_CLOUD_INFO: The plugin didn't receive the data from the server. If you're one of the super devs of Maxi, is possible the Cloud Library API is empty. Anyway, the error: ${err}`
				);
				return false;
			});
	},
	async REQUEST_CLOUD_LIBRARY({ search }) {
		const serverURL = await apiFetch({
			path: 'wp/v2/settings',
		}).then(res => {
			const serverURL = res['maxi-blocks-cloud-library-api-server'];
			if (new URL(serverURL)) return serverURL;

			console.error(
				`Ups, seems the server URL you've set is not valid => ${serverURL}. Change it and try again 👍`
			);

			return false;
		});

		if (!serverURL) return [];

		return fetch(`${serverURL}/wp-json/maxi-blocks-API/v0.1/search`, {
			method: 'POST',
			body: JSON.stringify(search),
		})
			.then(response => response.json())
			.then(data => data)
			.catch(err => {
				console.error(
					`REQUEST_CLOUD_LIBRARY: The plugin didn't receive the data from the server. If you're one of the super devs of Maxi, is possible the Cloud Library API is empty. Anyway, the error: ${err}`
				);
				return false;
			});
	},
	async REQUEST_CLOUD_LIBRARY_NUM({ search }) {
		const serverURL = await apiFetch({
			path: 'wp/v2/settings',
		}).then(res => {
			const serverURL = res['maxi-blocks-cloud-library-api-server'];
			if (new URL(serverURL)) return serverURL;

			console.error(
				`Ups, seems the server URL you've set is not valid => ${serverURL}. Change it and try again 👍`
			);

			return false;
		});

		if (!serverURL) return [];

		return fetch(`${serverURL}/wp-json/maxi-blocks-API/v0.1/search_info`, {
			method: 'POST',
			body: JSON.stringify(search),
		})
			.then(response => response.json())
			.then(data => data)
			.catch(err => {
				console.error(
					`REQUEST_CLOUD_LIBRARY_NUM: The plugin didn't receive the data from the server. If you're one of the super devs of Maxi, is possible the Cloud Library API is empty. Anyway, the error: ${err}`
				);
				return false;
			});
	},
	async RECEIVE_LIBRARY_CAT() {
		const serverURL = await apiFetch({
			path: 'wp/v2/settings',
		}).then(res => {
			const serverURL = res['maxi-blocks-cloud-library-api-server'];
			if (new URL(serverURL)) return serverURL;

			console.error(
				`Ups, seems the server URL you've set is not valid => ${serverURL}. Change it and try again 👍`
			);

			return false;
		});

		if (!serverURL) return false;

		return fetch(
			// the limit is 100, if want more is necessary to do a loop
			`${serverURL}/wp-json/wp/v2/categories/?per_page=100`
		)
			.then(response => response.json())
			.then(data => {
				return data;
			})
			.catch(err => console.error(err));
	},
};

export default controls;
