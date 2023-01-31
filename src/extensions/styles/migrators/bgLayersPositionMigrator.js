/**
 * External dependencies
 */
import { isNil } from 'lodash';

const name = 'Background layers position';

const maxiVersions = [
	'0.1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
];

const getAttributesToMigrate = type =>
	['top', 'left', 'top-unit', 'left-unit', 'sync'].map(
		key => `background-${type}-wrapper-position-${key}-general`
	);

const isEligible = blockAttributes => {
	const {
		'background-layers': bgLayers,
		'background-layers-hover': bgLayersHover,
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return (
		(maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin) &&
		[bgLayers, bgLayersHover].some(bgLayer =>
			bgLayer?.some(layer =>
				getAttributesToMigrate(layer.type).some(key => {
					if (key.includes('sync')) return false;

					const isUnit = key.includes('unit');
					const value = layer[key];

					return isUnit
						? value === 'px' &&
								isNil(layer[key.replace('-unit', '')])
						: isNil(value);
				})
			)
		)
	);
};

const migrate = newAttributes => {
	const {
		'background-layers': bgLayers,
		'background-layers-hover': bgLayersHover,
	} = newAttributes;

	[bgLayers, bgLayersHover].forEach(bgLayer =>
		bgLayer?.forEach(layer =>
			getAttributesToMigrate(layer.type).forEach(key => {
				const isSync = key.includes('sync');
				if (isSync) {
					layer[key] = 'none';
					return;
				}

				const isUnit = key.includes('unit');
				const value = layer[key];

				if (
					isUnit &&
					value === 'px' &&
					isNil(layer[key.replace('-unit', '')])
				) {
					layer[key] = '%';
				} else if (isNil(value)) {
					layer[key] = '50';
				}
			})
		)
	);

	return newAttributes;
};

export default { name, isEligible, migrate };
