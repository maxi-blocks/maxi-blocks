/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, without } from 'lodash';

/**
 * Internal dependencies
 */
import AccordionControl from '@components/accordion-control';
import AxisPositionControl from '@components/axis-position-control';
import SettingTabsControl from '@components/setting-tabs-control';
import ButtonControl from './components/button-control';
import SkinControl from './components/skin-control';
import PlaceholderColorControl from './components/placeholder-color-control';
import { getGroupAttributes } from '@extensions/styles';
import { ariaLabelsCategories, customCss, prefixes } from './data';
import { withMaxiInspector } from '@extensions/inspector';
import * as inspectorTabs from '@components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	const { buttonPrefix, closeIconPrefix, inputPrefix } = prefixes;
	const {
		'icon-position': buttonPosition,
		buttonSkin,
		iconRevealAction,
		skin,
		'icon-content': iconContent,
		[`${closeIconPrefix}icon-content`]: closeIconContent,
	} = attributes;
	const { selectors, categories } = customCss;

	const getCategoriesCss = () => {
		return without(
			categories,
			isEmpty(iconContent) && 'icon',
			isEmpty(closeIconContent) && 'close icon',
			skin !== 'icon-reveal' && 'close icon'
		);
	};

	const onChangeAriaLabel = useCallback(
		({ obj, target, icon }) => {
			maxiSetAttributes({
				...obj,
				...(target === 'icon' && {
					'icon-content': icon,
				}),
				...(target === 'close icon' && {
					[`${closeIconPrefix}icon-content`]: icon,
				}),
			});
		},
		[closeIconPrefix, maxiSetAttributes]
	);

	const getAriaIcon = useCallback(
		target => {
			if (target === 'icon') return iconContent;
			if (target === 'close icon') return closeIconContent;

			return null;
		},
		[iconContent, closeIconContent]
	);

	const iconControlsDisabledProps = {
		disableBackground: true,
		disableBorder: true,
		disableIconInherit: true,
		disableIconOnly: true,
		disablePadding: true,
		disablePosition: true,
		disableSpacing: true,
		disableHeightFitContent: true,
	};

	const backgroundDisabledProps = {
		disableClipPath: true,
		disableGradient: true,
		disableImage: true,
		disableNoneStyle: true,
		disableSVG: true,
		disableVideo: true,
	};

	const positionSettings = val => {
		const inpRightWidth = props['input-border-left-width-general'];
		const inpLeftWidth = props['input-border-right-width-general'];
		const inpLeftPadding = props['input-padding-left-general'];
		const inpRightPadding = props['input-padding-right-general'];

		(val === 'center' || val === 'right') &&
			maxiSetAttributes({
				'icon-position': val,
				'input-border-left-width-general': inpRightWidth || 4,
				'input-border-right-width-general': inpLeftWidth || 0,
				'input-padding-left-general': inpLeftPadding || 10,
				'input-padding-right-general': inpRightPadding || 35,
			});
		val === 'left' &&
			maxiSetAttributes({
				'icon-position': val,
				'input-border-left-width-general': inpRightWidth || 0,
				'input-border-right-width-general': inpLeftWidth || 4,
				'input-padding-left-general': inpLeftPadding || 35,
				'input-padding-right-general': inpRightPadding || 10,
			});
	};

	return (
		<InspectorControls>
			{inspectorTabs.blockSettings({
				props,
			})}
			{inspectorTabs.repeaterInfoBox({ props })}
			{inspectorTabs.responsiveInfoBox({ props })}
			<SettingTabsControl
				disablePadding
				deviceType={deviceType}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									{
										label: __('Skin', 'maxi-blocks'),
										content: (
											<SkinControl
												skin={skin}
												iconRevealAction={
													iconRevealAction
												}
												onChange={maxiSetAttributes}
											/>
										),
									},
									{
										label: __(
											'Search settings',
											'maxi-blocks'
										),
										disablePadding: true,
										content: (
											<SettingTabsControl
												disablePadding
												isNestedAccordion
												hasBorder
												items={[
													{
														label: __(
															'Button',
															'maxi-blocks'
														),
														content: (
															<AccordionControl
																isNestedAccordion
																items={[
																	{
																		label: __(
																			'Shortcut',
																			'maxi-blocks'
																		),
																		content:
																			(
																				<ButtonControl
																					{...getGroupAttributes(
																						attributes,
																						'searchButton'
																					)}
																					onChange={
																						maxiSetAttributes
																					}
																					skin={
																						skin
																					}
																				/>
																			),
																	},
																	...(buttonSkin ===
																	'icon'
																		? inspectorTabs.icon(
																				{
																					props,
																					type: 'search-icon',
																					ignoreIndicator:
																						[
																							'icon-position',
																						],
																					...iconControlsDisabledProps,
																				}
																		  )
																		: inspectorTabs.typography(
																				{
																					props,
																					disableCustomFormats: true,
																					hideAlignment: true,

																					prefix: buttonPrefix,
																					inlineTarget:
																						' .maxi-search-block__button__content',
																				}
																		  )),
																	...(buttonSkin ===
																		'icon' &&
																		skin ===
																			'icon-reveal' &&
																		inspectorTabs.icon(
																			{
																				props,
																				label: __(
																					'Close icon',
																					'maxi-blocks'
																				),
																				type: 'search-icon-close',
																				...iconControlsDisabledProps,
																				prefix: closeIconPrefix,
																			}
																		)),
																	...(deviceType ===
																		'general' && {
																		label: __(
																			'Position',
																			'maxi-blocks'
																		),
																		content:
																			(
																				<AxisPositionControl
																					label='Button'
																					selected={
																						buttonPosition
																					}
																					onChange={val => {
																						positionSettings(
																							val
																						);
																					}}
																					breakpoint={
																						deviceType
																					}
																					disableY
																					enableCenter={
																						skin ===
																						'icon-reveal'
																					}
																					buttonClasses={{
																						left: 'maxi-search-control__left',
																						right: 'maxi-search-control__right',
																					}}
																				/>
																			),
																		extraIndicators:
																			[
																				'icon-position',
																			],
																	}),
																	...inspectorTabs.border(
																		{
																			props,
																			prefix: buttonPrefix,
																			inlineTarget:
																				'.maxi-search-block__button',
																		}
																	),
																	...inspectorTabs.background(
																		{
																			label: 'Button',
																			props,
																			prefix: buttonPrefix,
																			...backgroundDisabledProps,
																			inlineTarget:
																				'.maxi-search-block__button',
																		}
																	),
																	...inspectorTabs.marginPadding(
																		{
																			props,
																			prefix: buttonPrefix,
																		}
																	),
																]}
															/>
														),
													},
													{
														label: __(
															'Input',
															'maxi-blocks'
														),
														content: (
															<AccordionControl
																isNestedAccordion
																isPrimary
																items={[
																	...inspectorTabs.typography(
																		{
																			props,
																			disableCustomFormats: true,
																			hideAlignment: true,
																			prefix: inputPrefix,
																			inlineTarget:
																				' .maxi-search-block__input',
																		}
																	),
																	{
																		label: __(
																			'Placeholder',
																			'maxi-blocks'
																		),
																		content:
																			(
																				<PlaceholderColorControl
																					{...getGroupAttributes(
																						attributes,
																						'placeholderColor'
																					)}
																					placeholder={
																						attributes.placeholder
																					}
																					onChange={
																						maxiSetAttributes
																					}
																					deviceType={
																						deviceType
																					}
																					insertInlineStyles={
																						insertInlineStyles
																					}
																					cleanInlineStyles={
																						cleanInlineStyles
																					}
																					clientId={
																						clientId
																					}
																				/>
																			),
																	},
																	...inspectorTabs.border(
																		{
																			props,
																			prefix: inputPrefix,
																		}
																	),
																	...inspectorTabs.background(
																		{
																			label: 'Input',
																			props,
																			prefix: inputPrefix,
																			...backgroundDisabledProps,
																			inlineTarget:
																				'.maxi-search-block__input',
																		}
																	),
																	...inspectorTabs.marginPadding(
																		{
																			props,
																			prefix: inputPrefix,
																			customLabel:
																				__(
																					'Padding',
																					'maxi-blocks'
																				),
																			disableMargin: true,
																		}
																	),
																]}
															/>
														),
													},
												]}
											/>
										),
									},
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
										onChange: onChangeAriaLabel,
										getIcon: getAriaIcon,
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
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										selectors,
										categories: getCategoriesCss(),
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
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
