/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import __experimentalAxisControl from '../axis-control';
import {
	borderNone,
	borderSolid,
	borderDashed,
	borderDotted,
} from './defaults';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isNumber } from 'lodash';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

/**
 * Component
 */
const BorderControl = props => {
	const {
		border,
		defaultBorder,
		className,
		onChange,
		breakpoint = 'general',
		disableAdvanced = false,
	} = props;

	const value = !isObject(border) ? JSON.parse(border) : border;

	const defaultValue = !isObject(defaultBorder)
		? JSON.parse(defaultBorder)
		: defaultBorder;

	const classes = classnames('maxi-border-control', className);

	const onChangeDefault = defaultProp => {
		value[breakpoint] = defaultProp.border;
		value.borderWidth.unit = defaultProp.borderWidth.unit;
		value.borderWidth[breakpoint] = defaultProp.borderWidth.width;

		onChange(JSON.stringify(value));
	};

	const getIsActive = () => {
		const items = [
			'border-top-width',
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
		];

		const hasBorderWidth = items.some(item => {
			return isNumber(
				getLastBreakpointValue(value.borderWidth, item, breakpoint)
			);
		});

		if (hasBorderWidth)
			return getLastBreakpointValue(value, 'border-style', breakpoint);
		return 'none';
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
						onChange: () => onChangeDefault(borderNone),
					},
					{
						activeItem: getIsActive() === 'solid',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () => onChangeDefault(borderSolid),
					},
					{
						activeItem: getIsActive() === 'dashed',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () => onChangeDefault(borderDashed),
					},
					{
						activeItem: getIsActive() === 'dotted',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dotted}
							/>
						),
						onChange: () => onChangeDefault(borderDotted),
					},
				]}
			/>
			<ColorControl
				label={__('Border', 'maxi-blocks')}
				color={getLastBreakpointValue(
					value,
					'border-color',
					breakpoint
				)}
				defaultColor={defaultValue[breakpoint]['border-color']}
				onChange={val => {
					value[breakpoint]['border-color'] = val;

					onChange(JSON.stringify(value));
				}}
				disableImage
				disableVideo
				disableGradient
				disableGradientAboveBackground
			/>
			{!disableAdvanced && (
				<Fragment>
					<SelectControl
						label={__('Border Type', 'maxi-blocks')}
						className='maxi-border-control__type'
						value={getLastBreakpointValue(
							value,
							'border-style',
							breakpoint
						)}
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
							value[breakpoint]['border-style'] = val;
							onChange(JSON.stringify(value));
						}}
					/>
					<__experimentalAxisControl
						values={value.borderWidth}
						defaultValues={defaultValue.borderWidth}
						onChange={val => {
							value.borderWidth = JSON.parse(val);
							onChange(JSON.stringify(value));
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
					/>
					<__experimentalAxisControl
						values={value.borderRadius}
						defaultValues={defaultValue.borderRadius}
						onChange={val => {
							value.borderRadius = JSON.parse(val);
							onChange(JSON.stringify(value));
						}}
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
					/>
				</Fragment>
			)}
		</div>
	);
};

export default BorderControl;
