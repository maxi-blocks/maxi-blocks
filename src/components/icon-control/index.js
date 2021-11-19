/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ButtonGroupControl from '../button-group-control';
import ToggleSwitch from '../toggle-switch';
import ColorControl from '../color-control';
import AxisControl from '../axis-control';
import GradientControl from '../gradient-control';
import BorderControl from '../border-control';
import InfoBox from '../info-box';
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import SvgWidthControl from '../svg-width-control';
import SvgStrokeWidthControl from '../svg-stroke-width-control';
import MaxiModal from '../../editor/library/modal';
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	backgroundColor,
	backgroundGradient,
	smileIcon,
	solid,
	styleNone,
} from '../../icons';

/**
 * Component
 */
const IconControl = props => {
	const {
		className,
		onChange,
		clientId,
		breakpoint,
		parentBlockStyle,
		isHover = false,
	} = props;

	const classes = classnames('maxi-icon-control', className);

	const [iconStyle, setIconStyle] = useState('color');

	const getOptions = () => {
		const options = [];

		options.push({
			label: <Icon icon={smileIcon} />,
			value: 'color',
		});

		options.push({
			label: <Icon icon={solid} />,
			value: 'border',
		});

		return options;
	};

	const getBackgroundOptions = () => {
		const options = [];

		options.push({
			label: <Icon icon={styleNone} />,
			value: 'none',
		});

		options.push({
			label: <Icon icon={backgroundColor} />,
			value: 'background-color',
		});

		options.push({
			label: <Icon icon={backgroundGradient} />,
			value: 'gradient',
		});

		return options;
	};

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const iconBackgroundActiveMedia = getLastBreakpointAttribute(
		'icon-background-active-media',
		breakpoint,
		props,
		isHover
	);

	return (
		<div className={classes}>
			{!isHover && breakpoint === 'general' && (
				<MaxiModal
					type='button-icon'
					style={parentBlockStyle}
					onSelect={obj => onChange(obj)}
					onRemove={obj => onChange(obj)}
					icon={props['icon-content']}
				/>
			)}
			{props['icon-content'] && (
				<>
					{!isHover && breakpoint === 'general' && (
						<>
							<hr />
							<ToggleSwitch
								label={__(
									'Icon only (remove text)',
									'maxi-blocks'
								)}
								className='maxi-color-control__palette__custom'
								selected={props['icon-only']}
								onChange={val =>
									onChange({
										'icon-only': val,
									})
								}
							/>
						</>
					)}
					<SvgWidthControl
						{...getGroupAttributes(
							props,
							`icon${isHover ? 'Hover' : ''}`,
							isHover
						)}
						onChange={obj => {
							onChange(obj);
						}}
						prefix='icon-'
						breakpoint={breakpoint}
						isHover={isHover}
					/>
					<SvgStrokeWidthControl
						{...getGroupAttributes(
							props,
							`icon${isHover ? 'Hover' : ''}`,
							isHover
						)}
						onChange={obj => {
							onChange(obj);
						}}
						prefix='icon-'
						breakpoint={breakpoint}
						isHover={isHover}
					/>
					{!isHover && (
						<>
							<AdvancedNumberControl
								label={__('Spacing', 'maxi-blocks')}
								min={0}
								max={999}
								initial={1}
								step={1}
								breakpoint={breakpoint}
								value={props[`icon-spacing-${breakpoint}`]}
								onChangeValue={val => {
									onChange({
										[`icon-spacing-${breakpoint}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								onReset={() =>
									onChange({
										[`icon-spacing-${breakpoint}`]:
											getDefaultAttribute(
												`icon-spacing-${breakpoint}`
											),
									})
								}
							/>
							{breakpoint === 'general' && (
								<>
									<ButtonGroupControl
										label={__(
											'Icon Position',
											'maxi-block'
										)}
										selected={props['icon-position']}
										options={[
											{
												label: __('Left', 'maxi-block'),
												value: 'left',
											},
											{
												label: __(
													'Right',
													'maxi-block'
												),
												value: 'right',
											},
										]}
										onChange={val =>
											onChange({
												'icon-position': val,
											})
										}
									/>
									<ToggleSwitch
										label={__(
											'Inherit Colour/Background from Button',
											'maxi-block'
										)}
										selected={props['icon-inherit']}
										onChange={val =>
											onChange({
												'icon-inherit': val,
											})
										}
									/>
								</>
							)}
						</>
					)}
					<ButtonGroupControl
						label=''
						fullWidthMode
						selected={iconStyle}
						options={getOptions()}
						onChange={val => setIconStyle(val)}
					/>
					{iconStyle === 'color' && (
						<>
							{!props['icon-inherit'] ? (
								<ColorControl
									label={__('Icon', 'maxi-blocks')}
									color={
										props[
											`icon-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									defaultColor={getDefaultAttribute(
										'icon-color',
										isHover
									)}
									paletteColor={
										props[
											`icon-palette-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									paletteOpacity={
										props[
											`icon-palette-opacity${
												isHover ? '-hover' : ''
											}`
										]
									}
									paletteStatus={
										props[
											`icon-palette-color-status${
												isHover ? '-hover' : ''
											}`
										]
									}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
										paletteOpacity,
									}) => {
										onChange({
											[`icon-color${
												isHover ? '-hover' : ''
											}`]: color,
											[`icon-palette-color${
												isHover ? '-hover' : ''
											}`]: paletteColor,
											[`icon-palette-color-status${
												isHover ? '-hover' : ''
											}`]: paletteStatus,
											[`icon-palette-opacity${
												isHover ? '-hover' : ''
											}`]: paletteOpacity,
										});
									}}
									isHover={isHover}
								/>
							) : (
								<InfoBox
									key='maxi-warning-box__icon-color'
									message={__(
										'Icon colour is inheriting from button.',
										'maxi-blocks'
									)}
									links={[
										{
											title: __(
												'Button colour',
												'maxi-blocks'
											),
											panel: 'typography',
										},
									]}
								/>
							)}
						</>
					)}
					{iconStyle === 'border' && (
						<BorderControl
							{...getGroupAttributes(props, [
								`iconBorder${isHover ? 'Hover' : ''}`,
								`iconBorderWidth${isHover ? 'Hover' : ''}`,
								`iconBorderRadius${isHover ? 'Hover' : ''}`,
							])}
							prefix='icon-'
							onChange={obj => onChange(obj)}
							breakpoint={breakpoint}
							clientId={clientId}
							isHover={isHover}
						/>
					)}
					<ButtonGroupControl
						fullWidthMode
						selected={iconBackgroundActiveMedia || 'none'}
						options={getBackgroundOptions()}
						optionType='string'
						onChange={val =>
							onChange({
								[getAttributeKey(
									'background-active-media',
									isHover,
									'icon-',
									breakpoint
								)]: val,
							})
						}
					/>
					{iconBackgroundActiveMedia === 'background-color' && (
						<>
							{!props['icon-inherit'] ? (
								<ColorControl
									label={__('Icon background', 'maxi-blocks')}
									paletteStatus={getLastBreakpointAttribute(
										'icon-background-palette-color-status',
										breakpoint,
										props,
										isHover
									)}
									paletteColor={getLastBreakpointAttribute(
										'icon-background-palette-color',
										breakpoint,
										props,
										isHover
									)}
									paletteOpacity={getLastBreakpointAttribute(
										'icon-background-palette-opacity',
										breakpoint,
										props,
										isHover
									)}
									color={getLastBreakpointAttribute(
										'icon-background-color',
										breakpoint,
										props,
										isHover
									)}
									defaultColor={getDefaultAttribute(
										getAttributeKey(
											'background-color',
											isHover,
											'icon-',
											breakpoint
										)
									)}
									onChange={({
										paletteStatus,
										paletteColor,
										paletteOpacity,
										color,
									}) => {
										onChange({
											[getAttributeKey(
												'background-palette-color-status',
												isHover,
												'icon-',
												breakpoint
											)]: paletteStatus,
											[getAttributeKey(
												'background-palette-color',
												isHover,
												'icon-',
												breakpoint
											)]: paletteColor,
											[getAttributeKey(
												'background-palette-opacity',
												isHover,
												'icon-',
												breakpoint
											)]: paletteOpacity,
											[getAttributeKey(
												'background-color',
												isHover,
												'icon-',
												breakpoint
											)]: color,
										});
									}}
									isHover={isHover}
								/>
							) : (
								<InfoBox
									key='maxi-warning-box__icon-background'
									message={__(
										'Icon background is inheriting from button.',
										'maxi-blocks'
									)}
									links={[
										{
											title: __(
												'Button Background colour',
												'maxi-blocks'
											),
											panel: 'background',
										},
									]}
								/>
							)}
						</>
					)}
					{iconBackgroundActiveMedia === 'gradient' && (
						<GradientControl
							label={__(
								'Icon Background Gradient',
								'maxi-blocks'
							)}
							gradient={getLastBreakpointAttribute(
								'icon-background-gradient',
								breakpoint,
								props,
								isHover
							)}
							gradientOpacity={getLastBreakpointAttribute(
								'icon-background-gradient-opacity',
								breakpoint,
								props,
								isHover
							)}
							defaultGradient={getDefaultAttribute(
								getAttributeKey(
									'background-gradient',
									isHover,
									'icon-',
									breakpoint
								)
							)}
							onChange={val =>
								onChange({
									[getAttributeKey(
										'background-gradient',
										isHover,
										'icon-',
										breakpoint
									)]: val,
								})
							}
							onChangeOpacity={val =>
								onChange({
									[getAttributeKey(
										'background-gradient-opacity',
										isHover,
										'icon-',
										breakpoint
									)]: val,
								})
							}
							isHover={isHover}
						/>
					)}
					{!isHover && (
						<AxisControl
							{...getGroupAttributes(props, 'iconPadding')}
							label={__('Icon Padding', 'maxi-blocks')}
							onChange={obj => onChange(obj)}
							breakpoint={breakpoint}
							target='icon-padding'
							disableAuto
							minMaxSettings={minMaxSettings}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default IconControl;
