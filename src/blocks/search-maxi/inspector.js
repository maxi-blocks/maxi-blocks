/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AxisPositionControl,
	SettingTabsControl,
} from '../../components';
import {
	ButtonControl,
	SkinControl,
	PlaceholderColorControl,
} from './components';
import { getGroupAttributes } from '../../extensions/styles';
import { customCss, prefixes } from './data';
import { withMaxiInspector } from '../../extensions/inspector';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * External dependencies
 */
import { isEmpty, without } from 'lodash';

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
	const {
		'icon-position': buttonPosition,
		buttonSkin,
		iconRevealAction,
		skin,
	} = attributes;
	const { selectors, categories } = customCss;
	const { buttonPrefix, closeIconPrefix, inputPrefix } = prefixes;

	const getCategoriesCss = () => {
		const {
			'icon-content': iconContent,
			[`${closeIconPrefix}icon-content`]: closeIconContent,
		} = attributes;
		return without(
			categories,
			isEmpty(iconContent) && 'icon',
			isEmpty(closeIconContent) && 'close icon',
			skin !== 'icon-reveal' && 'close icon'
		);
	};

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

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			{inspectorTabs.blockSettings({
				props,
			})}
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
																					hideBottomGap: true,
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
																				type: 'search-icon',
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
																					onChange={val =>
																						maxiSetAttributes(
																							{
																								'icon-position':
																									val,
																							}
																						)
																					}
																					breakpoint={
																						deviceType
																					}
																					disableY
																					enableCenter={
																						skin ===
																						'icon-reveal'
																					}
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
																			hideBottomGap: true,
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
