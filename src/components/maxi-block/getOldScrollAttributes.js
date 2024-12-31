/**
 * Internal dependencies
 */
import { scrollTypes } from '@extensions/styles/defaults/scroll';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

const getOldScrollAttributes = attributes => {
	const scroll = {};

	/**
	 * To support old scroll attributes before migration
	 */
	const maxiVersions = [
		'0.1',
		'0.0.1-SC1',
		'0.0.1-SC2',
		'0.0.1-SC3',
		'0.0.1-SC4',
		'0.0.1-SC5',
		'0.0.1-SC6',
		'1.0.0-RC1',
		'1.0.0-RC2',
		'1.0.0-beta',
		'1.0.0-beta-2',
		'wp-directory-beta-1',
		'1.0.0',
		'1.0.1',
		'1.1.0',
		'1.1.1',
		'1.2.0',
		'1.2.1',
		'1.3',
		'1.3.1',
		'1.4.1',
		'1.4.2',
		'1.5.0',
		'1.5.1',
		'1.5.2',
		'1.5.3',
		'1.5.4',
		'1.5.5',
		'1.5.6',
		'1.5.7',
		'1.5.8',
		'1.6.0',
		'1.6.1',
		'1.7.0',
	];

	if (
		!attributes['maxi-version-origin'] ||
		maxiVersions.includes(attributes['maxi-version-current'])
	) {
		const scrollSettingsShared = [
			'speed',
			'delay',
			'easing',
			'viewport-top',
			'status-reverse',
		];

		const scrollSettingsVerticalAndHorizontal = [
			...scrollSettingsShared,
			'offset-start',
			'offset-mid',
			'offset-end',
		];

		const scrollSettingsRotate = [
			...scrollSettingsShared,
			'rotate-start',
			'rotate-mid',
			'rotate-end',
		];

		const scrollSettingsFade = [
			...scrollSettingsShared,
			'opacity-start',
			'opacity-mid',
			'opacity-end',
		];

		const scrollSettingsBlur = [
			...scrollSettingsShared,
			'blur-start',
			'blur-mid',
			'blur-end',
		];

		const scrollSettingsScale = [
			...scrollSettingsShared,
			'scale-start',
			'scale-mid',
			'scale-end',
		];

		const dataScrollTypeValue = () => {
			const enabledScrolls = [];
			scrollTypes.forEach(type => {
				if (attributes[`scroll-${type}-status-general`])
					enabledScrolls.push(type);
			});
			return enabledScrolls;
		};

		const rawEnabledScrolls = dataScrollTypeValue();
		const enabledScrolls = [];

		if (!isEmpty(rawEnabledScrolls)) {
			for (const type of rawEnabledScrolls) {
				let responseString = '';
				let scrollSettings;

				switch (type) {
					case 'vertical':
						scrollSettings = scrollSettingsVerticalAndHorizontal;
						break;
					case 'horizontal':
						scrollSettings = scrollSettingsVerticalAndHorizontal;
						break;
					case 'rotate':
						scrollSettings = scrollSettingsRotate;
						break;
					case 'fade':
						scrollSettings = scrollSettingsFade;
						break;
					case 'blur':
						scrollSettings = scrollSettingsBlur;
						break;
					case 'scale':
						scrollSettings = scrollSettingsScale;
						break;
					default:
						break;
				}

				if (!isNil(scrollSettings)) {
					let isOldScrollAttributes = true;

					for (const setting of scrollSettings) {
						const scrollSettingValue =
							attributes[`scroll-${type}-${setting}-general`];

						if (isNil(scrollSettingValue)) {
							isOldScrollAttributes = false;
							break;
						}

						responseString += `${scrollSettingValue} `;
					}

					if (isOldScrollAttributes && !isEmpty(responseString)) {
						enabledScrolls.push(type);
						scroll[`data-scroll-effect-${type}-general`] =
							responseString.trim();
					}
				}
			}

			if (!isEmpty(enabledScrolls))
				scroll['data-scroll-effect-type'] = enabledScrolls.join(' ');
		}
	}

	return scroll;
};

export default getOldScrollAttributes;
