/**
 * External dependencies
 */
import { cloneDeep, isEmpty, isNil } from 'lodash';

/**
 * Internal dependencies
 */
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import * as defaultPresets from './defaults';

const preserveExistingIconAttribute = attr =>
	/^icon-(width|height)(-unit|-fit-content)?-/.test(attr);

export const getPresetInlineStyleTargets = ({
	inlineStylesTargets = {},
	presetAttributes = {},
}) => {
	const shouldCleanIcon = Object.entries(presetAttributes).some(
		([key, value]) =>
			key.startsWith('icon-background-active-media') && value === 'none'
	);

	return shouldCleanIcon && inlineStylesTargets.icon
		? [inlineStylesTargets.icon]
		: [];
};

const getPresetAttributes = ({
	attributes,
	getIconWithColor,
	number,
	presets = defaultPresets,
	type = 'normal',
}) => {
	const presetKey = `preset${number}`;
	const newDefaultPresets = cloneDeep({ ...presets });
	const preset = newDefaultPresets[presetKey];

	if (!preset) return {};

	if (type === 'icon' && !isEmpty(attributes['icon-content'])) {
		preset['icon-content'] = attributes['icon-content'];

		if (!isNil(attributes.svgType)) preset.svgType = attributes.svgType;

		Object.entries(attributes).forEach(([key, value]) => {
			if (preserveExistingIconAttribute(key)) preset[key] = value;
		});
	}

	if (
		!isNil(presets[presetKey]['icon-border-style-general-hover']) &&
		presets[presetKey]['icon-border-style-general-hover'] !== 'none'
	) {
		const hoverAttr = getGroupAttributes(
			{ ...preset },
			['border', 'borderWidth', 'borderRadius'],
			true,
			'icon-'
		);

		const nonHoverAttr = getGroupAttributes(
			{ ...preset },
			['border', 'borderWidth', 'borderRadius'],
			false,
			'icon-'
		);

		Object.keys(hoverAttr).forEach(h => {
			if (!h.includes('hover')) delete hoverAttr[h];
		});
		Object.keys(nonHoverAttr).forEach(h => {
			if (h.includes('hover')) delete nonHoverAttr[h];
		});

		newDefaultPresets[presetKey] = {
			...preset,
			...hoverAttr,
		};
	}

	const {
		'icon-stroke-palette-status': strokePaletteStatus,
		'icon-stroke-palette-status-hover': strokePaletteHoverStatus,
		'icon-content': rawIcon,
	} = newDefaultPresets[presetKey];

	let icon = null;

	if (
		rawIcon &&
		getIconWithColor &&
		(strokePaletteStatus || strokePaletteHoverStatus)
	) {
		const {
			'icon-stroke-palette-color': strokePaletteColor,
			'icon-stroke-palette-color-hover': strokePaletteHoverColor,
			'icon-inherit': rawIconInherit,
			'icon-only': rawIconOnly,
		} = newDefaultPresets[presetKey];

		icon = getIconWithColor(attributes, {
			paletteStatus: strokePaletteStatus,
			paletteColor: strokePaletteColor,
			rawIcon,
			isInherit: rawIconInherit,
			isIconOnly: rawIconOnly,
		});

		icon = getIconWithColor(attributes, {
			paletteStatus: strokePaletteHoverStatus,
			paletteColor: strokePaletteHoverColor,
			isHover: true,
			rawIcon: icon,
			isInherit: rawIconInherit,
			isIconOnly: rawIconOnly,
		});
	}

	return {
		...newDefaultPresets[presetKey],
		...(icon && { 'icon-content': icon }),
	};
};

export default getPresetAttributes;
