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
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getAttributeKey,
	getDefaultAttribute,
} from '../../extensions/attributes';
import {
	axisDictionary,
	radiusAxisDictionary,
} from '../../extensions/attributes/constants';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNumber, capitalize } from 'lodash';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid, borderWidth } from '../../icons';

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
				target: 'bo_cc',
				breakpoint,
				attributes: props,
				isHover,
				prefix,
			})}
			paletteStatus={getLastBreakpointAttribute({
				target: 'bo_ps',
				breakpoint,
				attributes: props,
				isHover,
				prefix,
			})}
			paletteColor={getLastBreakpointAttribute({
				target: 'bo_pc',
				breakpoint,
				attributes: props,
				isHover,
				prefix,
			})}
			paletteOpacity={getLastBreakpointAttribute({
				target: 'bo_po',
				breakpoint,
				attributes: props,
				isHover,
				prefix,
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
				paletteOpacity,
				color,
			}) => {
				onChange({
					[getAttributeKey('bo_ps', isHover, prefix, breakpoint)]:
						paletteStatus,
					[getAttributeKey('bo_pc', isHover, prefix, breakpoint)]:
						paletteColor,
					[getAttributeKey('bo_po', isHover, prefix, breakpoint)]:
						paletteOpacity,
					[getAttributeKey('bo_cc', isHover, prefix, breakpoint)]:
						color,
				});
			}}
			disableImage
			disableVideo
			disableGradient
			isHover={isHover}
			deviceType={breakpoint}
			clientId={clientId}
			globalProps={globalProps}
			prefix={`${prefix}bo`}
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
			target={`${prefix}bo_w`}
			{...(!isToolbar && { label: __('Border width', 'maxi-blocks') })}
			onChange={obj => {
				if (!isToolbar) onChange(obj);
				else
					onChange({
						[`bo_w-sy-${breakpoint}`]: 'all',
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

		Object.keys(axisDictionary).forEach(item => {
			response[`border${capitalize(item)}Width`] =
				getLastBreakpointAttribute({
					target: 'bo_w.${item}',
					breakpoint,
					attributes: props,
					isHover,
					prefix,
				});
		});

		return response;
	};

	const borderStyleValue = getLastBreakpointAttribute({
		target: 'bo_s',
		breakpoint,
		attributes: props,
		isHover,
		prefix,
	});

	const isBorderEnable = borderStyleValue && borderStyleValue !== 'none';

	const classes = classnames(
		'maxi-border-control',
		!isBorderEnable && 'maxi-border-control--disable',
		className
	);

	const axisItems = [
		`${prefix}bo_w.t`,
		`${prefix}bo_w.r`,
		`${prefix}bo_w.b`,
		`${prefix}bo_w.l`,
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
					label={__('Add border line', 'maxi-blocks')}
					className='maxi-border-control__type'
					value={borderStyleValue || 'none'}
					defaultValue={getDefaultAttribute(
						getAttributeKey('bo_s', isHover, prefix, breakpoint)
					)}
					onReset={() =>
						onChange({
							[getAttributeKey(
								'bo_s',
								isHover,
								prefix,
								breakpoint
							)]: getDefaultAttribute(
								getAttributeKey(
									'bo_s',
									isHover,
									prefix,
									breakpoint
								)
							),
							isReset: true,
						})
					}
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
							[getAttributeKey(
								'bo_s',
								isHover,
								prefix,
								breakpoint
							)]: val,
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
						target={`${prefix}bo.ra`}
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
							...Object.keys(radiusAxisDictionary),
							'unit',
						]}
					/>
				</>
			)}
		</div>
	);
};

export default withRTC(BorderControl);
