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
	ColorControl,
	ResponsiveTabsControl,
	SelectControl,
	SettingTabsControl,
	TextControl,
} from '../../components';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import { selectorsSearch, categoriesSearch } from './custom-css';
import { withMaxiInspector } from '../../extensions/inspector';
import * as inspectorTabs from '../../components/inspector-tabs';
import { buttonPrefix, closeIconPrefix, inputPrefix } from './prefixes';

/**
 * External dependencies
 */
import { isEmpty, without } from 'lodash';

/**
 * Search controls
 */
const SkinControl = props => {
	const { attributes, maxiSetAttributes } = props;
	const { skin } = attributes;

	return (
		<SelectControl
			label={__('Skin', 'maxi-blocks')}
			value={skin}
			options={[
				{
					label: __('Boxed', 'maxi-blocks'),
					value: 'boxed',
				},
				{
					label: __('Classic', 'maxi-blocks'),
					value: 'classic',
				},
				{
					label: __('Icon reveal', 'maxi-blocks'),
					value: 'icon-reveal',
				},
			]}
			onChange={skin => {
				if (skin === 'classic') {
					maxiSetAttributes({
						[`${inputPrefix}background-palette-color-general`]: 2,
					});
				} else if (skin === 'boxed') {
					maxiSetAttributes({
						[`${inputPrefix}background-palette-color-general`]: 1,
					});
				} else if (skin === 'icon-reveal') {
					maxiSetAttributes({
						[`${buttonPrefix}border-unit-radius-general`]: '%',
						[`${buttonPrefix}border-top-left-radius-general`]: 50,
						[`${buttonPrefix}border-top-right-radius-general`]: 50,
						[`${buttonPrefix}border-bottom-left-radius-general`]: 50,
						[`${buttonPrefix}border-bottom-right-radius-general`]: 50,
						[`${buttonPrefix}margin-left-general`]: '-20',
					});
				}

				maxiSetAttributes({
					skin,
				});
			}}
		/>
	);
};

const ButtonControl = props => {
	const { attributes, maxiSetAttributes } = props;
	const { buttonContent, buttonContentClose, buttonSkin, skin } = attributes;

	return (
		<>
			<SelectControl
				className='maxi-search-button-control__skin'
				label={__('Skin', 'maxi-blocks')}
				value={buttonSkin}
				options={[
					{
						label: __('Icon', 'maxi-blocks'),
						value: 'icon',
					},
					{
						label: __('Text', 'maxi-blocks'),
						value: 'text',
					},
				]}
				onChange={buttonSkin =>
					maxiSetAttributes({
						buttonSkin,
					})
				}
			/>
			{buttonSkin === 'text' && (
				<>
					<TextControl
						label={__('Button text', 'maxi-blocks')}
						value={buttonContent}
						onChange={buttonContent =>
							maxiSetAttributes({
								buttonContent,
							})
						}
					/>
					{skin === 'icon-reveal' && (
						<TextControl
							label={__('Button close text', 'maxi-blocks')}
							value={buttonContentClose}
							onChange={buttonContentClose =>
								maxiSetAttributes({
									buttonContentClose,
								})
							}
						/>
					)}
				</>
			)}
		</>
	);
};

