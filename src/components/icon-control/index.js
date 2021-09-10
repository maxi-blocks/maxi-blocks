/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import FancyRadioControl from '../fancy-radio-control';
import ColorControl from '../color-control';
import AxisControl from '../axis-control';
import GradientControl from '../gradient-control';
import BorderControl from '../border-control';
import InfoBox from '../info-box';
import {
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
	smileIcon,
	backgroundColor,
	backgroundGradient,
	solid,
} from '../../icons';

/**
 * Component
 */
const IconControl = props => {
	const { className, onChange, clientId, deviceType, parentBlockStyle } =
		props;

	const classes = classnames('maxi-icon-control', className);

	const [iconStyle, setIconStyle] = useState('color');

	const getOptions = () => {
		const options = [];

		options.push({
			label: <Icon icon={smileIcon} />,
			value: 'color',
		});

		options.push({
			label: <Icon icon={backgroundColor} />,
			value: 'background-color',
		});

		options.push({
			label: <Icon icon={backgroundGradient} />,
			value: 'gradient',
		});

		options.push({
			label: <Icon icon={solid} />,
			value: 'border',
		});

		return options;
	};

	return (
		<div className={classes}>
			<MaxiModal type='button-icon' style={parentBlockStyle} />
			{props['icon-content'] && (
				<>
					<hr />
					<SvgWidthControl
						prefix='icon-'
						{...getGroupAttributes(props, 'icon')}
						onChange={obj => {
							onChange(obj);
						}}
						breakpoint={deviceType}
					/>
					<AdvancedNumberControl
						label={__('Spacing', 'maxi-blocks')}
						min={0}
						max={999}
						initial={1}
						step={1}
						value={props[`icon-spacing-${deviceType}`]}
						onChangeValue={val => {
							onChange({
								[`icon-spacing-${deviceType}`]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								[`icon-spacing-${deviceType}`]:
									getDefaultAttribute(
										`icon-spacing-${deviceType}`
									),
							})
						}
					/>
					<FancyRadioControl
						label={__('Icon Position', 'maxi-block')}
						selected={props['icon-position']}
						options={[
							{ label: __('Left', 'maxi-block'), value: 'left' },
							{
								label: __('Right', 'maxi-block'),
								value: 'right',
							},
						]}
						optionType='string'
						onChange={val =>
							onChange({
								'icon-position': val,
							})
						}
					/>
					<FancyRadioControl
						label={__(
							'Inherit Colour/Background from Button',
							'maxi-block'
						)}
						fullWidthMode
						selected={props['icon-inherit']}
						options={[
							{
								label: __('Yes', 'maxi-block'),
								value: 1,
							},
							{ label: __('No', 'maxi-block'), value: 0 },
						]}
						onChange={val =>
							onChange({
								'icon-inherit': val,
							})
						}
					/>
					<FancyRadioControl
						label=''
						fullWidthMode
						selected={iconStyle}
						options={getOptions()}
						optionType='string'
						onChange={val => setIconStyle(val)}
					/>
					{iconStyle === 'color' && (
						<>
							{!props['icon-inherit'] ? (
								<ColorControl
									label={__('Icon', 'maxi-blocks')}
									color={props['icon-color']}
									defaultColor={getDefaultAttribute(
										'icon-color'
									)}
									paletteColor={props['icon-palette-color']}
									paletteStatus={
										props['icon-palette-color-status']
									}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
									}) => {
										onChange({
											'icon-color': color,
											'icon-palette-color': paletteColor,
											'icon-palette-color-status':
												paletteStatus,
										});
									}}
									showPalette
									disableOpacity
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
					{iconStyle === 'background-color' && (
						<>
							{!props['icon-inherit'] ? (
								<ColorControl
									label={__('Icon background', 'maxi-blocks')}
									color={props['icon-background-color']}
									defaultColor={getDefaultAttribute(
										'icon-background-color'
									)}
									paletteColor={
										props['icon-background-palette-color']
									}
									paletteStatus={
										props[
											'icon-background-palette-color-status'
										]
									}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
									}) => {
										onChange({
											'icon-background-color': color,
											'icon-background-palette-color':
												paletteColor,
											'icon-background-palette-color-status':
												paletteStatus,
										});
									}}
									showPalette
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
					{iconStyle === 'gradient' && (
						<GradientControl
							label={__(
								'Icon Background Gradient',
								'maxi-blocks'
							)}
							gradient={props['icon-background-gradient']}
							gradientOpacity={
								props['icon-background-gradient-opacity']
							}
							defaultGradient={getDefaultAttribute(
								'icon-background-gradient'
							)}
							onChange={val =>
								onChange({
									'icon-background-gradient': val,
								})
							}
							onChangeOpacity={val =>
								onChange({
									'icon-background-gradient-opacity': val,
								})
							}
						/>
					)}
					{iconStyle === 'border' && (
						<BorderControl
							{...getGroupAttributes(props, [
								'iconBorder',
								'iconBorderWidth',
								'iconBorderRadius',
							])}
							prefix='icon-'
							onChange={obj => onChange(obj)}
							breakpoint={deviceType}
							clientId={clientId}
						/>
					)}
					<AxisControl
						{...getGroupAttributes(props, 'iconPadding')}
						label={__('Icon Padding', 'maxi-blocks')}
						onChange={obj => onChange(obj)}
						breakpoint={deviceType}
						target='icon-padding'
						disableAuto
					/>
				</>
			)}
		</div>
	);
};

export default IconControl;
