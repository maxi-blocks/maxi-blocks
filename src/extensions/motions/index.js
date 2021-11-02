import { isEmpty } from 'lodash';

const motionData = props => {
	const response = {};
	const { attributes } = props;

	const motionSettingsShared = [
		'speed',
		'easing',
		'viewport-bottom',
		'viewport-middle',
		'viewport-top',
		'status-reverse',
	];

	const motionSettingsVertical = [
		...motionSettingsShared,
		'offset-start',
		'offset-middle',
		'offset-end',
		'direction',
	];

	const motionSettingsRotate = [
		...motionSettingsShared,
		'rotate-start',
		'rotate-middle',
		'rotate-end',
	];

	const motionSettingsFade = [
		...motionSettingsShared,
		'opacity-start',
		'opacity-middle',
		'opacity-end',
	];

	const motionSettingsBlur = [
		...motionSettingsShared,
		'blur-start',
		'blur-middle',
		'blur-end',
	];

	const motionSettingsScale = [
		...motionSettingsShared,
		'scale-start',
		'scale-middle',
		'scale-end',
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

	if (!isEmpty(enabledMotions)) {
		response['data-motion-type'] = enabledMotions;

		motionTypes.map(type => {
			if (enabledMotions.includes(type)) {
				let responseString = '';
				let motionSettings;

				switch (type) {
					case 'vertical':
						motionSettings = motionSettingsVertical;
						break;
					case 'horizontal':
						motionSettings = motionSettingsVertical;
						break;
					case 'rotate':
						motionSettings = motionSettingsRotate;
						break;
					case 'fade':
						motionSettings = motionSettingsFade;
						break;
					case 'blur':
						motionSettings = motionSettingsBlur;
						break;
					case 'scale':
						motionSettings = motionSettingsScale;
						break;
					default:
						break;
				}

				motionSettings.map(setting => {
					const motionSettingValue =
						attributes[`motion-${setting}-${type}-general`];

					responseString += `${motionSettingValue} `;

					return null;
				});

				if (!isEmpty(responseString))
					response[`data-motion-${type}-general`] =
						responseString.trim();
			}

			return null;
		});

		return response;
	}

	return response;
};

export default motionData;
