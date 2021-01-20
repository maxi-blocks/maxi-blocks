/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import AxisControl from '../axis-control/newAxisControl';
import {
	borderNone,
	borderSolid,
	borderDashed,
	borderDotted,
} from './newDefaults';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointValue';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

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
	} = props;

	const classes = classnames('maxi-border-control', className);

	const onChangeDefault = defaultProp => {
		const response = {};

		Object.entries(defaultProp).forEach(([key, value]) => {
			response[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] = value;
		});

		onChange(response);
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
				getLastBreakpointAttribute(
					'border-top-width',
					breakpoint,
					props,
					isHover
				)
			);
		});

		if (hasBorderWidth)
			return getLastBreakpointAttribute(
				'border-style',
				breakpoint,
				props,
				isHover
			);
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
			{!disableAdvanced && (
				<SelectControl
					label={__('Border Type', 'maxi-blocks')}
					className='maxi-border-control__type'
					value={getLastBreakpointAttribute(
						'border-style',
						breakpoint,
						props,
						isHover
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
						onChange({
							[`border-style-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: val,
						});
					}}
				/>
			)}
			{!disableColor &&
				getLastBreakpointAttribute(
					'border-style',
					breakpoint,
					props,
					isHover
				) !== 'none' && (
					<ColorControl
						label={__('Border', 'maxi-blocks')}
						color={getLastBreakpointAttribute(
							'border-color',
							breakpoint,
							props,
							isHover
						)}
						defaultColor={getDefaultAttribute(
							`border-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`
						)}
						onChange={val => {
							onChange({
								[`border-color-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: val,
							});
						}}
						disableImage
						disableVideo
						disableGradient
						disableGradientAboveBackground
					/>
				)}
			{!disableAdvanced &&
				getLastBreakpointAttribute(
					'border-style',
					breakpoint,
					props,
					isHover
				) !== 'none' && (
					<Fragment>
						<AxisControl
							{...getGroupAttributes(
								props,
								'borderWidth',
								isHover
							)}
							target='border'
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
						<AxisControl
							{...getGroupAttributes(
								props,
								'borderRadius',
								isHover
							)}
							target='border'
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
					</Fragment>
				)}
		</div>
	);
};

export default BorderControl;
