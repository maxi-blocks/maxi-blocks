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
	IconControl,
	SettingTabsControl,
	ToggleSwitch,
	ResponsiveTabsControl,
	AlignmentControl,
} from '../../components';
import * as defaultPresets from './defaults';
import {
	getGroupAttributes,
	setHoverAttributes,
	getIconWithColor,
} from '../../extensions/styles';
import { selectorsButton, categoriesButton } from './custom-css';
import * as inspectorTabs from '../../components/inspector-tabs';
import { withMaxiInspector, openTransitions } from '../../extensions/inspector';
/**
 * External dependencies
 */
import { isEmpty, isNil, cloneDeep, without } from 'lodash';

/**
 * Icons
 */
import {
	presetOne,
	presetTwo,
	presetThree,
	presetFour,
	presetFive,
	presetSix,
	presetSeven,
	presetEight,
	presetNine,
	presetTen,
	presetEleven,
} from '../../icons';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
		inlineStylesTargets,
		clientId,
	} = props;
	const { blockStyle, svgType, 'icon-only': iconOnly } = attributes;

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
			setHoverAttributes(nonHoverAttr, hoverAttr);

			newDefaultPresets[`preset${number}`] = {
				...newDefaultPresets[`preset${number}`],
				...hoverAttr,
			};
		}

		const {
			'icon-stroke-palette-status': strokePaletteStatus,
			'icon-stroke-palette-hover-status': strokePaletteHoverStatus,
			'icon-content': rawIcon,
		} = newDefaultPresets[`preset${number}`];

		let icon = null;

		if (rawIcon && (strokePaletteStatus || strokePaletteHoverStatus)) {
			const {
				'icon-stroke-palette-color': strokePaletteColor,
				'icon-stroke-palette-hover-color': strokePaletteHoverColor,
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
		return without(categoriesButton, isEmpty(iconContent) && 'icon');
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
												items={[
													{
														label: __(
															'Button shortcut 1',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={presetOne}
															/>
														),
														onChange: () =>
															onChangePreset(1),
													},
													{
														label: __(
															'Button shortcut 2',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={presetTwo}
															/>
														),
														onChange: () =>
															onChangePreset(2),
													},
													{
														label: __(
															'Button shortcut 3',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={
																	presetThree
																}
															/>
														),
														onChange: () =>
															onChangePreset(3),
													},
													{
														label: __(
															'Button shortcut 4',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={
																	presetFour
																}
															/>
														),
														onChange: () =>
															onChangePreset(
																4,
																'icon'
															),
													},
													{
														label: __(
															'Button shortcut 5',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={
																	presetFive
																}
															/>
														),
														onChange: () =>
															onChangePreset(
																5,
																'icon'
															),
													},
													{
														label: __(
															'Button shortcut 6',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={presetSix}
															/>
														),
														onChange: () =>
															onChangePreset(
																6,
																'icon'
															),
													},
													{
														label: __(
															'Button shortcut 7',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={
																	presetSeven
																}
															/>
														),
														onChange: () =>
															onChangePreset(
																7,
																'icon'
															),
													},
													{
														label: __(
															'Button shortcut 8',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={
																	presetEight
																}
															/>
														),
														onChange: () =>
															onChangePreset(
																8,
																'icon'
															),
													},
													{
														label: __(
															'Button shortcut 9',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={
																	presetNine
																}
															/>
														),
														onChange: () =>
															onChangePreset(
																9,
																'icon'
															),
													},
													{
														label: __(
															'Button shortcut 10',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={presetTen}
															/>
														),
														onChange: () =>
															onChangePreset(
																10,
																'icon'
															),
													},
													{
														label: __(
															'Button shortcut 11',
															'maxi-blocks'
														),
														content: (
															<Icon
																icon={
																	presetEleven
																}
															/>
														),
														onChange: () =>
															onChangePreset(
																11,
																'icon'
															),
													},
												]}
											/>
										),
									},
									{
										label: __('Icon', 'maxi-blocks'),
										disablePadding: true,
										content: (
											<SettingTabsControl
												items={[
													{
														label: __(
															'Normal state',
															'maxi-blocks'
														),
														content: (
															<IconControl
																{...getGroupAttributes(
																	attributes,
																	[
																		'icon',
																		'iconBackground',
																		'iconBackgroundGradient',
																		'iconBackgroundColor',
																		'iconBorder',
																		'iconBorderWidth',
																		'iconBorderRadius',
																		'iconPadding',
																	]
																)}
																onChangeInline={(
																	obj,
																	target,
																	isMultiplySelector = false
																) =>
																	insertInlineStyles(
																		{
																			obj,
																			target,
																			isMultiplySelector,
																		}
																	)
																}
																onChange={(
																	obj,
																	target
																) => {
																	maxiSetAttributes(
																		obj
																	);
																	cleanInlineStyles(
																		target
																	);
																}}
																svgType={
																	svgType
																}
																breakpoint={
																	deviceType
																}
																clientId={
																	clientId
																}
																blockStyle={
																	blockStyle
																}
																getIconWithColor={args =>
																	getIconWithColor(
																		attributes,
																		args
																	)
																}
															/>
														),
													},
													{
														label: __(
															'Hover state',
															'maxi-blocks'
														),
														content: (
															<>
																<div
																	className='maxi-warning-box manage-transitions'
																	onClick={() => {
																		openTransitions();
																	}}
																>
																	<div className='maxi-warning-box__links'>
																		<a>
																			Manage
																			hover
																			transitions
																		</a>
																	</div>
																</div>
																<ToggleSwitch
																	label={__(
																		'Enable Icon Hover',
																		'maxi-blocks'
																	)}
																	selected={
																		attributes[
																			'icon-status-hover'
																		]
																	}
																	onChange={val =>
																		maxiSetAttributes(
																			{
																				'icon-status-hover':
																					val,
																			}
																		)
																	}
																/>
																{attributes[
																	'icon-status-hover'
																] && (
																	<IconControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'icon',
																				'iconHover',
																				'iconBackgroundGradient',
																				'iconBackgroundColor',
																				'iconBorder',
																				'iconBackgroundHover',
																				'iconBorderWidth',
																				'iconBorderRadius',
																			],
																			true
																		)}
																		onChange={obj => {
																			maxiSetAttributes(
																				obj
																			);
																		}}
																		svgType={
																			svgType
																		}
																		breakpoint={
																			deviceType
																		}
																		clientId={
																			clientId
																		}
																		blockStyle={
																			blockStyle
																		}
																		getIconWithColor={args =>
																			getIconWithColor(
																				attributes,
																				args
																			)
																		}
																		isHover
																	/>
																)}
															</>
														),
													},
												]}
											/>
										),
									},
									{
										label: __('Alignment', 'maxi-blocks'),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<>
													<label
														className='maxi-base-control__label'
														htmlFor={`${alignmentLabel}-alignment`}
													>
														{`${alignmentLabel} alignment`}
													</label>
													<AlignmentControl
														id={`${alignmentLabel}-alignment`}
														label={alignmentLabel}
														{...getGroupAttributes(
															attributes,
															'alignment'
														)}
														onChange={obj =>
															maxiSetAttributes(
																obj
															)
														}
														breakpoint={deviceType}
														disableJustify
													/>
													<label
														className='maxi-base-control__label'
														htmlFor={`${textAlignmentLabel}-alignment`}
													>
														{`${textAlignmentLabel} alignment`}
													</label>
													<AlignmentControl
														id={`${textAlignmentLabel}-alignment`}
														label={
															textAlignmentLabel
														}
														{...getGroupAttributes(
															attributes,
															'textAlignment'
														)}
														onChange={obj =>
															maxiSetAttributes(
																obj
															)
														}
														breakpoint={deviceType}
														type='text'
													/>
												</>
											</ResponsiveTabsControl>
										),
									},
									...(!iconOnly && {
										...inspectorTabs.typography({
											props: {
												...props,
											},
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
									...inspectorTabs.opacity({
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
										selectors: selectorsButton,
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
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
									}),
									...inspectorTabs.display({
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
