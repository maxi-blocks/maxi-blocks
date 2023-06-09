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
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { getIconWithColor } from '../../extensions/styles';
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
	const [iconOnly, iconContent] = getAttributesValue({
		target: ['i_on', 'i_c'],
		props: attributes,
	});
	const { categories, selectors } = customCss;

	const onChangePreset = (number, type = 'normal') => {
		const newDefaultPresets = cloneDeep({ ...defaultPresets });

		if (
			type === 'icon' &&
			!isEmpty(iconContent) &&
			iconContent !== defaultPresets[`preset${number}`].i_c
		)
			newDefaultPresets[`preset${number}`].i_c = iconContent;

		if (
			!isNil(defaultPresets[`preset${number}`]['i-bo_s-g.h']) &&
			defaultPresets[`preset${number}`]['i-bo_s-g.h'] !== 'none'
		) {
			const hoverAttr = getGroupAttributes(
				{ ...newDefaultPresets[`preset${number}`] },
				['border', 'borderWidth', 'borderRadius'],
				true,
				'i-'
			);

			const nonHoverAttr = getGroupAttributes(
				{ ...newDefaultPresets[`preset${number}`] },
				['border', 'borderWidth', 'borderRadius'],
				false,
				'i-'
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
			'i-str_ps': strokePaletteStatus,
			'i-str_ps.h': strokePaletteHoverStatus,
			i_c: rawIcon,
		} = newDefaultPresets[`preset${number}`];

		let icon = null;

		if (rawIcon && (strokePaletteStatus || strokePaletteHoverStatus)) {
			const {
				'i-str_pc': strokePaletteColor,
				'i-str_pc.h': strokePaletteHoverColor,
				i_i: rawIconInherit,
				i_on: rawIconOnly,
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
			...(icon && { i_c: icon }),
		});
	};

	const getCategoriesCss = () => {
		const iconContent = getAttributesValue({
			target: 'i_c',
			props: attributes,
		});

		return without(categories, isEmpty(iconContent) && 'i');
	};

	const alignmentLabel = __('Button', 'maxi-blocks');
	const textAlignmentLabel = __('Text', 'maxi-blocks');

	useEffect(
		() =>
			maxiSetAttributes({
				i_c: getIconWithColor(attributes),
			}),
		[
			attributes['_pc-g'],
			attributes['_pc-g.h'],
			attributes['_ps-g'],
			attributes['_ps-g.h'],
			attributes['_po-g'],
			attributes['_po-g.h'],
			attributes['_cc-g'],
			attributes['_cc-g.h'],
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
				props,
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
									deviceType === 'g' && {
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
											props,
											styleCardPrefix: 'button',
											hideAlignment: true,
											hideBottomGap: true,
											disableCustomFormats: true,
											globalProps: {
												target: '',
												type: 'button',
											},
											hoverGlobalProps: {
												target: 'h',
												type: 'button',
											},
										}),
									}),
									...inspectorTabs.background({
										label: 'Button',
										props,
										disableImage: true,
										disableVideo: true,
										disableClipPath: true,
										disableSVG: true,
										prefix: 'bt-',
										globalProps: {
											target: 'b',
											type: 'button',
										},
										hoverGlobalProps: {
											target: 'h-b',
											type: 'button',
										},
										inlineTarget:
											inlineStylesTargets.background,
									}),
									...inspectorTabs.border({
										props,
										prefix: 'bt-',
										globalProps: {
											target: 'bo',
											type: 'button',
										},
										hoverGlobalProps: {
											target: 'h-bo',
											type: 'button',
										},
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'bt-',
									}),
									...inspectorTabs.size({
										props,
										prefix: 'bt-',
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: 'bt-',
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
									deviceType === 'g' && {
										...inspectorTabs.customClasses({
											props,
										}),
									},
									deviceType === 'g' && {
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
									deviceType !== 'g' && {
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
