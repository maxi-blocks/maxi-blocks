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
	const [
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
	] = getAttributesValue({
		target: [
			'h_ty',
			'h_bet',
			'h_tdu',
			'h_pr',
			'h_ex',
			'h_te',
			'h_tecb',
			'h_tety',
			'h_tp',
			'h-ti-t_c',
			'h-ti-t.s',
			'hc-t_c',
			'hc-t.s',
			'h-bo.s',
			'h_p.s',
			'h_m.s',
		],
		props,
	});

	const shortEffectType = `${hoverBasicEffectType?.[0]}${
		hoverBasicEffectType === 'zoom-in'
			? 'i'
			: hoverBasicEffectType === 'zoom-out'
			? 'o'
			: ''
	}`;

	const classes = classnames('maxi-hover-effect-control', className);

	const effectNone = () => {
		onChange({
			h_ty: 'none',
		});
		document
			.getElementsByClassName('maxi-image-block__image')[0]
			.removeAttribute('style');
	};

	const disablePreview = () => {
		onChange({
			h_pr: false,
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
								h_ty: val,
								h_tdu: 0.5,
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
								: onChange({ h_pr: val });
						}}
					/>
					<ToggleSwitch
						label={__('Extend outside boundary', 'maxi-blocks')}
						selected={hoverExtension}
						onChange={val => onChange({ h_ex: val })}
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
									h_tdu:
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
									h_tdu: getDefaultAttribute('h_tdu'),
									isReset: true,
								})
							}
							initialPosition={getDefaultAttribute('h_tdu')}
						/>
						<SelectControl
							label={__('Easing', 'maxi-blocks')}
							value={hoverTransitionEasing}
							defaultValue={getDefaultAttribute('h_te')}
							onReset={() =>
								onChange({
									h_te: getDefaultAttribute('h_te'),
									isReset: true,
								})
							}
							onChange={val => onChange({ h_te: val })}
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
							h_tecb: val,
						})
					}
				/>
			)}
			{hoverType === 'basic' && (
				<>
					<SelectControl
						label={__('Effect type', 'maxi-blocks')}
						value={hoverBasicEffectType}
						defaultValue={getDefaultAttribute('h_bet')}
						onReset={() =>
							onChange({
								h_bet: getDefaultAttribute('h_bet'),
								isReset: true,
							})
						}
						onChange={val => onChange({ h_bet: val })}
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
									target: `h_b${shortEffectType}v`,
									props,
								})}
								onChangeValue={val => {
									onChange({
										[`h_b${shortEffectType}v`]:
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
										[`h_b${shortEffectType}v`]:
											getDefaultAttribute(
												`h_b${shortEffectType}v`
											),
										isReset: true,
									})
								}
								initialPosition={getDefaultAttribute(
									`h_b${shortEffectType}v`
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
						defaultValue={getDefaultAttribute('h_tety')}
						onReset={() =>
							onChange({
								h_tety: getDefaultAttribute('h_tety'),
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
						onChange={val => onChange({ h_tety: val })}
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
						onChange={val => onChange({ h_tp: val })}
					/>
					<TextareaControl
						placeholder={__(
							'Add hover title text here',
							'maxi-blocks'
						)}
						value={hoverTitleTypographyContent}
						onChange={val =>
							onChange({
								'h-ti-t_c': isNil(val)
									? getDefaultAttribute('h-ti-t_c')
									: val,
							})
						}
					/>
					<ToggleSwitch
						label={__('Custom hover text', 'maxi-block')}
						selected={hoverTitleTypographyStatus}
						onChange={val =>
							onChange({
								'h-ti-t.s': val,
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
							prefix='h-ti-'
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
								'hc-t_c': isNil(val)
									? getDefaultAttribute('hc-t_c')
									: val,
							})
						}
					/>
					<ToggleSwitch
						label={__('Custom content text', 'maxi-block')}
						selected={hoverContentTypographyStatus}
						onChange={val =>
							onChange({
								'hc-t.s': val,
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
							prefix='hc-'
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
						prefix='h-'
						clientId={clientId}
					/>
					<ToggleSwitch
						label={__('Custom border', 'maxi-block')}
						selected={hoverBorderStatus}
						onChange={val =>
							onChange({
								'h-bo.s': val,
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
							prefix='h-'
							disablePalette
							clientId={clientId}
							breakpoint={breakpoint}
						/>
					)}
					<ToggleSwitch
						label={__('Custom padding', 'maxi-block')}
						selected={hoverPaddingStatus}
						onChange={val =>
							onChange({
								'h_p.s': val,
							})
						}
					/>
					{hoverPaddingStatus && (
						<AxisControl
							{...getGroupAttributes(props, 'hoverPadding')}
							label={__('Padding', 'maxi-blocks')}
							onChange={onChange}
							target='h_p'
							breakpoint={breakpoint}
							disableAuto
						/>
					)}
					<ToggleSwitch
						label={__('Custom margin', 'maxi-block')}
						selected={hoverMarginStatus}
						onChange={val =>
							onChange({
								'h_m.s': val,
							})
						}
					/>
					{hoverMarginStatus && (
						<AxisControl
							{...getGroupAttributes(props, 'hoverMargin')}
							label={__('Margin', 'maxi-blocks')}
							onChange={onChange}
							target='h_m'
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