const PlaceholderColourControl = props => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	return (
		<>
			<TextControl
				label={__('Placeholder text', 'maxi-blocks')}
				value={attributes.placeholder}
				onChange={placeholder =>
					maxiSetAttributes({
						placeholder,
					})
				}
			/>
			<ResponsiveTabsControl breakpoint={deviceType}>
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-control__color'
					color={getLastBreakpointAttribute({
						target: 'placeholder-color',
						breakpoint: deviceType,
						attributes,
					})}
					prefix='placeholder-'
					paletteColor={getLastBreakpointAttribute({
						target: 'placeholder-palette-color',
						breakpoint: deviceType,
						attributes,
					})}
					paletteOpacity={getLastBreakpointAttribute({
						target: 'placeholder-palette-opacity',
						breakpoint: deviceType,
						attributes,
					})}
					paletteStatus={getLastBreakpointAttribute({
						target: 'placeholder-palette-status',
						breakpoint: deviceType,
						attributes,
					})}
					onChangeInline={({ color }) =>
						insertInlineStyles({
							obj: { color },
							target: ' .maxi-search-block__input',
							pseudoElement: '::placeholder',
						})
					}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) => {
						maxiSetAttributes({
							[`placeholder-color-${deviceType}`]: color,
							[`placeholder-palette-color-${deviceType}`]:
								paletteColor,
							[`placeholder-palette-status-${deviceType}`]:
								paletteStatus,
							[`placeholder-palette-opacity-${deviceType}`]:
								paletteOpacity,
						});
						cleanInlineStyles(
							' .maxi-search-block__input',
							'::placeholder'
						);
					}}
					deviceType={deviceType}
					clientId={clientId}
					disableGradient
				/>
			</ResponsiveTabsControl>
		</>
	);
};

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const { 'icon-position': buttonPosition, skin, buttonSkin } = attributes;

	const getCategoriesCss = () => {
		const {
			'icon-content': iconContent,
			[`${closeIconPrefix}icon-content`]: closeIconContent,
		} = attributes;
		return without(
			categoriesSearch,
			isEmpty(iconContent) && 'icon',
			isEmpty(closeIconContent) && 'close icon',
			skin !== 'icon-reveal' && 'close icon'
		);
	};

	const iconControlsDisabledProps = {
		disableBackground: true,
		disableIconInherit: true,
		disableIconOnly: true,
		disablePadding: true,
		disablePosition: true,
		disableSpacing: true,
	};

	const backgroundDisabledProps = {
		disableImage: true,
		disableVideo: true,
		disableGradient: true,
		disableSVG: true,
		disableNoneStyle: true,
	};

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
						label: __('Block', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
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
						label: __('Button', 'maxi-blocks'),
						content: (
							<AccordionControl
								items={[
									{
										label: __('Skin', 'maxi-blocks'),
										content: <SkinControl {...props} />,
									},
									{
										label: __('Button', 'maxi-blocks'),
										content: <ButtonControl {...props} />,
									},
									...(buttonSkin === 'icon'
										? inspectorTabs.icon({
												props,
												type: 'search-icon',
												...iconControlsDisabledProps,
										  })
										: inspectorTabs.typography({
												props,
												disableCustomFormats: true,
												hideAlignment: true,
												prefix: buttonPrefix,
												inlineTarget:
													' .maxi-search-block__button__content',
										  })),
									...(buttonSkin === 'icon' &&
										skin === 'icon-reveal' &&
										inspectorTabs.icon({
											props,
											label: __(
												'Close icon',
												'maxi-blocks'
											),
											type: 'search-icon',
											...iconControlsDisabledProps,
											prefix: closeIconPrefix,
										})),
									{
										label: __('Position', 'maxi-blocks'),
										content: (
											<AxisPositionControl
												label='Button'
												selected={buttonPosition}
												onChange={val =>
													maxiSetAttributes({
														'icon-position': val,
													})
												}
												breakpoint={deviceType}
												disableY
											/>
										),
									},
									...inspectorTabs.border({
										props,
										prefix: buttonPrefix,
										selector: '.maxi-search-block__button',
									}),
									...inspectorTabs.background({
										label: 'Button',
										props,
										prefix: buttonPrefix,
										...backgroundDisabledProps,
										selector: '.maxi-search-block__button',
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: buttonPrefix,
									}),
								]}
							/>
						),
					},
					{
						label: __('Input', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									...inspectorTabs.typography({
										props,
										disableCustomFormats: true,
										hideAlignment: true,
										prefix: inputPrefix,
										inlineTarget:
											' .maxi-search-block__input',
									}),
									{
										label: __('Placeholder', 'maxi-blocks'),
										content: (
											<PlaceholderColourControl
												{...props}
											/>
										),
									},
									...inspectorTabs.border({
										props,
										prefix: inputPrefix,
									}),
									...inspectorTabs.background({
										label: 'Input',
										props,
										prefix: inputPrefix,
										...backgroundDisabledProps,
										selector: '.maxi-search-block__input',
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: inputPrefix,
										customLabel: __(
											'Padding',
											'maxi-blocks'
										),
										disableMargin: true,
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
										selectors: selectorsSearch,
										categories: getCategoriesCss(),
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
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
