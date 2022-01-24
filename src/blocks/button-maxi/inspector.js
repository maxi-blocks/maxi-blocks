/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';
import { select } from '@wordpress/data';

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
} from '../../components';
import * as defaultPresets from './defaults';
import { getGroupAttributes } from '../../extensions/styles';
import { selectorsButton, categoriesButton } from './custom-css';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep, without, inRange } from 'lodash';

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
const getWinBreakpoint = () => {
	const { receiveMaxiSettings, receiveMaxiBreakpoints } =
		select('maxiBlocks');

	const winWidth = receiveMaxiSettings().window?.width || null;

	const maxiBreakpoints = receiveMaxiBreakpoints();

	if (!maxiBreakpoints || isEmpty(maxiBreakpoints)) return null;

	if (winWidth > maxiBreakpoints.xl) return 'xxl';

	const response = Object.entries(maxiBreakpoints).reduce(
		([prevKey, prevValue], [currKey, currValue]) => {
			if (!prevValue) return [prevKey];
			if (inRange(winWidth, prevValue, currValue + 1)) return [currKey];

			return [prevKey, prevValue];
		}
	)[0];

	return response.toLowerCase();
};

const Inspector = memo(
	props => {
		const { attributes, deviceType, setAttributes, clientId } = props;
		const { parentBlockStyle } = attributes;

		const handleSetAttributes = obj => {
			const response = { ...obj };

			Object.entries(obj).forEach(([key, value]) => {
				if (key.includes('-general')) {
					const newKey = key.replace(
						'-general',
						`-${getWinBreakpoint()}`
					);

					response[newKey] = value;
				}
			});

			setAttributes(response);
		};

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

			handleSetAttributes({
				...newDefaultPresets[`preset${number}`],
			});
		};

		const getCategoriesCss = () => {
			const {
				'background-layers': bgLayers,
				'icon-content': iconContent,
			} = attributes;
			return without(
				categoriesButton,
				isEmpty(bgLayers) && 'canvas background',
				isEmpty(iconContent) && 'icon'
			);
		};

		return (
			<InspectorControls>
				{inspectorTabs.responsiveInfoBox({ props })}
				<SettingTabsControl
					target='sidebar-settings-tabs'
					disablePadding
					deviceType={deviceType}
					items={[
						{
							label: __('Settings', 'maxi-blocks'),
							content: (
								<>
									{inspectorTabs.blockSettings({
										props: {
											...props,
											setAttributes: handleSetAttributes,
										},
									})}
									<AccordionControl
										isSecondary
										items={[
											deviceType === 'general' && {
												label: __(
													'Style shortcut',
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
																		icon={
																			presetOne
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		1
																	),
															},
															{
																label: __(
																	'Button shortcut 2',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetTwo
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		2
																	),
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
																	onChangePreset(
																		3
																	),
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
																		icon={
																			presetSix
																		}
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
																		icon={
																			presetTen
																		}
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
												label: __(
													'Icon',
													'maxi-blocks'
												),
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
																				'iconBackgroundGradient',
																				'iconBackgroundColor',
																				'iconBorder',
																				'iconBorderWidth',
																				'iconBorderRadius',
																				'iconPadding',
																			]
																		)}
																		onChange={obj => {
																			handleSetAttributes(
																				obj
																			);
																		}}
																		breakpoint={
																			deviceType
																		}
																		clientId={
																			clientId
																		}
																		parentBlockStyle={
																			parentBlockStyle
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
																				handleSetAttributes(
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
																						'iconBackgroundGradient',
																						'iconBackgroundColor',
																						'iconBorder',
																						'iconBorderWidth',
																						'iconBorderRadius',
																					],
																					true
																				)}
																				onChange={obj => {
																					handleSetAttributes(
																						obj
																					);
																				}}
																				breakpoint={
																					deviceType
																				}
																				clientId={
																					clientId
																				}
																				parentBlockStyle={
																					parentBlockStyle
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
											...inspectorTabs.alignment({
												props: {
													...props,
													setAttributes:
														handleSetAttributes,
												},
												isAlignment: true,
												isTextAlignment: true,
												alignmentLabel: __(
													'Button',
													'maxi-blocks'
												),
												textAlignmentLabel: __(
													'Text',
													'maxi-blocks'
												),
												disableJustify: true,
											}),
											...inspectorTabs.typography({
												props: {
													...props,
													setAttributes:
														handleSetAttributes,
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
											...inspectorTabs.background({
												label: 'Button',
												props: {
													...props,
													setAttributes:
														handleSetAttributes,
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
											}),
											...inspectorTabs.border({
												props: {
													...props,
													setAttributes:
														handleSetAttributes,
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
													setAttributes:
														handleSetAttributes,
												},
												prefix: 'button-',
											}),
											...inspectorTabs.size({
												props: {
													...props,
													setAttributes:
														handleSetAttributes,
												},
												prefix: 'button-',
											}),
											...inspectorTabs.marginPadding({
												props: {
													...props,
													setAttributes:
														handleSetAttributes,
												},
												prefix: 'button-',
											}),
										]}
									/>
								</>
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
												setAttributes:
													handleSetAttributes,
											},
										}),
										...inspectorTabs.border({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
										...inspectorTabs.boxShadow({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
										...inspectorTabs.opacity({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
										...inspectorTabs.size({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
											block: true,
										}),
										...inspectorTabs.marginPadding({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
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
													setAttributes:
														handleSetAttributes,
												},
											}),
										},
										deviceType === 'general' && {
											...inspectorTabs.anchor({
												props: {
													...props,
													setAttributes:
														handleSetAttributes,
												},
											}),
										},
										...inspectorTabs.customCss({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
											breakpoint: deviceType,
											selectors: selectorsButton,
											categories: getCategoriesCss(),
										}),
										...inspectorTabs.scrollEffects({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
										...inspectorTabs.transform({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
										...inspectorTabs.transition({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
											label: __(
												'Hover transition',
												'maxi-blocks'
											),
										}),
										...inspectorTabs.display({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
										...inspectorTabs.position({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
										deviceType !== 'general' && {
											...inspectorTabs.responsive({
												props: {
													...props,
													setAttributes:
														handleSetAttributes,
												},
											}),
										},
										...inspectorTabs.overflow({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
										...inspectorTabs.zindex({
											props: {
												...props,
												setAttributes:
													handleSetAttributes,
											},
										}),
									]}
								/>
							),
						},
					]}
				/>
			</InspectorControls>
		);
	},
	// Avoids non-necessary renderings
	(
		{
			attributes: oldAttr,
			propsToAvoid,
			isSelected: wasSelected,
			deviceType: oldBreakpoint,
			scValues: oldSCValues,
		},
		{ attributes: newAttr, isSelected, deviceType: breakpoint, scValues }
	) => {
		if (
			!wasSelected ||
			wasSelected !== isSelected ||
			oldBreakpoint !== breakpoint ||
			!isEqual(oldSCValues, scValues)
		)
			return false;

		const oldAttributes = cloneDeep(oldAttr);
		const newAttributes = cloneDeep(newAttr);

		if (!isEmpty(propsToAvoid)) {
			propsToAvoid.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			return isEqual(oldAttributes, newAttributes);
		}

		return isEqual(oldAttributes, newAttributes);
	}
);

export default Inspector;
