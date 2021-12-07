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
	getAttributeKey,
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
		globalProps,
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

	const axisItems = [
		`${prefix}border-top-width`,
		`${prefix}border-right-width`,
		`${prefix}border-bottom-width`,
		`${prefix}border-left-width`,
	];

	const getIsActive = () => {
		const hasBorderWidth = axisItems.some(item => {
			return isNumber(
				getLastBreakpointAttribute(item, breakpoint, props, isHover)
			);
		});

		if (hasBorderWidth) return borderStyleValue;
		return 'none';
	};

	const getValuesOnChangeType = () => {
		const response = {};

		axisItems.forEach(item => {
			const value = getLastBreakpointAttribute(
				item,
				breakpoint,
				props,
				isHover
			);

			if (!value)
				response[getAttributeKey(item, isHover, false, breakpoint)] = 2;
		});

		return response;
	};

	return (
		<div className={classes}>
			<DefaultStylesControl
				items={[
					{
						activeItem: getIsActive() === 'none',
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
						activeItem: getIsActive() === 'solid',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () => onChangeDefault(borderSolid(prefix)),
					},
					{
						activeItem: getIsActive() === 'dashed',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () => onChangeDefault(borderDashed(prefix)),
					},
					{
						activeItem: getIsActive() === 'dotted',
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
					label={__('Add border line', 'maxi-blocks')}
					className='maxi-border-control__type'
					value={borderStyleValue || 'none'}
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
							...getValuesOnChangeType(),
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
					paletteStatus={getLastBreakpointAttribute(
						`${prefix}border-palette-color-status`,
						breakpoint,
						props,
						isHover
					)}
					paletteColor={getLastBreakpointAttribute(
						`${prefix}border-palette-color`,
						breakpoint,
						props,
						isHover
					)}
					paletteOpacity={getLastBreakpointAttribute(
						`${prefix}border-palette-opacity`,
						breakpoint,
						props,
						isHover
					)}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteOpacity,
						color,
					}) => {
						onChange({
							[`${prefix}border-palette-color-status-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: paletteStatus,
							[`${prefix}border-palette-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: paletteColor,
							[`${prefix}border-palette-opacity-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: paletteOpacity,
							[`${prefix}border-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: color,
						});
					}}
					disableImage
					disableVideo
					disableGradient
					isHover={isHover}
					deviceType={breakpoint}
					clientId={clientId}
					globalProps={globalProps}
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
