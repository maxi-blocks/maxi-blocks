/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { Fragment } = wp.element;

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
import * as attributesData from '../../extensions/styles/defaults';

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
		padding,
		onChangePadding,
		border,
		onChangeBorder,
		background,
		onChangeBackground,
	} = props;

	const value = !isObject(icon) ? JSON.parse(icon) : icon;

	const classes = classnames('maxi-font-icon-control', className);

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

					<AxisControl
						values={padding}
						defaultValues={attributesData.padding}
						onChange={padding => onChangePadding(padding)}
						breakpoint={breakpoint}
						disableAuto
					/>

					<BorderControl
						border={border}
						defaultBorder={attributesData.border}
						onChange={border => onChangeBorder(border)}
						breakpoint={breakpoint}
					/>

					<BackgroundControl
						background={background}
						defaultBackground={attributesData.background}
						onChange={background => onChangeBackground(background)}
						disableImage
						disableVideo
						disableClipPath
						disableSVG
					/>
				</Fragment>
			)}
		</div>
	);
};

export default FontIconControl;
