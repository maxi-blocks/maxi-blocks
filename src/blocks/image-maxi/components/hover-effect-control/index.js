/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import AxisControl from '@components/axis-control';
import BackgroundControl from '@components/background-control';
import BorderControl from '@components/border-control';
import Icon from '@components/icon';
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import TextareaControl from '@components/textarea-control';
import ToggleSwitch from '@components/toggle-switch';
import TypographyControl from '@components/typography-control';

import BezierEditor from 'bezier-easing-editor';

import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';

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
} from '@maxi-icons';

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

	const classes = classnames('maxi-hover-effect-control', className);

	const setEffectNone = () => {
		onChange({
			'hover-type': 'none',
		});
		document
			.querySelector(`#block-${clientId} .maxi-image-block__image`)
			.removeAttribute('style');
	};

	const disablePreview = () => {
		onChange({
			[getAttributeKey('hover-preview', false, false, breakpoint)]: false,
		});
		document
			.querySelector(`#block-${clientId} .maxi-image-block__image`)
			.removeAttribute('style');
	};

	const hoverPreview = getLastBreakpointAttribute({
		target: 'hover-preview',
		breakpoint,
		attributes: props,
	});
	const hoverExtension = getLastBreakpointAttribute({
		target: 'hover-extension',
		breakpoint,
		attributes: props,
	});
	const hoverBorderStatus = getLastBreakpointAttribute({
		target: 'hover-border-status',
		breakpoint,
		attributes: props,
	});
	const hoverPaddingStatus = getLastBreakpointAttribute({
		target: 'hover-padding-status',
		breakpoint,
		attributes: props,
	});
	const hoverMarginStatus = getLastBreakpointAttribute({
		target: 'hover-margin-status',
		breakpoint,
		attributes: props,
	});
	const hoverTitleTypographyStatus = getLastBreakpointAttribute({
		target: 'hover-title-typography-status',
		breakpoint,
		attributes: props,
	});
	const hoverContentTypographyStatus = getLastBreakpointAttribute({
		target: 'hover-content-typography-status',
		breakpoint,
		attributes: props,
	});

	return (
		<div className={classes}>
			<SettingTabsControl
				className='maxi-hover-effect-control__tabs'
				label={__('Hover animation', 'maxi-blocks')}
				type='buttons'
				selected={props['hover-type']}
				items={[
					{ icon: <Icon icon={hoverNone} />, value: 'none' },
					{ icon: <Icon icon={hoverBasic} />, value: 'basic' },
					{ icon: <Icon icon={hoverText} />, value: 'text' },
				]}
				onChange={val => {
					val === 'none'
						? setEffectNone()
						: onChange({
								'hover-type': val,
								'hover-transition-duration': 0.5,
						  });
				}}
				hasBorder
			/>
			{props['hover-type'] !== 'none' && (
				<>
					<ToggleSwitch
						label={__('Show hover preview', 'maxi-blocks')}
						selected={hoverPreview}
						onChange={val => {
							val === false
								? disablePreview()
								: onChange({
										[getAttributeKey(
											'hover-preview',
											false,
											false,
											breakpoint
										)]: val,
								  });
						}}
					/>
					<ToggleSwitch
						label={__('Extend outside boundary', 'maxi-blocks')}
						selected={hoverExtension}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'hover-extension',
									false,
									false,
									breakpoint
								)]: val,
							})
						}
					/>
				</>
			)}
			{props['hover-type'] !== 'none' &&
				(props['hover-type'] === 'text' ||
					props['hover-basic-effect-type'] === 'zoom-in' ||
					props['hover-basic-effect-type'] === 'zoom-out' ||
					props['hover-basic-effect-type'] === 'slide' ||
					props['hover-basic-effect-type'] === 'rotate' ||
					props['hover-basic-effect-type'] === 'blur' ||
					props['hover-basic-effect-type'] === 'sepia' ||
					props['hover-basic-effect-type'] === 'clear-sepia' ||
					props['hover-basic-effect-type'] === 'grey-scale' ||
					props['hover-basic-effect-type'] ===
						'clear-grey-scale') && (
					<AdvancedNumberControl
						label={__('Duration(s)', 'maxi-blocks')}
						value={props['hover-transition-duration']}
						onChangeValue={(val, meta) => {
							onChange({
								'hover-transition-duration':
									val !== undefined && val !== '' ? val : '',
								meta,
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
				)}
			{props['hover-type'] !== 'none' &&
				(props['hover-type'] === 'text' ||
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
					].includes(props['hover-basic-effect-type'])) && (
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Easing', 'maxi-blocks')}
						value={props['hover-transition-easing']}
						defaultValue={getDefaultAttribute(
							'hover-transition-easing'
						)}
						onReset={() =>
							onChange({
								'hover-transition-easing': getDefaultAttribute(
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
				)}
			{props['hover-transition-easing'] === 'cubic-bezier' && (
				<BezierEditor
					value={props['hover-transition-easing-cubic-bezier']}
					onChange={val =>
						onChange({
							'hover-transition-easing-cubic-bezier': val,
						})
					}
				/>
			)}
			{props['hover-type'] === 'basic' && (
				<>
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Effect type', 'maxi-blocks')}
						value={props['hover-basic-effect-type']}
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
					{props['hover-type'] === 'basic' &&
						(props['hover-basic-effect-type'] === 'zoom-in' ||
							props['hover-basic-effect-type'] === 'zoom-out' ||
							props['hover-basic-effect-type'] === 'rotate' ||
							props['hover-basic-effect-type'] === 'blur' ||
							props['hover-basic-effect-type'] === 'slide') && (
							<AdvancedNumberControl
								label={__('Amount', 'maxi-blocks')}
								value={
									props[
										`hover-basic-${props['hover-basic-effect-type']}-value`
									]
								}
								onChangeValue={(val, meta) => {
									onChange({
										[`hover-basic-${props['hover-basic-effect-type']}-value`]:
											val !== undefined && val !== ''
												? val
												: '',
										meta,
									});
								}}
								min={0}
								step={0.1}
								max={100}
								onReset={() =>
									onChange({
										[`hover-basic-${props['hover-basic-effect-type']}-value`]:
											getDefaultAttribute(
												`hover-basic-${props['hover-basic-effect-type']}-value`
											),
										isReset: true,
									})
								}
								initialPosition={getDefaultAttribute(
									`hover-basic-${props['hover-basic-effect-type']}-value`
								)}
							/>
						)}
				</>
			)}
			{props['hover-type'] === 'text' && (
				<>
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Animation type', 'maxi-blocks')}
						value={props['hover-text-effect-type']}
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
						target='hover-text-preset'
						selected={props['hover-text-preset']}
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
						value={props['hover-title-typography-content']}
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
						label={__('Custom hover text', 'maxi-blocks')}
						selected={hoverTitleTypographyStatus}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'hover-title-typography-status',
									false,
									false,
									breakpoint
								)]: val,
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
							{...(onChangeInline && { onChangeInline })}
							onChange={onChange}
							prefix='hover-title-'
							disableCustomFormats
							showBottomGap
							blockStyle={blockStyle}
							clientId={clientId}
							breakpoint={breakpoint}
							tabsClassName='mb-hover-bg'
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
						value={props['hover-content-typography-content']}
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
						label={__('Custom content text', 'maxi-blocks')}
						selected={hoverContentTypographyStatus}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'hover-content-typography-status',
									false,
									false,
									breakpoint
								)]: val,
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
							breakpoint={breakpoint}
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
						{...(onChangeInline && {
							onChangeInline: obj =>
								onChangeInline(obj, '.maxi-hover-details__content'),
						})}
						onChange={onChange}
						tabsClassName='mb-hover-bg'
						disableClipPath
						disableImage
						disableVideo
						disableSVG
						prefix='hover-'
						clientId={clientId}
						breakpoint={breakpoint}
					/>
					<ToggleSwitch
						label={__('Custom border', 'maxi-blocks')}
						selected={hoverBorderStatus}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'hover-border-status',
									false,
									false,
									breakpoint
								)]: val,
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
							{...(onChangeInline && {
								onChangeInline: obj =>
									onChangeInline(
										obj,
										'.maxi-hover-details__content'
									),
							})}
							onChange={onChange}
							prefix='hover-'
							breakpoint={breakpoint}
							clientId={clientId}
							globalProps={{
								target: 'border',
								type: 'border',
							}}
						/>
					)}
					<ToggleSwitch
						label={__('Custom padding', 'maxi-blocks')}
						selected={hoverPaddingStatus}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'hover-padding-status',
									false,
									false,
									breakpoint
								)]: val,
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
							optionType='string'
							enableAxisUnits
						/>
					)}
					<ToggleSwitch
						label={__('Custom margin', 'maxi-blocks')}
						selected={hoverMarginStatus}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'hover-margin-status',
									false,
									false,
									breakpoint
								)]: val,
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
							enableAxisUnits
						/>
					)}
				</>
			)}
		</div>
	);
};

export default HoverEffectControl;
