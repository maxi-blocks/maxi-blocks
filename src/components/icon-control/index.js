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
	iconBorder,
	styleNone,
	iconStroke,
	iconFill,
} from '../../icons';

/**
 * Component
 */
const IconControl = props => {
	const {
		className,
		onChangeInline = null,
		onChange,
		clientId,
		svgType,
		breakpoint,
		blockStyle,
		isHover = false,
		isInteractionBuilder = false,
		disableIconInherit = false,
		getIconWithColor,
		'icon-only': iconOnly,
		'icon-inherit': iconInherit,
		'icon-content': iconContent,
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

	const iconBackgroundActiveMedia = getLastBreakpointAttribute({
		target: 'icon-background-active-media',
		breakpoint,
		attributes: props,
		isHover,
	});

	const [iconBgActive, setIconBgActive] = useState(
		iconBackgroundActiveMedia || 'none'
	);

	return (
		<div className={classes}>
			{!isInteractionBuilder && !isHover && breakpoint === 'general' && (
				<MaxiModal
					type='button-icon'
					style={blockStyle}
					onSelect={obj => {
						const icon = getIconWithColor({
							rawIcon: obj['icon-content'],
						});

						onChange({ ...obj, 'icon-content': icon });
					}}
					onRemove={obj => onChange(obj)}
					icon={iconContent}
				/>
			)}
			{iconContent && (
				<>
					{!isInteractionBuilder &&
						!isHover &&
						breakpoint === 'general' && (
							<>
								<hr />
								<ToggleSwitch
									label={__(
										'Icon only (remove text)',
										'maxi-blocks'
									)}
									className='maxi-color-control__palette__custom'
									selected={iconOnly}
									onChange={val => {
										const icon = getIconWithColor({
											isIconOnly: val,
											isHover,
										});

										onChange({
											'icon-only': val,
											'icon-content': icon,
										});
									}}
								/>
							</>
						)}
					<SvgWidthControl
						{...getGroupAttributes(
							props,
							`icon${isHover ? 'Hover' : ''}`,
							isHover
						)}
						onChange={onChange}
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
						onChange={obj => onChange(obj)}
						prefix='icon-'
						breakpoint={breakpoint}
						isHover={isHover}
						content={props['icon-content']}
					/>
					{!isHover && !iconOnly && (
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
								<SettingTabsControl
									label={__('Icon Position', 'maxi-block')}
									className='maxi-icon-position-control'
									type='buttons'
									selected={props['icon-position']}
									items={[
										{
											label: __('Top', 'maxi-block'),
											value: 'top',
										},
										{
											label: __('Bottom', 'maxi-block'),
											value: 'bottom',
										},
										{
											label: __('Left', 'maxi-block'),
											value: 'left',
										},
										{
											label: __('Right', 'maxi-block'),
											value: 'right',
										},
									]}
									onChange={val =>
										onChange({
											'icon-position': val,
										})
									}
								/>
							)}
						</>
					)}
					{!disableIconInherit &&
						!isHover &&
						breakpoint === 'general' && (
							<ToggleSwitch
								label={__(
									'Inherit colour/background from button',
									'maxi-block'
								)}
								selected={iconInherit}
								onChange={val => {
									const icon = getIconWithColor({
										isInherit: val,
										isHover,
									});

									onChange({
										'icon-inherit': val,
										'icon-content': icon,
									});
								}}
							/>
						)}
					<SettingTabsControl
						className='maxi-icon-styles-control'
						type='buttons'
						fullWidthMode
						selected={iconStyle}
						items={getOptions()}
						onChange={val => setIconStyle(val)}
					/>
					{iconStyle === 'color' &&
						(!iconInherit || iconOnly ? (
							svgType !== 'Shape' && (
								<ColorControl
									label={__('Icon stroke', 'maxi-blocks')}
									className='maxi-icon-styles-control--color'
									avoidBreakpointForDefault
									color={
										props[
											`icon-stroke-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									prefix='icon-stroke-'
									paletteColor={
										props[
											`icon-stroke-palette-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									paletteOpacity={
										props[
											`icon-stroke-palette-opacity${
												isHover ? '-hover' : ''
											}`
										]
									}
									paletteStatus={
										props[
											`icon-stroke-palette-status${
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
										const icon = getIconWithColor({
											color,
											paletteColor,
											paletteStatus,
											paletteOpacity,
											isHover,
										});

										onChange({
											[`icon-stroke-color${
												isHover ? '-hover' : ''
											}`]: color,
											[`icon-stroke-palette-color${
												isHover ? '-hover' : ''
											}`]: paletteColor,
											[`icon-stroke-palette-status${
												isHover ? '-hover' : ''
											}`]: paletteStatus,
											[`icon-stroke-palette-opacity${
												isHover ? '-hover' : ''
											}`]: paletteOpacity,
											'icon-content': icon,
										});
									}}
									isHover={isHover}
								/>
							)
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
						))}
					{iconStyle === 'border' && (
						<BorderControl
							{...getGroupAttributes(props, [
								`iconBorder${isHover ? 'Hover' : ''}`,
								`iconBorderWidth${isHover ? 'Hover' : ''}`,
								`iconBorderRadius${isHover ? 'Hover' : ''}`,
							])}
							prefix='icon-'
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
									`icon-fill-color${isHover ? '-hover' : ''}`
								]
							}
							prefix='icon-fill'
							paletteColor={
								props[
									`icon-fill-palette-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteOpacity={
								props[
									`icon-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteStatus={
								props[
									`icon-fill-palette-status${
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
								const icon = getIconWithColor({
									color,
									paletteColor,
									paletteStatus,
									paletteOpacity,
									type: 'fill',
									isHover,
								});

								onChange({
									[`icon-fill-color${
										isHover ? '-hover' : ''
									}`]: color,
									[`icon-fill-palette-color${
										isHover ? '-hover' : ''
									}`]: paletteColor,
									[`icon-fill-palette-status${
										isHover ? '-hover' : ''
									}`]: paletteStatus,
									[`icon-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`]: paletteOpacity,
									'icon-content': icon,
								});
							}}
							isHover={isHover}
							avoidBreakpointForDefault
						/>
					)}
					<SettingTabsControl
						type='buttons'
						fullWidthMode
						selected={iconBgActive}
						items={getBackgroundOptions()}
						onChange={val => {
							setIconBgActive(val);
							onChange({
								[getAttributeKey(
									'background-active-media',
									isHover,
									'icon-',
									breakpoint
								)]: val,
							});
						}}
					/>
					{iconBgActive === 'color' &&
						(!iconInherit ? (
							<ColorControl
								label={__('Icon background', 'maxi-blocks')}
								paletteStatus={getLastBreakpointAttribute({
									target: 'icon-background-palette-status',
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteColor={getLastBreakpointAttribute({
									target: 'icon-background-palette-color',
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteOpacity={getLastBreakpointAttribute({
									target: 'icon-background-palette-opacity',
									breakpoint,
									attributes: props,
									isHover,
								})}
								color={getLastBreakpointAttribute({
									target: 'icon-background-color',
									breakpoint,
									attributes: props,
									isHover,
								})}
								prefix='icon-background-'
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
										},
										'.maxi-button-block__icon'
									);
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
										panel: 'button background',
									},
								]}
							/>
						))}
					{iconBgActive === 'gradient' && (
						<GradientControl
							label={__(
								'Icon Background gradient',
								'maxi-blocks'
							)}
							gradient={getLastBreakpointAttribute({
								target: 'icon-background-gradient',
								breakpoint,
								attributes: props,
								isHover,
							})}
							gradientOpacity={getLastBreakpointAttribute({
								target: 'icon-background-gradient-opacity',
								breakpoint,
								attributes: props,
								isHover,
							})}
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
							label={__('Icon padding', 'maxi-blocks')}
							onChange={onChange}
							breakpoint={breakpoint}
							target='icon-padding'
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

export default IconControl;
