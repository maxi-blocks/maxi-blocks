import { isEmpty, cloneDeep } from 'lodash';

const motionData = props => {
	const response = {};
	const { attributes } = props;

	console.log(attributes);

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

	const motionSettingsFade = [
		'speed',
		'easing',
		'viewport-bottom',
		'viewport-middle',
		'viewport-top',
		'opacity-start',
		'opacity-middle',
		'opacity-end',
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
		console.log(responseString.trim());
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
					case 'fade':
						motionSettings = motionSettingsFade;
						break;
					default:
						break;
				}

				motionSettings.map(setting => {
					const motionSettingValue =
						attributes[`motion-${setting}-${type}-general`];

					response[
						`data-motion-${type}-general`
					] += `${motionSettingValue} `;

					return null;
				});
				if (!isEmpty(response[`data-motion-${type}-general`]))
					response[`data-motion-${type}-general`].trim();
			}

			return null;
		});

		return response;
	}
	console.log('motions: ');
	console.log(response);
	return response;
};

export default motionData;
