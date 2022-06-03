/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import ColorControl from '../color-control';
import AxisControl from '../axis-control';
import GradientControl from '../gradient-control';
import BorderControl from '../border-control';
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
	getColorRGBAString,
} from '../../extensions/styles';
import {
	setSVGStrokeWidth,
	setSVGContent,
	setSVGContentHover,
} from '../../extensions/svg';
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
import {
	backgroundColor,
	backgroundGradient,
	iconBorder,
	styleNone,
	iconStroke,
	iconFill,
} from '../../icons';

/**
 * Component
 */
const ArrowIconControl = props => {
	const {
		className,
		onChangeInline = null,
		onChange,
		clientId,
		svgType,
		breakpoint,
		blockStyle,
		isHover = false,
	} = props;

	const classes = classnames('maxi-icon-control', className);

	const [iconStyle, setIconStyle] = useState('color');

	const getOptions = () => {
		const options = [];

		if (svgType !== 'Shape')
			options.push({
				icon: <Icon icon={iconBorder} />,
				value: 'color',
			});
		else if (iconStyle === 'color') setIconStyle('fill');

		if (svgType !== 'Line')
			options.push({
				icon: <Icon icon={iconFill} />,
				value: 'fill',
			});
		else if (iconStyle === 'fill') setIconStyle('color');

		options.push({
			icon: <Icon icon={iconStroke} />,
			value: 'border',
		});

		return options;
	};

	const getBackgroundOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={styleNone} />,
			value: 'none',
		});

		options.push({
			icon: <Icon icon={backgroundColor} />,
			value: 'color',
		});

		options.push({
			icon: <Icon icon={backgroundGradient} />,
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

	const arrowFirstIconBackgroundActiveMedia = getLastBreakpointAttribute({
		target: 'navigation-arrow-first-icon-background-active-media',
		breakpoint,
		attributes: props,
		isHover,
	});

	const [arrowFirstIconBgActive, setArrowFirstIconBgActive] = useState(
		arrowFirstIconBackgroundActiveMedia || 'none'
	);

	const arrowSecondIconBackgroundActiveMedia = getLastBreakpointAttribute({
		target: 'navigation-arrow-second-icon-background-active-media',
		breakpoint,
		attributes: props,
		isHover,
	});

	const [arrowSecondIconBgActive, setArrowSecondIconBgActive] = useState(
		arrowSecondIconBackgroundActiveMedia || 'none'
	);

	const arrowBothIconBackgroundActiveMedia = getLastBreakpointAttribute({
		target: 'navigation-arrow-both-icon-background-active-media',
		breakpoint,
		attributes: props,
		isHover,
	});

	const [arrowBothIconBgActive, setArrowBothIconBgActive] = useState(
		arrowBothIconBackgroundActiveMedia || 'none'
	);

	return (
		<div className={classes}>
			{!isHover && breakpoint === 'general' && (
				<>
					<MaxiModal
						type='arrow-icon'
						title={__('Add first arrow icon', 'maxi-blocks')}
						style={blockStyle}
						onSelect={obj => onChange(obj)}
						onRemove={obj => onChange(obj)}
						icon={props['navigation-arrow-first-icon-content']}
						prefix='navigation-arrow-first-'
					/>
					<MaxiModal
						type='arrow-icon'
						title={__('Add second arrow icon', 'maxi-blocks')}
						style={blockStyle}
						onSelect={obj => onChange(obj)}
						onRemove={obj => onChange(obj)}
						icon={props['navigation-arrow-second-icon-content']}
						prefix='navigation-arrow-second-'
					/>
					<ToggleSwitch
						label={__('Style arrows separately', 'maxi-blocks')}
						selected={props['navigation-arrow-style-separately']}
						onChange={val =>
							onChange({
								'navigation-arrow-style-separately': val,
							})
						}
					/>
				</>
			)}
			{!props['navigation-arrow-style-separately'] &&
				props['navigation-arrow-first-icon-content'] && (
					<>
						<SvgWidthControl
							{...getGroupAttributes(
								props,
								`arrowIcon${isHover ? 'Hover' : ''}`,
								isHover
							)}
							onChange={onChange}
							prefix='navigation-arrow-first-icon-'
							breakpoint={breakpoint}
							isHover={isHover}
						/>
						<SvgStrokeWidthControl
							{...getGroupAttributes(
								props,
								`arrowIcon${isHover ? 'Hover' : ''}`,
								isHover
							)}
							onChange={obj => {
								onChange({
									...obj,
									'navigation-arrow-first-icon-content':
										setSVGStrokeWidth(
											props[
												'navigation-arrow-first-icon-content'
											],
											obj[
												`navigation-arrow-first-icon-stroke-${breakpoint}${
													isHover ? '-hover' : ''
												}`
											]
										),
								});
							}}
							prefix='navigation-arrow-first-icon-'
							breakpoint={breakpoint}
							isHover={isHover}
						/>
						{!isHover && (
							<AdvancedNumberControl
								label={__('Spacing', 'maxi-blocks')}
								min={0}
								max={999}
								initial={1}
								step={1}
								breakpoint={breakpoint}
								value={
									props[
										`navigation-arrow-first-icon-spacing-${breakpoint}`
									]
								}
								onChangeValue={val => {
									onChange({
										[`navigation-arrow-first-icon-spacing-${breakpoint}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								onReset={() =>
									onChange({
										[`navigation-arrow-first-icon-spacing-${breakpoint}`]:
											getDefaultAttribute(
												`navigation-arrow-first-icon-spacing-${breakpoint}`
											),
									})
								}
							/>
						)}
						<SettingTabsControl
							label=''
							className='maxi-icon-styles-control'
							type='buttons'
							fullWidthMode
							selected={iconStyle}
							items={getOptions()}
							onChange={val => setIconStyle(val)}
						/>
						{iconStyle === 'color' && svgType !== 'Shape' && (
							<ColorControl
								label={__('Icon stroke', 'maxi-blocks')}
								className='maxi-icon-styles-control--color'
								avoidBreakpointForDefault
								color={
									props[
										`navigation-arrow-first-icon-stroke-color${
											isHover ? '-hover' : ''
										}`
									]
								}
								prefix='navigation-arrow-first-icon-stroke-'
								paletteColor={
									props[
										`navigation-arrow-first-icon-stroke-palette-color${
											isHover ? '-hover' : ''
										}`
									]
								}
								paletteOpacity={
									props[
										`navigation-arrow-first-icon-stroke-palette-opacity${
											isHover ? '-hover' : ''
										}`
									]
								}
								paletteStatus={
									props[
										`navigation-arrow-first-icon-stroke-palette-status${
											isHover ? '-hover' : ''
										}`
									]
								}
								onChangeInline={({ color }) =>
									onChangeInline &&
									onChangeInline(
										{ stroke: color },
										'[data-stroke]',
										true
									)
								}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
									paletteOpacity,
								}) => {
									const lineColorStr = getColorRGBAString({
										firstVar: `navigation-arrow-first-icon-stroke${
											isHover ? '-hover' : ''
										}`,
										secondVar: `color-${paletteColor}${
											isHover ? '-hover' : ''
										}`,
										opacity: paletteOpacity,
										blockStyle,
									});

									onChange({
										[`navigation-arrow-first-icon-stroke-color${
											isHover ? '-hover' : ''
										}`]: color,
										[`navigation-arrow-first-icon-stroke-palette-color${
											isHover ? '-hover' : ''
										}`]: paletteColor,
										[`navigation-arrow-first-icon-stroke-palette-status${
											isHover ? '-hover' : ''
										}`]: paletteStatus,
										[`navigation-arrow-first-icon-stroke-palette-opacity${
											isHover ? '-hover' : ''
										}`]: paletteOpacity,
										'navigation-arrow-first-icon-content':
											isHover
												? setSVGContentHover(
														props[
															'navigation-arrow-first-icon-content'
														],
														paletteStatus
															? lineColorStr
															: color,
														'stroke'
												  )
												: setSVGContent(
														props[
															'navigation-arrow-first-icon-content'
														],
														paletteStatus
															? lineColorStr
															: color,
														'stroke'
												  ),
									});
								}}
								isHover={isHover}
							/>
						)}
						{iconStyle === 'border' && (
							<BorderControl
								{...getGroupAttributes(props, [
									`arrowFirstIconBorder${
										isHover ? 'Hover' : ''
									}`,
									`arrowFirstIconBorderWidth${
										isHover ? 'Hover' : ''
									}`,
									`arrowFirstIconBorderRadius${
										isHover ? 'Hover' : ''
									}`,
								])}
								prefix='navigation-arrow-first-icon-'
								onChange={onChange}
								breakpoint={breakpoint}
								clientId={clientId}
								isHover={isHover}
							/>
						)}
						{iconStyle === 'fill' && svgType !== 'Line' && (
							<ColorControl
								label={__('Icon fill', 'maxi-blocks')}
								color={
									props[
										`navigation-arrow-first-icon-fill-color${
											isHover ? '-hover' : ''
										}`
									]
								}
								prefix='navigation-arrow-first-icon-fill-'
								avoidBreakpointForDefault
								paletteColor={
									props[
										`navigation-arrow-first-icon-fill-palette-color${
											isHover ? '-hover' : ''
										}`
									]
								}
								paletteOpacity={
									props[
										`navigation-arrow-first-icon-fill-palette-opacity${
											isHover ? '-hover' : ''
										}`
									]
								}
								paletteStatus={
									props[
										`navigation-arrow-first-icon-fill-palette-status${
											isHover ? '-hover' : ''
										}`
									]
								}
								onChangeInline={({ color }) =>
									onChangeInline &&
									onChangeInline(
										{ fill: color },
										'[data-fill]',
										true
									)
								}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
									paletteOpacity,
								}) => {
									const fillColorStr = getColorRGBAString({
										firstVar: `navigation-arrow-first-icon-fill${
											isHover ? '-hover' : ''
										}`,
										secondVar: `color-${paletteColor}${
											isHover ? '-hover' : ''
										}`,
										opacity: paletteOpacity,
										blockStyle,
									});

									onChange({
										[`navigation-arrow-first-icon-fill-color${
											isHover ? '-hover' : ''
										}`]: color,
										[`navigation-arrow-first-icon-fill-palette-color${
											isHover ? '-hover' : ''
										}`]: paletteColor,
										[`navigation-arrow-first-icon-fill-palette-status${
											isHover ? '-hover' : ''
										}`]: paletteStatus,
										[`navigation-arrow-first-icon-fill-palette-opacity${
											isHover ? '-hover' : ''
										}`]: paletteOpacity,
										'navigation-arrow-first-icon--content':
											isHover
												? setSVGContentHover(
														props[
															'navigation-arrow-first-icon-content'
														],
														paletteStatus
															? fillColorStr
															: color,
														'fill'
												  )
												: setSVGContent(
														props[
															'navigation-arrow-first-icon-content'
														],
														paletteStatus
															? fillColorStr
															: color,
														'fill'
												  ),
									});
								}}
								isHover={isHover}
							/>
						)}
						<SettingTabsControl
							type='buttons'
							fullWidthMode
							selected={arrowFirstIconBgActive}
							items={getBackgroundOptions()}
							onChange={val => {
								setArrowFirstIconBgActive(val);
								onChange({
									[getAttributeKey(
										'background-active-media',
										isHover,
										'navigation-arrow-first-icon-',
										breakpoint
									)]: val,
								});
							}}
						/>
						{arrowFirstIconBgActive === 'color' && (
							<ColorControl
								label={__('Icon background', 'maxi-blocks')}
								paletteStatus={getLastBreakpointAttribute({
									target: 'navigation-arrow-first-icon-background-palette-status',
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteColor={getLastBreakpointAttribute({
									target: 'navigation-arrow-first-icon-background-palette-color',
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteOpacity={getLastBreakpointAttribute({
									target: 'navigation-arrow-first-icon-background-palette-opacity',
									breakpoint,
									attributes: props,
									isHover,
								})}
								color={getLastBreakpointAttribute({
									target: 'navigation-arrow-first-icon-background-color',
									breakpoint,
									attributes: props,
									isHover,
								})}
								prefix='navigation-arrow-first-icon-background-'
								avoidBreakpointForDefault
								onChangeInline={({ color }) =>
									onChangeInline &&
									onChangeInline(
										{
											background: color,
										},
										'.maxi-button-block__icon'
									)
								}
								onChange={({
									paletteStatus,
									paletteColor,
									paletteOpacity,
									color,
								}) => {
									onChange(
										{
											[getAttributeKey(
												'background-palette-status',
												isHover,
												'navigation-arrow-first-icon-',
												breakpoint
											)]: paletteStatus,
											[getAttributeKey(
												'background-palette-color',
												isHover,
												'navigation-arrow-first-icon-',
												breakpoint
											)]: paletteColor,
											[getAttributeKey(
												'background-palette-opacity',
												isHover,
												'navigation-arrow-first-icon-',
												breakpoint
											)]: paletteOpacity,
											[getAttributeKey(
												'background-color',
												isHover,
												'navigation-arrow-first-icon-',
												breakpoint
											)]: color,
										},
										'.maxi-button-block__icon'
									);
								}}
								isHover={isHover}
							/>
						)}
						{arrowFirstIconBgActive === 'gradient' && (
							<GradientControl
								label={__(
									'Icon Background gradient',
									'maxi-blocks'
								)}
								gradient={getLastBreakpointAttribute({
									target: 'navigation-arrow-first-icon-background-gradient',
									breakpoint,
									attributes: props,
									isHover,
								})}
								gradientOpacity={getLastBreakpointAttribute({
									target: 'navigation-arrow-first-icon-background-gradient-opacity',
									breakpoint,
									attributes: props,
									isHover,
								})}
								defaultGradient={getDefaultAttribute(
									getAttributeKey(
										'background-gradient',
										isHover,
										'navigation-arrow-first-icon-',
										breakpoint
									)
								)}
								onChange={val =>
									onChange({
										[getAttributeKey(
											'background-gradient',
											isHover,
											'navigation-arrow-first-icon-',
											breakpoint
										)]: val,
									})
								}
								onChangeOpacity={val =>
									onChange({
										[getAttributeKey(
											'background-gradient-opacity',
											isHover,
											'navigation-arrow-first-icon-',
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
								label={__('Icon padding', 'maxi-blocks')}
								onChange={onChange}
								breakpoint={breakpoint}
								target='navigation-arrow-first-icon-padding'
								disableAuto
								optionType='string'
								minMaxSettings={minMaxSettings}
							/>
						)}
					</>
				)}
		</div>
	);
};

export default ArrowIconControl;
