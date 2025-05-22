/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import AccordionControl from '@components/accordion-control';
import AdvancedNumberControl from '@components/advanced-number-control';
import ImageAltControl from '@components/image-alt-control';
import ImageShape from '@components/image-shape';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import TypographyControl from '@components/typography-control';
import DimensionTab from './components/dimension-tab';
import HoverEffectControl from './components/hover-effect-control';
import InfoBox from '@components/info-box';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import * as inspectorTabs from '@components/inspector-tabs';
import { ariaLabelsCategories, customCss } from './data';
import { withMaxiInspector } from '@extensions/inspector';
import { transitionFilterEffects } from './components/hover-effect-control/constants';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, clientId, deviceType, maxiSetAttributes } = props;
	const {
		altSelector,
		blockStyle,
		captionType,
		mediaAlt,
		SVGElement,
		uniqueID,
		mediaID,
		captionPosition,
		fitParentSize,
		'dc-status': dcStatus,
	} = attributes;
	const { selectors, categories } = customCss;

	const imageData = useSelect(
		select => select('core').getMedia(mediaID),
		[mediaID]
	);

	const dropShadow =
		(getLastBreakpointAttribute({
			target: 'clip-path',
			breakpoint: deviceType,
			attributes,
		}) &&
			getLastBreakpointAttribute({
				target: 'clip-path-status',
				breakpoint: deviceType,
				attributes,
			})) ||
		!isEmpty(attributes.SVGElement);

	const isHoverEffectUseTransform =
		attributes['hover-type'] &&
		attributes['hover-type'] !== 'none' &&
		!transitionFilterEffects.includes(
			attributes['hover-basic-effect-type']
		);
	const getHoverEffectIncompatibleMessage = setting =>
		`The selected hover effect type is not compatible with ${setting}. To use this hover effect, please change the hover effect type to one of the compatible types: ${transitionFilterEffects.join(
			', '
		)}.`;

	const getCaptionOptions = () => {
		if (dcStatus)
			return [
				{ label: 'None', value: 'none' },
				{ label: 'Dynamic caption', value: 'custom' }, // Left as custom, because it's the same as custom caption
			];

		const response = [
			{ label: 'None', value: 'none' },
			{ label: 'Custom caption', value: 'custom' },
		];

		if (imageData && !isEmpty(imageData.caption.rendered)) {
			const newCaption = {
				label: 'Attachment caption',
				value: 'attachment',
			};
			response.splice(1, 0, newCaption);
		}
		return response;
	};

	const onChangeAriaLabel = useCallback(
		({ obj, target, icon }) => {
			maxiSetAttributes({
				...obj,
				...(target === 'image' &&
					SVGElement && {
						SVGElement: icon,
					}),
			});
		},
		[SVGElement, maxiSetAttributes]
	);

	const getAriaIcon = useCallback(
		target => (target === 'image' ? SVGElement : null),
		[SVGElement]
	);

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
									deviceType === 'general' &&
										!attributes[
											'image-full-width-general'
										] && {
											label: __(
												'Dimension',
												'maxi-blocks'
											),
											content: (
												<DimensionTab
													{...props}
													imageData={imageData}
												/>
											),
											extraIndicators: [
												'imageRatio',
												'img-width',
											],
										},
									...inspectorTabs.alignment({
										props,
										isAlignment: true,
										disableJustify: true,
									}),
									deviceType === 'general' &&
										!SVGElement && {
											label: __('Alt tag', 'maxi-blocks'),
											content: (
												<ImageAltControl
													mediaID={mediaID}
													altSelector={altSelector}
													mediaAlt={mediaAlt}
													onChange={obj => {
														maxiSetAttributes(obj);
													}}
												/>
											),
										},
									{
										label: __('Caption', 'maxi-blocks'),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<>
													<SelectControl
														__nextHasNoMarginBottom
														value={captionType}
														className='maxi-image-caption-type'
														options={getCaptionOptions()}
														onChange={captionType => {
															maxiSetAttributes({
																captionType,
															});
															if (
																imageData &&
																captionType ===
																	'attachment'
															)
																maxiSetAttributes(
																	{
																		captionContent:
																			imageData
																				.caption
																				.raw,
																	}
																);
														}}
													/>
													{captionType !== 'none' && (
														<>
															<SelectControl
																__nextHasNoMarginBottom
																label={__(
																	'Caption position',
																	'maxi-blocks'
																)}
																className='maxi-image-inspector__caption-position'
																value={
																	captionPosition
																}
																options={[
																	{
																		label: __(
																			'Top',
																			'maxi-blocks'
																		),
																		value: 'top',
																	},
																	{
																		label: __(
																			'Bottom',
																			'maxi-blocks'
																		),
																		value: 'bottom',
																	},
																]}
																onChange={captionPosition =>
																	maxiSetAttributes(
																		{
																			captionPosition,
																		}
																	)
																}
															/>
															<AdvancedNumberControl
																label={__(
																	'Caption gap',
																	'maxi-blocks'
																)}
																className='maxi-image-inspector__caption-gap'
																placeholder={getLastBreakpointAttribute(
																	{
																		target: 'caption-gap',
																		breakpoint:
																			deviceType,
																		attributes,
																	}
																)}
																value={
																	attributes[
																		`caption-gap-${deviceType}`
																	]
																}
																onChangeValue={val =>
																	maxiSetAttributes(
																		{
																			[`caption-gap-${deviceType}`]:
																				val,
																		}
																	)
																}
																enableUnit
																unit={getLastBreakpointAttribute(
																	{
																		target: 'caption-gap-unit',
																		breakpoint:
																			deviceType,
																		attributes,
																	}
																)}
																minMaxSettings={{
																	px: {
																		min: 0,
																		max: 999,
																	},
																	em: {
																		min: 0,
																		max: 99,
																	},
																}}
																onChangeUnit={val =>
																	maxiSetAttributes(
																		{
																			[`caption-gap-unit-${deviceType}`]:
																				val,
																		}
																	)
																}
																onReset={() =>
																	maxiSetAttributes(
																		{
																			[`caption-gap-${deviceType}`]:
																				getDefaultAttribute(
																					`caption-gap-${deviceType}`
																				),
																			[`caption-gap-unit-${deviceType}`]:
																				getDefaultAttribute(
																					`caption-gap-unit-${deviceType}`
																				),
																			isReset: true,
																		}
																	)
																}
															/>
															<TypographyControl
																{...getGroupAttributes(
																	attributes,
																	[
																		'typography',
																		'textAlignment',
																		'link',
																	]
																)}
																textLevel='p'
																onChange={obj => {
																	if (
																		'content' in
																		obj
																	) {
																		const newCaptionContent =
																			obj.content;

																		delete obj.content;
																		obj.captionContent =
																			newCaptionContent;
																	}

																	maxiSetAttributes(
																		obj
																	);
																}}
																breakpoint={
																	deviceType
																}
																clientId={
																	clientId
																}
																blockStyle={
																	blockStyle
																}
																globalProps={{
																	target: '',
																	type: 'p',
																}}
																hoverGlobalProps={{
																	target: 'hover',
																	type: 'p',
																}}
																styleCardPrefix=''
																setShowLoader={
																	props.setShowLoader
																}
															/>
														</>
													)}
												</>
											</ResponsiveTabsControl>
										),
										extraIndicators: ['captionType'],
									},
									{
										label: __(
											'Hover effect',
											'maxi-blocks'
										),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<HoverEffectControl
													uniqueID={uniqueID}
													{...getGroupAttributes(
														attributes,
														[
															'hover',
															'hoverBorder',
															'hoverBorderWidth',
															'hoverBorderRadius',
															'hoverBackground',
															'hoverBackgroundColor',
															'hoverBackgroundGradient',
															'hoverMargin',
															'hoverPadding',
															'hoverTitleTypography',
															'hoverContentTypography',
														]
													)}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
													blockStyle={blockStyle}
													clientId={clientId}
												/>
											</ResponsiveTabsControl>
										),
									},
									{
										label: __('Shape mask', 'maxi-blocks'),
										content: (
											<ImageShape
												{...getGroupAttributes(
													attributes,
													'imageShape'
												)}
												onChange={obj => {
													maxiSetAttributes(obj);
												}}
												icon={SVGElement}
												breakpoint={deviceType}
											/>
										),
										extraIndicators: ['SVGElement'],
										ignoreIndicator: [
											`image-shape-scale-${deviceType}`,
											`image-shape-rotate-${deviceType}`,
											`image-shape-flip-x-${deviceType}`,
											`image-shape-flip-y-${deviceType}`,
										],
									},
									...inspectorTabs.clipPath({
										props,
										selector: '.maxi-image-block__image',
									}),
									...inspectorTabs.border({
										props,
										prefix: 'image-',
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'image-',
										dropShadow,
									}),
									...inspectorTabs.size({
										props,
										prefix: 'image-',
										isImage: true,
										hideWidth: true,
									}),
									...inspectorTabs.marginPadding({
										props,
									}),
									...inspectorTabs.savedStyles({
										props,
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
										hideHeight: fitParentSize,
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
										categories,
									}),
									...inspectorTabs.advancedCss({
										props,
									}),
									...inspectorTabs.dc({
										props,
										contentType: 'image',
									}),
									...inspectorTabs.scrollEffects({
										props,
										disabledInfoBox:
											isHoverEffectUseTransform && (
												<InfoBox
													message={getHoverEffectIncompatibleMessage(
														'scroll effects'
													)}
												/>
											),
									}),
									...inspectorTabs.transform({
										props,
										selectors,
										categories,
										disabledCategories:
											isHoverEffectUseTransform
												? [
														{
															category: 'image',
															message:
																getHoverEffectIncompatibleMessage(
																	'transform'
																),
														},
												  ]
												: undefined,
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
