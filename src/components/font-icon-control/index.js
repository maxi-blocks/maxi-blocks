/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState } = wp.element;
const { Icon } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import ColorControl from '../color-control';
import FontIconPicker from '../font-icon-picker';
import AxisControl from '../axis-control';
import BorderControl from '../border-control';
import GradientControl from '../gradient-control';
import FancyRadioControl from '../fancy-radio-control';
import * as defaultPresets from './defaults';

import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointAttribute';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	backgroundColor,
	solid,
	backgroundGradient,
	fontIconSettings,
	presetThree,
	presetSeven,
	presetEight,
} from '../../icons';
import DefaultStylesControl from '../default-styles-control';

/**
 * Component
 */
const FontIconControl = (props, isHover = false) => {
	const {
		className,
		onChange,
		breakpoint,
		simpleMode = false,
		disableColor,
	} = props;

	const [activeOption, setActiveOption] = useState('iconColor');

	const classes = classnames('maxi-font-icon-control', className);

	const getOptions = () => {
		const options = [
			...[
				{
					label: <Icon icon={fontIconSettings} />,
					value: 'iconColor',
				},
			],
			...(!simpleMode && [
				{
					label: <Icon icon={backgroundColor} />,
					value: 'backgroundColor',
				},
			]),
			...(!simpleMode && [
				{
					label: <Icon icon={backgroundGradient()} />,
					value: 'backgroundGradient',
				},
			]),
			...(!simpleMode && [
				{
					label: <Icon icon={solid} />,
					value: 'border',
				},
			]),
		];

		return options;
	};

	const onChangePreset = number => {
		onChange({ ...defaultPresets[`preset${number}`] });
	};

	return (
		<div className={classes}>
			<FontIconPicker
				iconClassName={props['icon-name']}
				onChange={val =>
					onChange({
						'icon-name': val,
					})
				}
			/>
			{!isEmpty(props['icon-name']) && (
				<Fragment>
					<SizeControl
						label={__('Size', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							'icon-size-unit',
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`icon-size-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChange({
								[`icon-size-unit-${breakpoint}`]: val,
							})
						}
						defaultValue={getDefaultAttribute(
							`icon-size-${breakpoint}`
						)}
						value={getLastBreakpointAttribute(
							'icon-size',
							breakpoint,
							props
						)}
						onChangeValue={val =>
							onChange({
								[`icon-size-${breakpoint}`]: val,
							})
						}
						minMaxSettings={{
							px: {
								min: 0,
								max: 300,
							},
							em: {
								min: 0,
								max: 300,
							},
							vw: {
								min: 0,
								max: 100,
							},
							'%': {
								min: 0,
								max: 100,
							},
						}}
					/>

					{!simpleMode && (
						<Fragment>
							<SizeControl
								label={__('Spacing', 'maxi-blocks')}
								disableUnit
								defaultValue={getDefaultAttribute(
									'icon-spacing'
								)}
								value={props['icon-spacing']}
								onChangeValue={val =>
									onChange({
										['icon-spacing']: val,
									})
								}
								min={0}
								max={99}
							/>

							<FancyRadioControl
								label={__('Icon Position', 'maxi-blocks')}
								selected={props['icon-position']}
								options={[
									{
										label: __('Left', 'maxi-blocks'),
										value: 'left',
									},
									{
										label: __('Right', 'maxi-blocks'),
										value: 'right',
									},
								]}
								onChange={val =>
									onChange({
										['icon-position']: val,
									})
								}
							/>
						</Fragment>
					)}

					{!simpleMode && (
						<DefaultStylesControl
							className='maxi-icon-default-styles'
							items={[
								{
									activeItem: false,
									content: <Icon icon={presetSeven} />,
									onChange: () => onChangePreset(1),
								},
								{
									activeItem: false,
									content: <Icon icon={presetThree} />,
									onChange: () => onChangePreset(2),
								},
								{
									activeItem: false,
									content: <Icon icon={presetEight} />,
									onChange: () => onChangePreset(3),
								},
							]}
						/>
					)}
					{getOptions().length > 1 && (
						<FancyRadioControl
							label=''
							selected={activeOption}
							options={getOptions()}
							fullWidthMode
							onChange={item => {
								if (item === 'iconColor')
									setActiveOption('iconColor');
								if (item === 'backgroundColor') {
									onChange({
										'icon-background-active-media': 'color',
									});
									setActiveOption('backgroundColor');
								}
								if (item === 'backgroundGradient') {
									onChange({
										'icon-background-active-media':
											'gradient',
									});
									setActiveOption('backgroundGradient');
								}
								if (item === 'border')
									setActiveOption('border');
							}}
						/>
					)}

					{activeOption === 'iconColor' && !disableColor && (
						<ColorControl
							label={__('Icon', 'maxi-blocks')}
							color={props['icon-color']}
							defaultColor={getDefaultAttribute('icon-color')}
							onChange={val => onChange({ 'icon-color': val })}
						/>
					)}

					{!simpleMode && activeOption === 'border' && (
						<BorderControl
							{...getGroupAttributes(props, [
								'iconBorder',
								'iconBorderWidth',
								'iconBorderRadius',
							])}
							onChange={obj => onChange(obj)}
							breakpoint={breakpoint}
							prefix='icon-'
						/>
					)}

					{!simpleMode && activeOption === 'backgroundColor' && (
						<ColorControl
							label={__('Background', 'maxi-blocks')}
							color={props['icon-background-color']}
							defaultColor={getDefaultAttribute(
								'icon-background-color'
							)}
							onChange={val =>
								onChange({ 'icon-background-color': val })
							}
						/>
					)}

					{!simpleMode && activeOption === 'backgroundGradient' && (
						<GradientControl
							label={__('Background', 'maxi-blocks')}
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

					{!simpleMode && (
						<FancyRadioControl
							label={__('Use Custom Padding', 'maxi-blocks')}
							selected={+props['icon-custom-padding']}
							options={[
								{
									label: __('No', 'maxi-blocks'),
									value: 0,
								},
								{
									label: __('Yes', 'maxi-blocks'),
									value: 1,
								},
							]}
							onChange={val =>
								onChange({
									['icon-custom-padding']: !!+val,
								})
							}
						/>
					)}

					{!simpleMode && props['icon-custom-padding'] && (
						<AxisControl
							{...getGroupAttributes(props, 'iconPadding')}
							onChange={obj => onChange(obj)}
							target='icon-padding'
							breakpoint={breakpoint}
							disableAuto
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default FontIconControl;
