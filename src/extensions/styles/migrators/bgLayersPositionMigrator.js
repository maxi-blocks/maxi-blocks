/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const name = 'Background layers position';

const maxiVersions = [
	'0.1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
];

const getAttributesToMigrate = (type, attributeKeys) =>
	attributeKeys.map(key => `background-${type}-wrapper-${key}-general`);

const getIsLayerToMigrate = (layer, transformTranslate) =>
	isEmpty(transformTranslate?.[`_${layer.id}`]) &&
	getAttributesToMigrate(layer.type, ['width-unit', 'height-unit']).every(
		key => {
			const value = layer[key.replace('-unit', '')];
			const unitValue = layer[key];
			return value === 100 && unitValue === '%';
		}
	) &&
	getAttributesToMigrate(layer.type, [
		'position-top-unit',
		'position-right-unit',
		'position-bottom-unit',
		'position-left-unit',
	]).every(key => {
		const value = layer[key.replace('-unit', '')];
		const unitValue = layer[key];

		return isNil(value) && unitValue === 'px';
	});

const isEligible = blockAttributes => {
	const {
		'background-layers': bgLayers,
		'background-layers-hover': bgLayersHover,
		'transform-translate-general': transformTranslate,
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return (
		(maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin) &&
		[bgLayers, bgLayersHover].some(bgLayer =>
			bgLayer?.some(layer =>
				getIsLayerToMigrate(layer, transformTranslate)
			)
		)
	);
};

const migrate = newAttributes => {
	const {
		'background-layers': bgLayers,
		'background-layers-hover': bgLayersHover,
		'transform-translate-general': transformTranslate,
	} = newAttributes;

	[bgLayers, bgLayersHover].forEach(bgLayer =>
		bgLayer?.forEach(layer => {
			if (!getIsLayerToMigrate(layer, transformTranslate)) return;

			getAttributesToMigrate(layer.type, [
				'position-top-unit',
				'position-left-unit',
				'position-sync',
			]).forEach(key => {
				const isSync = key.includes('sync');
				if (isSync) {
					layer[key] = 'none';
					return;
				}

				const valueKey = key.replace('-unit', '');
				layer[valueKey] = '50';
				layer[key] = '%';
			});

			newAttributes['transform-translate-general'] = {
				...(newAttributes['transform-translate-general'] || {}),
				[`_${layer.id}`]: {
					...(newAttributes['transform-translate-general']?.[
						`_${layer.id}`
					] || {}),
					...(layer.isHover ? { 'hover-status': true } : {}),
					[layer.isHover ? 'hover' : 'normal']: {
						x: -50,
						y: -50,
						'x-unit': '%',
						'y-unit': '%',
					},
				},
			};
		})
	);

	return newAttributes;
};

export default { name, isEligible, migrate };
