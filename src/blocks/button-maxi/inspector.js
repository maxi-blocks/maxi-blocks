/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	DefaultStylesControl,
	Icon,
	SettingTabsControl,
} from '../../components';
import * as defaultPresets from './defaults';
import { getGroupAttributes, getIconWithColor } from '../../extensions/styles';
import { customCss } from './data';
import * as inspectorTabs from '../../components/inspector-tabs';
import { withMaxiInspector } from '../../extensions/inspector';

/**
 * External dependencies
 */
import { isEmpty, isNil, cloneDeep, without } from 'lodash';

/**
 * Icons
 */
import * as iconPresets from '../../icons/button-presets/index';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes, inlineStylesTargets } =
		props;
	const { 'icon-only': iconOnly } = attributes;
	const { selectors, categories } = customCss;

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
			'icon-stroke-pa-status': strokePaletteStatus,
			'icon-stroke-pa-status-hover': strokePaletteHoverStatus,
			'icon-content': rawIcon,
		} = newDefaultPresets[`preset${number}`];

		let icon = null;

		if (rawIcon && (strokePaletteStatus || strokePaletteHoverStatus)) {
			const {
				'icon-stroke-pac': strokePaletteColor,
				'icon-stroke-pac-hover': strokePaletteHoverColor,
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
			attributes['pac-general'],
			attributes['pac-general-hover'],
			attributes['pa-status-general'],
			attributes['pa-status-general-hover'],
			attributes['pao-general'],
			attributes['pao-general-hover'],
			attributes['c-general'],
			attributes['c-general-hover'],
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
			{inspectorTabs.responsiveInfoBox({ props })}
			{inspectorTabs.blockSettings({
				props: {
					...props,
				},
			})}
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
									...(!iconOnly && {
										...inspectorTabs.typography({
											props: {
												...props,
											},
											styleCardPrefix: 'button',
											hideAlignment: true,
											hideBottomGap: true,
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
									}),
									...inspectorTabs.background({
										label: 'Button',
										props: {
											...props,
										},
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
										props: {
											...props,
										},
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
										props: {
											...props,
										},
										prefix: 'button-',
									}),
									...inspectorTabs.size({
										props: {
											...props,
										},
										prefix: 'button-',
									}),
									...inspectorTabs.marginPadding({
										props: {
											...props,
										},
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
										props: {
											...props,
										},
									}),
									...inspectorTabs.border({
										props: {
											...props,
										},
									}),
									...inspectorTabs.boxShadow({
										props: {
											...props,
										},
									}),
									...inspectorTabs.size({
										props: {
											...props,
										},
										block: true,
									}),
									...inspectorTabs.marginPadding({
										props: {
											...props,
										},
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
									deviceType === 'general' && {
										...inspectorTabs.customClasses({
											props: {
												...props,
											},
										}),
									},
									deviceType === 'general' && {
										...inspectorTabs.anchor({
											props: {
												...props,
											},
										}),
									},
									...inspectorTabs.customCss({
										props: {
											...props,
										},
										breakpoint: deviceType,
										selectors,
										categories: getCategoriesCss(),
									}),
									...inspectorTabs.scrollEffects({
										props: {
											...props,
										},
									}),
									...inspectorTabs.transform({
										props: {
											...props,
										},
										categories: getCategoriesCss(),
										selectors,
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
										selectors,
									}),
									...inspectorTabs.display({
										props: {
											...props,
										},
									}),
									...inspectorTabs.opacity({
										props: {
											...props,
										},
									}),
									...inspectorTabs.position({
										props: {
											...props,
										},
									}),
									deviceType !== 'general' && {
										...inspectorTabs.responsive({
											props: {
												...props,
											},
										}),
									},
									...inspectorTabs.overflow({
										props: {
											...props,
										},
									}),
									...inspectorTabs.flex({
										props: {
											...props,
										},
									}),
									...inspectorTabs.zindex({
										props: {
											...props,
										},
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
