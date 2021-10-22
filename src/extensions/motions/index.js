import { isEmpty, cloneDeep } from 'lodash';

const motionData = props => {
	const response = {};
	const { attributes } = props;

	const motionSettingsVertical = [
		'speed',
		'easing',
		'viewport-bottom',
		'viewport-middle',
		'viewport-top',
		'direction',
		'offset-start',
		'offset-middle',
		'offset-end',
	];

	const motionSettingsRotate = [
		'speed',
		'easing',
		'viewport-bottom',
		'viewport-middle',
		'viewport-top',
		'rotate-start',
		'rotate-middle',
		'rotate-end',
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
				let motionSettings;

				switch (type) {
					case 'vertical':
						motionSettings = motionSettingsVertical;
						break;
					case 'rotate':
						motionSettings = motionSettingsRotate;
						break;
					default:
						break;
				}

				motionSettings.map(setting => {
					const motionSettingValue =
						attributes[`motion-${setting}-${type}-general`];
					// console.log(setting);
					// console.log(motionSettingValue);
					// console.log(
					// 	`motion-${setting}-${type}-general: ${
					// 		attributes[`motion-${setting}-${type}-general`]
					// 	}`
					// );
					// if (!isEmpty(motionSettingValue)) {
					response[
						`data-motion-${type}-general`
					] += `${motionSettingValue} `;
					// } else response[`data-motion-${type}-general`] += '0 ';

					// console.log('final response');
					// console.log(response);

					return null;
				});
				if (!isEmpty(response[`data-motion-${type}-general`]))
					response[`data-motion-${type}-general`].trim();
			}

			return null;
		});

		return response;
	}
	return response;
};

export default motionData;
