import { isEmpty } from 'lodash';

const motionData = props => {
	const response = {};
	const { attributes } = props;

	const motionSettingsShared = [
		'speed',
		'delay',
		'easing',
		'viewport-top',
		'status-reverse',
	];

	const motionSettingsVertical = [
		...motionSettingsShared,
		'offset-start',
		'offset-mid',
		'offset-end',
	];

	const motionSettingsRotate = [
		...motionSettingsShared,
		'rotate-start',
		'rotate-mid',
		'rotate-end',
	];

	const motionSettingsFade = [
		...motionSettingsShared,
		'opacity-start',
		'opacity-mid',
		'opacity-end',
	];

	const motionSettingsBlur = [
		...motionSettingsShared,
		'blur-start',
		'blur-mid',
		'blur-end',
	];

	const motionSettingsScale = [
		...motionSettingsShared,
		'scale-start',
		'scale-mid',
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
		response['data-scroll-effect-type'] = enabledMotions;

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
					response[`data-scroll-effect-${type}-general`] =
						responseString.trim();
			}

			return null;
		});

		return response;
	}

	return response;
};

export default motionData;
