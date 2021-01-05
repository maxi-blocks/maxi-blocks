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
import AxisControl from '../axis-control';
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
	} = props;
	const border = { ...props.border };
	const defaultBorder = { ...props.defaultBorder };

	const classes = classnames('maxi-border-control', className);

	const onChangeDefault = defaultProp => {
		border[breakpoint] = defaultProp.border;
		border.borderWidth.unit = defaultProp.borderWidth.unit;
		border.borderWidth[breakpoint] = defaultProp.borderWidth.width;

		onChange(border);
	};

	const getIsActive = type => {
		return (
			getLastBreakpointValue(border, 'border-style', breakpoint) === type
		);
	};

	return (
		<div className={classes}>
			<DefaultStylesControl
				items={[
					{
						activeItem: getIsActive('none'),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChangeDefault(borderNone),
					},
					{
						activeItem: getIsActive('solid'),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () => onChangeDefault(borderSolid),
					},
					{
						activeItem: getIsActive('dashed'),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () => onChangeDefault(borderDashed),
					},
					{
						activeItem: getIsActive('dotted'),
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
			{!disableAdvanced && (
				<SelectControl
					label={__('Border Type', 'maxi-blocks')}
					className='maxi-border-control__type'
					value={getLastBreakpointValue(
						border,
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
						border[breakpoint]['border-style'] = val;
						onChange(border);
					}}
				/>
			)}
			{!disableColor && border[breakpoint]['border-style'] !== 'none' && (
				<ColorControl
					label={__('Border', 'maxi-blocks')}
					color={getLastBreakpointValue(
						border,
						'border-color',
						breakpoint
					)}
					defaultColor={defaultBorder[breakpoint]['border-color']}
					onChange={val => {
						border[breakpoint]['border-color'] = val;

						onChange(border);
					}}
					disableImage
					disableVideo
					disableGradient
					disableGradientAboveBackground
				/>
			)}
			{!disableAdvanced && border[breakpoint]['border-style'] !== 'none' && (
				<Fragment>
					<AxisControl
						values={border.borderWidth}
						defaultValues={defaultBorder.borderWidth}
						onChange={val => {
							border.borderWidth = val;
							onChange(border);
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
					<AxisControl
						values={border.borderRadius}
						defaultValues={defaultBorder.borderRadius}
						onChange={val => {
							border.borderRadius = val;
							onChange(border);
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
