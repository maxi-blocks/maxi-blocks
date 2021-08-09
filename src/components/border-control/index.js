/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisControl from '../axis-control';
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import Icon from '../icon';
import SelectControl from '../select-control';
import {
	borderNone,
	borderSolid,
	borderDashed,
	borderDotted,
} from './defaults';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNumber } from 'lodash';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

/**
 * Component
 */
const BorderControl = props => {
	const {
		className,
		onChange,
		breakpoint = 'general',
		disableAdvanced = false,
		disableColor = false,
		isHover = false,
		prefix = '',
		clientId,
		isButton = false,
	} = props;

	const classes = classnames('maxi-border-control', className);

	const onChangeDefault = defaultProp => {
		const response = {};

		Object.entries(defaultProp).forEach(([key, value]) => {
			response[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] = value;
		});

		onChange(response);
	};

	const borderStyleValue = getLastBreakpointAttribute(
		`${prefix}border-style`,
		breakpoint,
		props,
		isHover
	);

	const getIsActive = () => {
		const items = [
			`${prefix}border-top-width`,
			`${prefix}border-right-width`,
			`${prefix}border-bottom-width`,
			`${prefix}border-left-width`,
		];

		const hasBorderWidth = items.some(item => {
			return isNumber(
				getLastBreakpointAttribute(item, breakpoint, props, isHover)
			);
		});

		if (hasBorderWidth) return borderStyleValue;
		return 'none';
	};

	return (
		<div className={classes}>
			<DefaultStylesControl
				items={[
					{
						activeItem: getIsActive(prefix) === 'none',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () =>
							onChangeDefault(borderNone(prefix, isHover)),
					},
					{
						activeItem: getIsActive(prefix) === 'solid',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () => onChangeDefault(borderSolid(prefix)),
					},
					{
						activeItem: getIsActive(prefix) === 'dashed',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () => onChangeDefault(borderDashed(prefix)),
					},
					{
						activeItem: getIsActive(prefix) === 'dotted',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dotted}
							/>
						),
						onChange: () => onChangeDefault(borderDotted(prefix)),
					},
				]}
			/>
			{!disableAdvanced && (
				<SelectControl
					label={__('Border Type', 'maxi-blocks')}
					className='maxi-border-control__type'
					value={borderStyleValue}
					options={[
						{ label: 'None', value: 'none' },
						{ label: 'Dotted', value: 'dotted' },
						{ label: 'Dashed', value: 'dashed' },
						{ label: 'Solid', value: 'solid' },
						{ label: 'Double', value: 'double' },
						{ label: 'Groove', value: 'groove' },
						{ label: 'Ridge', value: 'ridge' },
						{ label: 'Inset', value: 'inset' },
						{ label: 'Outset', value: 'outset' },
					]}
					onChange={val => {
						onChange({
							[`${prefix}border-style-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: val,
						});
					}}
				/>
			)}
			{!disableColor && borderStyleValue && borderStyleValue !== 'none' && (
				<ColorControl
					label={__('Border', 'maxi-blocks')}
					color={getLastBreakpointAttribute(
						`${prefix}border-color`,
						breakpoint,
						props,
						isHover
					)}
					defaultColor={getDefaultAttribute(
						`${prefix}border-color-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					)}
					paletteColor={getLastBreakpointAttribute(
						`${prefix}border-palette-color`,
						breakpoint,
						props,
						isHover
					)}
					paletteStatus={getLastBreakpointAttribute(
						`${prefix}border-palette-color-status`,
						breakpoint,
						props,
						isHover
					)}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							[`${prefix}border-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: color,
							[`${prefix}border-palette-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: paletteColor,
							[`${prefix}border-palette-color-status-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: paletteStatus,
						});
					}}
					disableImage
					disableVideo
					disableGradient
					showPalette
					isHover={isHover}
					deviceType={breakpoint}
					clientId={clientId}
					globalProps={
						isButton && {
							target: `${
								isHover ? 'hover-' : ''
							}border-color-global`,
							type: 'button',
						}
					}
				/>
			)}
			{!disableAdvanced &&
				borderStyleValue &&
				borderStyleValue !== 'none' && (
					<AxisControl
						{...getGroupAttributes(
							props,
							'borderWidth',
							isHover,
							prefix
						)}
						target={`${prefix}border`}
						auxTarget='width'
						label={__('Border width', 'maxi-blocks')}
						onChange={obj => onChange(obj)}
						breakpoint={breakpoint}
						allowedUnits={['px', 'em', 'vw']}
						minMaxSettings={{
							px: {
								min: 0,
								max: 99,
							},
							em: {
								min: 0,
								max: 10,
							},
							vw: {
								min: 0,
								max: 10,
							},
						}}
						disableAuto
						isHover={isHover}
					/>
				)}

			{!disableAdvanced && (
				<>
					<hr />
					<AxisControl
						{...getGroupAttributes(
							props,
							'borderRadius',
							isHover,
							prefix
						)}
						target={`${prefix}border`}
						auxTarget='radius'
						label={__('Border radius', 'maxi-blocks')}
						onChange={obj => onChange(obj)}
						breakpoint={breakpoint}
						minMaxSettings={{
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
						}}
						disableAuto
						isHover={isHover}
						inputsArray={[
							'top-left',
							'top-right',
							'bottom-right',
							'bottom-left',
							'unit',
							'sync',
						]}
					/>
				</>
			)}
		</div>
	);
};

export default BorderControl;
