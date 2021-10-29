import { isEmpty } from 'lodash';

const motionData = props => {
	const response = {};
	const { attributes } = props;

	const capitalize = string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	const motionSettingsShared = [
		'speed',
		'easing',
		'viewport-bottom',
		'viewport-middle',
		'viewport-top',
	];

	const motionSettingsVertical = [
		...motionSettingsShared,
		'direction',
		'offset-start',
		'offset-middle',
		'offset-end',
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

	return response;
};

export default motionData;
