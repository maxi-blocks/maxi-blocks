/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	AxisControl,
	BackgroundControl,
	BorderControl,
	Icon,
	SelectControl,
	TextareaControl,
	ToggleSwitch,
	TypographyControl,
	SettingTabsControl,
} from '../../../../components';

/**
 * External dependencies
 */
import BezierEditor from 'bezier-easing-editor';

import {
	getAttributesValue,
	getDefaultAttribute,
	getGroupAttributes,
} from '../../../../extensions/attributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import {
	hoverNone,
	hoverBasic,
	hoverText,
	alignCenterCenter,
	alignLeftTop,
	alignLeftBottom,
	alignRightTop,
	alignRightBottom,
} from '../../../../icons';

/**
 * Component
 */
const HoverEffectControl = props => {
	const {
		className,
		onChangeInline,
		onChange,
		blockStyle,
		clientId,
		breakpoint,
	} = props;
	const {
		hoverType,
		hoverBasicEffectType,
		hoverTransitionDuration,
		hoverPreview,
		hoverExtension,
		hoverTransitionEasing,
		hoverTransitionEasingCubicBezier,
		hoverTextEffectType,
		hoverTextPreset,
		hoverTitleTypographyContent,
		hoverTitleTypographyStatus,
		hoverContentTypographyContent,
		hoverContentTypographyStatus,
		hoverBorderStatus,
		hoverPaddingStatus,
		hoverMarginStatus,
	} = getAttributesValue({
		targets: [
			'hover-type',
			'hover-basic-effect-type',
			'hover-transition-duration',
			'hover-preview',
			'hover-extension',
			'hover-transition-easing',
			'hover-transition-easing-cubic-bezier',
			'hover-text-effect-type',
			'hover-text-preset',
			'hover-title-typography-content',
			'hover-title-typography-status',
			'hover-content-typography-content',
			'hover-content-typography-status',
			'hover-border-status',
			'hover-padding-status',
			'hover-margin-status',
		],
		props,
	});

	const classes = classnames('maxi-hover-effect-control', className);

	const effectNone = () => {
		onChange({
			'hover-type': 'none',
		});
		document
			.getElementsByClassName('maxi-image-block__image')[0]
			.removeAttribute('style');
	};

	const disablePreview = () => {
		onChange({
			'hover-preview': false,
		});
		document
			.getElementsByClassName('maxi-image-block__image')[0]
			.removeAttribute('style');
	};

	return (
		<div className={classes}>
			<SettingTabsControl
				label={__('Hover animation', 'maxi-blocks')}
				type='buttons'
				selected={hoverType}
				items={[
					{ icon: <Icon icon={hoverNone} />, value: 'none' },
					{ icon: <Icon icon={hoverBasic} />, value: 'basic' },
					{ icon: <Icon icon={hoverText} />, value: 'text' },
				]}
				onChange={val => {
					val === 'none'
						? effectNone()
						: onChange({
								'hover-type': val,
								'hover-transition-duration': 0.5,
						  });
				}}
				hasBorder
			/>
			{hoverType !== 'none' && (
				<>
					<ToggleSwitch
						label={__('Show hover preview', 'maxi-blocks')}
						selected={hoverPreview}
						onChange={val => {
							val === false
								? disablePreview()
								: onChange({ 'hover-preview': val });
						}}
					/>
					<ToggleSwitch
						label={__('Extend outside boundary', 'maxi-blocks')}
						selected={hoverExtension}
						onChange={val => onChange({ 'hover-extension': val })}
					/>
				</>
			)}
			{hoverType !== 'none' &&
				(hoverType === 'text' ||
					[
						'zoom-in',
						'zoom-out',
						'slide',
						'rotate',
						'blur',
						'sepia',
						'clear-sepia',
						'grey-scale',
						'clear-grey-scale',
					].includes(hoverBasicEffectType)) && (
					<>
						<AdvancedNumberControl
							label={__('Duration(s)', 'maxi-blocks')}
							value={hoverTransitionDuration}
							onChangeValue={val => {
								onChange({
									'hover-transition-duration':
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							step={0.1}
							max={10}
							onReset={() =>
								onChange({
									'hover-transition-duration':
										getDefaultAttribute(
											'hover-transition-duration'
										),
									isReset: true,
								})
							}
							initialPosition={getDefaultAttribute(
								'hover-transition-duration'
							)}
						/>
						<SelectControl
							label={__('Easing', 'maxi-blocks')}
							value={hoverTransitionEasing}
							defaultValue={getDefaultAttribute(
								'hover-transition-easing'
							)}
							onReset={() =>
								onChange({
									'hover-transition-easing':
										getDefaultAttribute(
											'hover-transition-easing'
										),
									isReset: true,
								})
							}
							onChange={val =>
								onChange({ 'hover-transition-easing': val })
							}
							options={[
								{
									label: __('Ease', 'maxi-blocks'),
									value: 'ease',
								},
								{
									label: __('Linear', 'maxi-blocks'),
									value: 'linear',
								},
								{
									label: __('Ease-in', 'maxi-blocks'),
									value: 'ease-in',
								},
								{
									label: __('Ease-out', 'maxi-blocks'),
									value: 'ease-out',
								},
								{
									label: __('Ease-in-out', 'maxi-blocks'),
									value: 'ease-in-out',
								},
								{
									label: __('Cubic-bezier', 'maxi-blocks'),
									value: 'cubic-bezier',
								},
							]}
						/>
					</>
				)}
			{hoverTransitionEasing === 'cubic-bezier' && (
				<BezierEditor
					value={hoverTransitionEasingCubicBezier}
					onChange={val =>
						onChange({
							'hover-transition-easing-cubic-bezier': val,
						})
					}
				/>
			)}
			{hoverType === 'basic' && (
				<>
					<SelectControl
						label={__('Effect type', 'maxi-blocks')}
						value={hoverBasicEffectType}
						defaultValue={getDefaultAttribute(
							'hover-basic-effect-type'
						)}
						onReset={() =>
							onChange({
								'hover-basic-effect-type': getDefaultAttribute(
									'hover-basic-effect-type'
								),
								isReset: true,
							})
						}
						onChange={val =>
							onChange({ 'hover-basic-effect-type': val })
						}
						options={[
							{
								label: __('Zoom in', 'maxi-blocks'),
								value: 'zoom-in',
							},
							{
								label: __('Zoom out', 'maxi-blocks'),
								value: 'zoom-out',
							},
							{
								label: __('Slide', 'maxi-blocks'),
								value: 'slide',
							},
							{
								label: __('Rotate', 'maxi-blocks'),
								value: 'rotate',
							},
							{
								label: __('Flashing', 'maxi-blocks'),
								value: 'flashing',
							},
							{ label: __('Blur', 'maxi-blocks'), value: 'blur' },
							{
								label: __('Sepia', 'maxi-blocks'),
								value: 'sepia',
							},
							{
								label: __('Clear sepia', 'maxi-blocks'),
								value: 'clear-sepia',
							},
							{
								label: __('Gray scale', 'maxi-blocks'),
								value: 'grey-scale',
							},
							{
								label: __('Clear gray scale', 'maxi-blocks'),
								value: 'clear-grey-scale',
							},
							{
								label: __('Shine', 'maxi-blocks'),
								value: 'shine',
							},
							{
								label: __('Circle shine', 'maxi-blocks'),
								value: 'circle-shine',
							},
						]}
					/>
					{hoverType === 'basic' &&
						(hoverBasicEffectType === 'zoom-in' ||
							hoverBasicEffectType === 'zoom-out' ||
							hoverBasicEffectType === 'rotate' ||
							hoverBasicEffectType === 'blur' ||
							hoverBasicEffectType === 'slide') && (
							<AdvancedNumberControl
								label={__('Amount', 'maxi-blocks')}
								value={getAttributesValue({
									target: `hover-basic-${hoverBasicEffectType}-value`,
									props,
								})}
								onChangeValue={val => {
									onChange({
										[`hover-basic-${hoverBasicEffectType}-value`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={0}
								step={0.1}
								max={100}
								onReset={() =>
									onChange({
										[`hover-basic-${hoverBasicEffectType}-value`]:
											getDefaultAttribute(
												`hover-basic-${hoverBasicEffectType}-value`
											),
										isReset: true,
									})
								}
								initialPosition={getDefaultAttribute(
									`hover-basic-${hoverBasicEffectType}-value`
								)}
							/>
						)}
				</>
			)}
			{hoverType === 'text' && (
				<>
					<SelectControl
						label={__('Animation type', 'maxi-blocks')}
						value={hoverTextEffectType}
						defaultValue={getDefaultAttribute(
							'hover-text-effect-type'
						)}
						onReset={() =>
							onChange({
								'hover-text-effect-type': getDefaultAttribute(
									'hover-text-effect-type'
								),
								isReset: true,
							})
						}
						options={[
							{ label: __('Fade', 'maxi-blocks'), value: 'fade' },
							{
								label: __('Push up', 'maxi-blocks'),
								value: 'push-up',
							},
							{
								label: __('Push right', 'maxi-blocks'),
								value: 'push-right',
							},
							{
								label: __('Push down', 'maxi-blocks'),
								value: 'push-down',
							},
							{
								label: __('Push left', 'maxi-blocks'),
								value: 'push-left',
							},
							{
								label: __('Slide up', 'maxi-blocks'),
								value: 'slide-up',
							},
							{
								label: __('Slide right', 'maxi-blocks'),
								value: 'slide-right',
							},
							{
								label: __('Slide down', 'maxi-blocks'),
								value: 'slide-down',
							},
							{
								label: __('Slide left', 'maxi-blocks'),
								value: 'slide-left',
							},
							{
								label: __('Flip horizontal', 'maxi-blocks'),
								value: 'flip-horiz',
							},
						]}
						onChange={val =>
							onChange({ 'hover-text-effect-type': val })
						}
					/>
					<SettingTabsControl
						type='buttons'
						fullWidthMode
						selected={hoverTextPreset}
						items={[
							{
								icon: <Icon icon={alignLeftTop} />,
								value: 'left-top',
							},
							{
								icon: <Icon icon={alignRightTop} />,
								value: 'right-top',
							},
							{
								icon: <Icon icon={alignCenterCenter} />,
								value: 'center-center',
							},
							{
								icon: <Icon icon={alignLeftBottom} />,
								value: 'left-bottom',
							},
							{
								icon: <Icon icon={alignRightBottom} />,
								value: 'right-bottom',
							},
						]}
						onChange={val => onChange({ 'hover-text-preset': val })}
					/>
					<TextareaControl
						placeholder={__(
							'Add hover title text here',
							'maxi-blocks'
						)}
						value={hoverTitleTypographyContent}
						onChange={val =>
							onChange({
								'hover-title-typography-content': isNil(val)
									? getDefaultAttribute(
											'hover-title-typography-content'
									  )
									: val,
							})
						}
					/>
					<ToggleSwitch
						label={__('Custom hover text', 'maxi-block')}
						selected={hoverTitleTypographyStatus}
						onChange={val =>
							onChange({
								'hover-title-typography-status': val,
							})
						}
					/>
					{hoverTitleTypographyStatus && (
						<TypographyControl
							typography={{
								...getGroupAttributes(
									props,
									'hoverTitleTypography'
								),
							}}
							hideAlignment
							onChangeInline={onChangeInline}
							onChange={onChange}
							prefix='hover-title-'
							disableCustomFormats
							blockStyle={blockStyle}
							clientId={clientId}
							globalProps={{
								target: '',
								type: 'h4',
							}}
							textLevel='h4'
							inlineTarget='maxi-hover-details__content h4'
						/>
					)}
					<hr />
					<TextareaControl
						placeholder={__(
							'Add hover content text here',
							'maxi-blocks'
						)}
						value={hoverContentTypographyContent}
						onChange={val =>
							onChange({
								'hover-content-typography-content': isNil(val)
									? getDefaultAttribute(
											'hover-content-typography-content'
									  )
									: val,
							})
						}
					/>
					<ToggleSwitch
						label={__('Custom content text', 'maxi-block')}
						selected={hoverContentTypographyStatus}
						onChange={val =>
							onChange({
								'hover-content-typography-status': val,
							})
						}
					/>
					{hoverContentTypographyStatus && (
						<TypographyControl
							typography={{
								...getGroupAttributes(
									props,
									'hoverContentTypography'
								),
							}}
							hideAlignment
							onChange={onChange}
							prefix='hover-content-'
							disableCustomFormats
							blockStyle={blockStyle}
							clientId={clientId}
							globalProps={{
								target: '',
								type: 'p',
							}}
							textLevel='p'
							inlineTarget='maxi-hover-details__content p'
						/>
					)}
					<hr />
					<BackgroundControl
						{...getGroupAttributes(props, [
							'hoverBackground',
							'hoverBackgroundColor',
							'hoverBackgroundGradient',
						])}
						onChangeInline={obj =>
							onChangeInline(obj, '.maxi-hover-details__content')
						}
						onChange={onChange}
						disableClipPath
						disableImage
						disableVideo
						disableSVG
						prefix='hover-'
						clientId={clientId}
					/>
					<ToggleSwitch
						label={__('Custom border', 'maxi-block')}
						selected={hoverBorderStatus}
						onChange={val =>
							onChange({
								'hover-border-status': val,
							})
						}
					/>
					{hoverBorderStatus && (
						<BorderControl
							{...getGroupAttributes(props, [
								'hoverBorder',
								'hoverBorderWidth',
								'hoverBorderRadius',
							])}
							onChangeInline={obj =>
								onChangeInline(
									obj,
									'.maxi-hover-details__content'
								)
							}
							onChange={onChange}
							prefix='hover-'
							disablePalette
							clientId={clientId}
						/>
					)}
					<ToggleSwitch
						label={__('Custom padding', 'maxi-block')}
						selected={hoverPaddingStatus}
						onChange={val =>
							onChange({
								'hover-padding-status': val,
							})
						}
					/>
					{hoverPaddingStatus && (
						<AxisControl
							{...getGroupAttributes(props, 'hoverPadding')}
							label={__('Padding', 'maxi-blocks')}
							onChange={onChange}
							target='hover-padding'
							breakpoint={breakpoint}
							disableAuto
						/>
					)}
					<ToggleSwitch
						label={__('Custom margin', 'maxi-block')}
						selected={hoverMarginStatus}
						onChange={val =>
							onChange({
								'hover-margin-status': val,
							})
						}
					/>
					{hoverMarginStatus && (
						<AxisControl
							{...getGroupAttributes(props, 'hoverMargin')}
							label={__('Margin', 'maxi-blocks')}
							onChange={onChange}
							target='hover-margin'
							optionType='string'
							breakpoint={breakpoint}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default HoverEffectControl;
