/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AdvancedNumberControl,
	ImageAltControl,
	ImageShape,
	ResponsiveTabsControl,
	SelectControl,
	SettingTabsControl,
	TypographyControl,
} from '../../components';
import { DimensionTab, HoverEffectControl } from './components';
import {
	getAttributesValue,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import * as inspectorTabs from '../../components/inspector-tabs';
import { customCss } from './data';
import { withMaxiInspector } from '../../extensions/inspector';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, clientId, deviceType, maxiSetAttributes } = props;
	const {
		_as: altSelector,
		_bs: blockStyle,
		_ct: captionType,
		_mal: mediaAlt,
		_se: SVGElement,
		_uid: uniqueID,
		_mi: mediaID,
		_cpo: captionPosition,
		_fps: fitParentSize,
		'dc.s': dcStatus,
	} = attributes;
	const { selectors, categories } = customCss;
	const imageFullWidthGeneral = getAttributesValue({
		target: 'fw-general',
		props: attributes,
	});
	const captionGap = getAttributesValue({
		target: '_cg',
		props: attributes,
		breakpoint: deviceType,
	});

	const imageData = useSelect(
		select => select('core').getMedia(mediaID),
		[mediaID]
	);

	const dropShadow =
		(getLastBreakpointAttribute({
			target: '_cp',
			breakpoint: deviceType,
			attributes,
		}) &&
			getLastBreakpointAttribute({
				target: '_cp.s',
				breakpoint: deviceType,
				attributes,
			})) ||
		!isEmpty(SVGElement);

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
									deviceType === 'general' &&
										imageFullWidthGeneral !== 'full' && {
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
											extraIndicators: ['_ir', '_iw'],
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
														value={captionType}
														className='maxi-image-caption-type'
														options={getCaptionOptions()}
														onChange={captionType => {
															maxiSetAttributes({
																_ct: captionType,
															});
															if (
																imageData &&
																captionType ===
																	'attachment'
															)
																maxiSetAttributes(
																	{
																		_cco: imageData
																			.caption
																			.raw,
																	}
																);
														}}
													/>
													{captionType !== 'none' && (
														<>
															<SelectControl
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
																			_cpo: captionPosition,
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
																		target: '_cg',
																		breakpoint:
																			deviceType,
																		attributes,
																	}
																)}
																value={
																	captionGap
																}
																onChangeValue={val =>
																	maxiSetAttributes(
																		{
																			[`_cg-${deviceType}`]:
																				val,
																		}
																	)
																}
																enableUnit
																unit={getLastBreakpointAttribute(
																	{
																		target: '_cg.u',
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
																			[`_cg.u-${deviceType}`]:
																				val,
																		}
																	)
																}
																onReset={() =>
																	maxiSetAttributes(
																		{
																			[`_cg-${deviceType}`]:
																				getDefaultAttribute(
																					`_cg-${deviceType}`
																				),
																			[`_cg.u-${deviceType}`]:
																				getDefaultAttribute(
																					`_cg.u-${deviceType}`
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
																		obj._cco =
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
										extraIndicators: ['_se'],
										ignoreIndicator: [
											`is_sc-${deviceType}`,
											`is_rot-${deviceType}`,
											`is_fx-${deviceType}`,
											`is_fy-${deviceType}`,
										],
									},
									...inspectorTabs.clipPath({
										props,
										selector: '.maxi-image-block__image',
									}),
									...inspectorTabs.border({
										props,
										prefix: 'im-',
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'im-',
										dropShadow,
									}),
									...inspectorTabs.size({
										props,
										prefix: 'im-',
										isImage: true,
										hideWidth: true,
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: 'im-',
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
									...inspectorTabs.dc({
										props,
										contentType: 'image',
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										selectors,
										categories,
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
