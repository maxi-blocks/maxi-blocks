/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { Fragment, useState } = wp.element;
const { Icon } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import { getLastBreakpointValue } from '../../utils';
import ColorControl from '../color-control';
import FontIconPicker from '../font-icon-picker';
import AxisControl from '../axis-control';
import BorderControl from '../border-control';
import BackgroundControl from '../background-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';
import * as attributesData from '../../extensions/styles/defaults';

/**
 * Styles and icons
 */
import {
	backgroundColor,
	solid,
	backgroundGradient,
	fontIconSettings,
} from '../../icons';

/**
 * Component
 */
const FontIconControl = props => {
	const {
		className,
		icon,
		onChange,
		breakpoint,
		disableSpacing = false,
		disablePosition = false,
		disablePadding = false,
		disableBackground = false,
		disableBorder = false,
		padding,
		onChangePadding,
		border,
		onChangeBorder,
		background,
		onChangeBackground,
	} = props;

	const [activeOption, setActiveOption] = useState('iconColor');

	const value = !isObject(icon) ? JSON.parse(icon) : icon;

	const backgroundValue =
		!disableBackground && !isObject(background)
			? JSON.parse(background)
			: background;

	const getOptions = () => {
		const options = [
			...[
				{
					label: <Icon icon={fontIconSettings} />,
					value: 'iconColor',
				},
			],
			...(!disableBackground && [
				{
					label: <Icon icon={backgroundColor} />,
					value: 'backgroundColor',
				},
			]),
			...(!disableBackground && [
				{
					label: <Icon icon={backgroundGradient()} />,
					value: 'backgroundGradient',
				},
			]),
			...(!disableBorder && [
				{
					label: <Icon icon={solid} />,
					value: 'border',
				},
			]),
		];

		return options;
	};

	const classes = classnames('maxi-font-icon-control', className);

	console.log(getOptions().length);

	return (
		<div className={classes}>
			<FontIconPicker
				iconClassName={value.icon}
				onChange={iconClassName => {
					value.icon = iconClassName;
					onChange(JSON.stringify(value));
				}}
			/>
			{value.icon && (
				<Fragment>
					<SizeControl
						label={__('Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'font-sizeUnit',
							breakpoint
						)}
						defaultUnit='px'
						onChangeUnit={val => {
							value[breakpoint]['font-sizeUnit'] = val;
							onChange(JSON.stringify(value));
						}}
						defaultValue=''
						value={getLastBreakpointValue(
							value,
							'font-size',
							breakpoint
						)}
						onChangeValue={val => {
							value[breakpoint]['font-size'] = val;
							onChange(JSON.stringify(value));
						}}
						minMaxSettings={{
							px: {
								min: 0,
								max: 99,
							},
							em: {
								min: 0,
								max: 99,
							},
							vw: {
								min: 0,
								max: 99,
							},
							'%': {
								min: 0,
								max: 100,
							},
						}}
					/>
					{!disableSpacing && (
						<SizeControl
							label={__('Spacing', 'maxi-blocks')}
							unit={getLastBreakpointValue(
								value,
								'spacing',
								breakpoint
							)}
							disableUnit
							defaultValue=''
							value={getLastBreakpointValue(
								value,
								'spacing',
								breakpoint
							)}
							onChangeValue={val => {
								value[breakpoint].spacing = val;
								onChange(JSON.stringify(value));
							}}
							min={0}
							max={99}
						/>
					)}

					{!disablePosition && (
						<SelectControl
							label={__('Position', 'maxi-blocks')}
							value={value.position}
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
							onChange={val => {
								value.position = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}

					{getOptions().length > 1 && (
						<__experimentalFancyRadioControl
							label={__('Colour', 'maxi-blocks')}
							selected={activeOption}
							options={getOptions()}
							onChange={item => {
								if (item === 'iconColor')
									setActiveOption('iconColor');
								if (item === 'backgroundColor') {
									backgroundValue.activeMedia = 'color';
									onChangeBackground(
										JSON.stringify(backgroundValue)
									);
									setActiveOption('backgroundColor');
								}
								if (item === 'backgroundGradient') {
									backgroundValue.activeMedia = 'gradient';
									onChangeBackground(
										JSON.stringify(backgroundValue)
									);
									setActiveOption('backgroundGradient');
								}
								if (item === 'border')
									setActiveOption('border');

								onChange(JSON.stringify(value));
							}}
						/>
					)}

					{activeOption === 'iconColor' && (
						<ColorControl
							label={__('Icon', 'maxi-blocks')}
							color={getLastBreakpointValue(
								value,
								'color',
								breakpoint
							)}
							defaultColor='#fff'
							onChange={val => {
								value[breakpoint].color = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}

					{!disableBorder && activeOption === 'border' && (
						<BorderControl
							border={border}
							defaultBorder={attributesData.border}
							onChange={border => onChangeBorder(border)}
							breakpoint={breakpoint}
						/>
					)}

					{!disableBackground &&
						activeOption === 'backgroundColor' && (
							<BackgroundControl
								background={background}
								defaultBackground={attributesData.background}
								onChange={background =>
									onChangeBackground(background)
								}
								disableImage
								disableVideo
								disableClipPath
								disableSVG
								disableGradient
								disableNoneStyle
							/>
						)}

					{!disableBackground &&
						activeOption === 'backgroundGradient' && (
							<BackgroundControl
								background={background}
								defaultBackground={attributesData.background}
								onChange={background =>
									onChangeBackground(background)
								}
								disableImage
								disableVideo
								disableClipPath
								disableSVG
								disableColor
								disableNoneStyle
							/>
						)}

					{!disablePadding && (
						<AxisControl
							values={padding}
							defaultValues={attributesData.padding}
							onChange={padding => onChangePadding(padding)}
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
