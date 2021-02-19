/**
 * Controls
 */
const controls = {
	async RECEIVE_CLOUD_LIBRARY({ objType }) {
		return fetch(
			`http://localhost:8080/maxiblocks/wp-json/maxi-blocks-API/v0.1/${objType}/simple`
		)
			.then(response => response.json())
			.then(data => data)
			.catch(err => {
				console.error(
					`The plugin didn't receive the data from the server. If you're one of the super devs of Maxi, is possible the Cloud Library API is empty. Anyway, the error: ${err}`
				);
				return [];
			});
	},
};

export default controls;
