import { isEmpty, isNil } from 'lodash';

const motionData = props => {
	const response = {};
	const { attributes } = props;

	const motionSettings = [
		'speed',
		'direction',
		'easing',
		'offset-start',
		'offset-middle',
		'offset-end',
		'viewport-bottom',
		'viewport-middle',
		'viewport-top',
	];

	const motionTypes = [
		'vertical',
		'horizontal',
		'rotate',
		'scale',
		'fade',
		'blur',
	];

	const dataMotionTypeValue = () => {
		let responseString = '';
		motionTypes.map(type => {
			if (attributes[`motion-status-${type}-general`])
				responseString += `${type} `;

			return null;
		});

		return responseString.trim();
	};

	const enabledMotions = dataMotionTypeValue();

	if (enabledMotions !== '') {
		response['data-motion-type'] = enabledMotions;

		motionTypes.map(type => {
			if (enabledMotions.includes(type)) {
				response[`data-motion-${type}-general`] = '';

				motionSettings.map(setting => {
					const motionSettingValue =
						attributes[`motion-${setting}-${type}-general`];
					// console.log(
					// 	`motion-${setting}-${type}-general: ${
					// 		attributes[`motion-${setting}-${type}-general`]
					// 	}`
					// );
					if (attributes[`motion-${setting}-${type}-general`]) {
						response[
							`data-motion-${type}-general`
						] += `${motionSettingValue} `;
					} else response[`data-motion-${type}-general`] += '0 ';

					return null;
				});
				if (response[`data-motion-${type}-general`])
					response[`data-motion-${type}-general`].trim();
			}

			return null;
		});

		return response;
	}
	return response;
};

export default motionData;
