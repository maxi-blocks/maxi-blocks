/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisControl from '@components/axis-control';
import ColorControl from '@components/color-control';
import DefaultStylesControl from '@components/default-styles-control';
import Icon from '@components/icon';
import SelectControl from '@components/select-control';
import {
	borderNone,
	borderSolid,
	borderDashed,
	borderDotted,
} from './defaults';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getAttributeKey,
	getDefaultAttribute,
} from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNumber, capitalize } from 'lodash';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid, borderWidth } from '@maxi-icons';

/**
 * Component
 */
const BorderColorControl = props => {
	const {
		prefix = '',
		breakpoint,
		isHover = false,
		onChangeInline = null,
		onChange,
		clientId,
		globalProps,
	} = props;

	return (
		<ColorControl
			label={__('Border', 'maxi-blocks')}
			color={getLastBreakpointAttribute({
				target: `${prefix}border-color`,
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteStatus={getLastBreakpointAttribute({
				target: `${prefix}border-palette-status`,
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteSCStatus={getLastBreakpointAttribute({
				target: `${prefix}border-palette-sc-status`,
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteColor={getLastBreakpointAttribute({
				target: `${prefix}border-palette-color`,
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteOpacity={getLastBreakpointAttribute({
				target: `${prefix}border-palette-opacity`,
				breakpoint,
				attributes: props,
				isHover,
			})}
			onChangeInline={({ color }) => {
				onChangeInline &&
					onChangeInline({
						'border-color': color,
					});
			}}
			onChange={({
				paletteColor,
				paletteStatus,
				paletteSCStatus,
				paletteOpacity,
				color,
			}) => {
				onChange({
					[`${prefix}border-palette-status-${breakpoint}${
						isHover ? '-hover' : ''
					}`]: paletteStatus,
					[`${prefix}border-palette-sc-status-${breakpoint}${
						isHover ? '-hover' : ''
					}`]: paletteSCStatus,
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
			prefix={`${prefix}border-`}
		/>
	);
};

const BorderWidthControl = props => {
	const {
		prefix = '',
		breakpoint,
		isHover = false,
		onChange,
		isToolbar,
	} = props;

	return (
		<AxisControl
			{...getGroupAttributes(props, 'borderWidth', isHover, prefix)}
			target={`${prefix}border`}
			auxTarget='width'
			{...(!isToolbar && { label: __('Border width', 'maxi-blocks') })}
			onChange={obj => {
				if (!isToolbar) onChange(obj);
				else
					onChange({
						[`border-sync-width-${breakpoint}`]: 'all',
						...obj,
					});
			}}
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
			{...(isToolbar && { disableSync: true })}
		/>
	);
};

const BorderControl = props => {
	const {
		className,
		onChange,
		breakpoint = 'general',
		isToolbar = false,
		disableColor = false,
		isHover = false,
		prefix = '',
	} = props;

	const borderWidthLastValue = () => {
		const response = {};

		['top', 'right', 'bottom', 'left'].forEach(item => {
			response[`border${capitalize(item)}Width`] =
				getLastBreakpointAttribute({
					target: `${prefix}border-${item}-width`,
					breakpoint,
					attributes: props,
					isHover,
				});
		});

		return response;
	};

	const borderStyleValue = getLastBreakpointAttribute({
		target: `${prefix}border-style`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const isBorderEnable = borderStyleValue && borderStyleValue !== 'none';

	const classes = classnames(
		'maxi-border-control',
		!isBorderEnable && 'maxi-border-control--disable',
		className
	);

	const axisItems = [
		`${prefix}border-top-width`,
		`${prefix}border-right-width`,
		`${prefix}border-bottom-width`,
		`${prefix}border-left-width`,
	];

	const onChangeDefault = defaultProp => {
		const response = {};

		Object.entries(defaultProp).forEach(([key, value]) => {
			response[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] = value;
		});

		onChange(response);
	};

	const getIsActive = () => {
		const hasBorderWidth = axisItems.some(item => {
			return isNumber(
				getLastBreakpointAttribute({
					target: item,
					breakpoint,
					attributes: props,
					isHover,
				})
			);
		});

		if (hasBorderWidth) return borderStyleValue || 'none';
		return 'none';
	};

	const getValuesOnChangeType = () => {
		const response = {};

		axisItems.forEach(item => {
			const value = getLastBreakpointAttribute({
				target: item,
				breakpoint,
				attributes: props,
				isHover,
			});

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
						onChange: () => onChangeDefault(borderNone(prefix)),
					},
					{
						activeItem: getIsActive() === 'solid',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () =>
							onChangeDefault(
								borderSolid(prefix, borderWidthLastValue())
							),
					},
					{
						activeItem: getIsActive() === 'dashed',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () =>
							onChangeDefault(
								borderDashed(prefix, borderWidthLastValue())
							),
					},
					{
						activeItem: getIsActive() === 'dotted',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dotted}
							/>
						),
						onChange: () =>
							onChangeDefault(
								borderDotted(prefix, borderWidthLastValue())
							),
					},
				]}
			/>
			{!isToolbar && (
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Add border line', 'maxi-blocks')}
					className='maxi-border-control__type'
					value={borderStyleValue || 'none'}
					defaultValue={getDefaultAttribute(
						getAttributeKey(
							'border-style',
							isHover,
							prefix,
							breakpoint
						)
					)}
					onReset={() =>
						onChange({
							[getAttributeKey(
								'border-style',
								isHover,
								prefix,
								breakpoint
							)]: getDefaultAttribute(
								getAttributeKey(
									'border-style',
									isHover,
									prefix,
									breakpoint
								)
							),
							isReset: true,
						})
					}
					newStyle
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
			{isToolbar && (
				<div className='maxi-border-control__icon'>
					<Icon icon={borderWidth} />
				</div>
			)}
			{isToolbar && (
				<BorderWidthControl isToolbar={isToolbar} {...props} />
			)}
			{(isToolbar || (!disableColor && isBorderEnable)) && (
				<BorderColorControl {...props} />
			)}
			{!isToolbar && isBorderEnable && (
				<BorderWidthControl isToolbar={isToolbar} {...props} />
			)}
			{!isToolbar && (
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
						onChange={onChange}
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
						]}
					/>
				</>
			)}
		</div>
	);
};

export default withRTC(BorderControl);
