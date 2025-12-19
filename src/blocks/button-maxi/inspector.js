/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useCallback, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, isNil, cloneDeep, without } from 'lodash';

/**
 * Internal dependencies
 */
import AccordionControl from '@components/accordion-control';
import SettingTabsControl from '@components/setting-tabs-control';
import DefaultStylesControl from '@components/default-styles-control';
import Icon from '@components/icon';
import * as defaultPresets from './defaults';
import { getGroupAttributes, getIconWithColor } from '@extensions/styles';
import { ariaLabelsCategories, customCss } from './data';
import * as inspectorTabs from '@components/inspector-tabs';
import { withMaxiInspector } from '@extensions/inspector';

/**
 * Icons
 */
import * as iconPresets from '@maxi-icons/button-presets/index';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes, inlineStylesTargets } =
		props;
	const {
		'icon-only': iconOnly,
		'icon-content': icon,
		'dc-status': dcStatus,
		'dc-link-status': dcLinkStatus,
	} = attributes;
	const { selectors, categories } = customCss;

	const onChangeAriaLabel = useCallback(
		({ obj, target, icon }) => {
			maxiSetAttributes({
				...obj,
				...(target === 'icon' && {
					'icon-content': icon,
				}),
			});
		},
		[maxiSetAttributes]
	);

	const getAriaIcon = useCallback(
		target => (target === 'icon' ? icon : null),
		[icon]
	);

	const onChangePreset = (number, type = 'normal') => {
		const newDefaultPresets = cloneDeep({ ...defaultPresets });

		if (
			type === 'icon' &&
			!isEmpty(attributes['icon-content']) &&
			attributes['icon-content'] !==
				defaultPresets[`preset${number}`]['icon-content']
		)
			newDefaultPresets[`preset${number}`]['icon-content'] =
				attributes['icon-content'];

		if (
			!isNil(
				defaultPresets[`preset${number}`][
					'icon-border-style-general-hover'
				]
			) &&
			defaultPresets[`preset${number}`][
				'icon-border-style-general-hover'
			] !== 'none'
		) {
			const hoverAttr = getGroupAttributes(
				{ ...newDefaultPresets[`preset${number}`] },
				['border', 'borderWidth', 'borderRadius'],
				true,
				'icon-'
			);

			const nonHoverAttr = getGroupAttributes(
				{ ...newDefaultPresets[`preset${number}`] },
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

			newDefaultPresets[`preset${number}`] = {
				...newDefaultPresets[`preset${number}`],
				...hoverAttr,
			};
		}

		const {
			'icon-stroke-palette-status': strokePaletteStatus,
			'icon-stroke-palette-status-hover': strokePaletteHoverStatus,
			'icon-content': rawIcon,
		} = newDefaultPresets[`preset${number}`];

		let icon = null;

		if (rawIcon && (strokePaletteStatus || strokePaletteHoverStatus)) {
			const {
				'icon-stroke-palette-color': strokePaletteColor,
				'icon-stroke-palette-color-hover': strokePaletteHoverColor,
				'icon-inherit': rawIconInherit,
				'icon-only': rawIconOnly,
			} = newDefaultPresets[`preset${number}`];

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

		maxiSetAttributes({
			...newDefaultPresets[`preset${number}`],
			...(icon && { 'icon-content': icon }),
		});
	};

	const getCategoriesCss = () => {
		const { 'icon-content': iconContent } = attributes;
		return without(categories, isEmpty(iconContent) && 'icon');
	};

	const alignmentLabel = __('Button', 'maxi-blocks');
	const textAlignmentLabel = __('Text', 'maxi-blocks');

	useEffect(
		() =>
			maxiSetAttributes({
				'icon-content': getIconWithColor(attributes),
			}),
		[
			attributes['palette-color-general'],
			attributes['palette-color-general-hover'],
			attributes['palette-status-general'],
			attributes['palette-status-general-hover'],
			attributes['palette-opacity-general'],
			attributes['palette-opacity-general-hover'],
			attributes['color-general'],
			attributes['color-general-hover'],
		]
	);

	const buttonPresets = [];
	[
		'presetOne',
		'presetTwo',
		'presetThree',
		'presetFour',
		'presetFive',
		'presetSix',
		'presetSeven',
		'presetEight',
		'presetNine',
		'presetTen',
		'presetEleven',
	].forEach((preset, i) => {
		buttonPresets.push({
			label: __(`Button shortcut ${i + 1}`, 'maxi-blocks'),
			content: <Icon icon={iconPresets[preset]} />,
			onChange: () =>
				i < 3 ? onChangePreset(i + 1) : onChangePreset(i + 1, 'icon'),
		});
	});

	return (
		<InspectorControls>
			{inspectorTabs.blockSettings({
				props,
			})}
			{inspectorTabs.repeaterInfoBox({ props })}
			{inspectorTabs.responsiveInfoBox({ props })}
			<SettingTabsControl
				target='sidebar-settings-tabs'
				disablePadding
				deviceType={deviceType}
				depth={0}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<AccordionControl
								isSecondary
								items={[
									deviceType === 'general' && {
										label: __(
											'Quick styles',
											'maxi-blocks'
										),
										content: (
											<DefaultStylesControl
												className='maxi-button-default-styles'
												items={buttonPresets}
											/>
										),
									},
									...inspectorTabs.icon({
										props,
									}),
									...inspectorTabs.alignment({
										props,
										isAlignment: true,
										isTextAlignment: true,
										alignmentLabel,
										textAlignmentLabel,
									}),
									...(!iconOnly && [
										...inspectorTabs.typography({
											props,
											textLevel: 'button',
											styleCardPrefix: 'button',
											hideAlignment: true,
											disableCustomFormats: true,
											globalProps: {
												target: '',
												type: 'button',
											},
											hoverGlobalProps: {
												target: 'hover',
												type: 'button',
											},
										}),
										...(dcStatus &&
											dcLinkStatus && {
												...inspectorTabs.linkSettings({
													props,
													customLabel: __(
														'Text link',
														'maxi-blocks'
													),
													styleCardPrefix: '',
													prefix: '',
													classNamePanel:
														'maxi-link-settings-panel',
													disableCustomFormats: true,
												}),
											}),
									]),
									...inspectorTabs.background({
										label: 'Button',
										props,
										disableImage: true,
										disableVideo: true,
										disableClipPath: true,
										disableSVG: true,
										prefix: 'button-',
										globalProps: {
											target: 'background',
											type: 'button',
										},
										hoverGlobalProps: {
											target: 'hover-background',
											type: 'button',
										},
										inlineTarget:
											inlineStylesTargets.background,
									}),
									...inspectorTabs.border({
										props,
										prefix: 'button-',
										globalProps: {
											target: 'border',
											type: 'button',
										},
										hoverGlobalProps: {
											target: 'hover-border',
											type: 'button',
										},
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'button-',
									}),
									...inspectorTabs.size({
										props,
										prefix: 'button-',
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: 'button-',
									}),
								]}
							/>
						),
					},
					{
						label: __('Canvas', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									...inspectorTabs.blockBackground({
										props,
									}),
									...inspectorTabs.border({
										props,
									}),
									...inspectorTabs.boxShadow({
										props,
									}),
									...inspectorTabs.size({
										props,
										block: true,
									}),
									...inspectorTabs.marginPadding({
										props,
									}),
								]}
							/>
						),
					},
					{
						label: __('Advanced', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									...inspectorTabs.ariaLabel({
										props,
										targets: ariaLabelsCategories,
										blockName: props.name,
										getIcon: getAriaIcon,
										onChange: onChangeAriaLabel,
									}),
									deviceType === 'general' && {
										...inspectorTabs.customClasses({
											props,
										}),
									},
									deviceType === 'general' && {
										...inspectorTabs.anchor({
											props,
										}),
									},
									...inspectorTabs.customCss({
										props,
										breakpoint: deviceType,
										selectors,
										categories: getCategoriesCss(),
									}),
									...inspectorTabs.advancedCss({
										props,
									}),
									...inspectorTabs.dc({
										props,
										contentType: 'button',
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										categories: getCategoriesCss(),
										selectors,
									}),
									...inspectorTabs.transition({
										props,
										selectors,
									}),
									...inspectorTabs.display({
										props,
									}),
									...inspectorTabs.opacity({
										props,
									}),
									...inspectorTabs.position({
										props,
									}),
									deviceType !== 'general' && {
										...inspectorTabs.responsive({
											props,
										}),
									},
									...inspectorTabs.overflow({
										props,
									}),
									...inspectorTabs.flex({
										props,
									}),
									...inspectorTabs.zindex({
										props,
									}),
									...inspectorTabs.relation({
										props,
										isButton: true,
									}),
								]}
							/>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default withMaxiInspector(Inspector);
