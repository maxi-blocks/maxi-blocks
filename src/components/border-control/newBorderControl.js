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

import getLastBreakpointAttribute from '../../extensions/styles/getLastBrakpointValue';
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
	} = props;

	const classes = classnames('maxi-border-control', className);

	const onChangeDefault = defaultProp => {
		const response = {};

		Object.entries(defaultProp).forEach(([key, value]) => {
			response[`${key}-${breakpoint}`] = value;
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
					props
				)
			);
		});

		if (hasBorderWidth)
			return getLastBreakpointAttribute(
				'border-style',
				breakpoint,
				props
			);
		return 'none';
	};

	const getBorderAttributes = type => {
		const response = {};

		Object.entries(props).forEach(([key, value]) => {
			if (key.includes(type)) response[key] = value;
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
			{!disableColor && (
				<ColorControl
					label={__('Border', 'maxi-blocks')}
					color={getLastBreakpointAttribute(
						'border-color',
						breakpoint,
						props
					)}
					defaultColor={getDefaultAttribute(
						`border-color-${breakpoint}`
					)}
					onChange={val => {
						onChange({ [`border-color-${breakpoint}`]: val });
					}}
					disableImage
					disableVideo
					disableGradient
					disableGradientAboveBackground
				/>
			)}
			{!disableAdvanced && (
				<Fragment>
					<SelectControl
						label={__('Border Type', 'maxi-blocks')}
						className='maxi-border-control__type'
						value={getLastBreakpointAttribute(
							'border-style',
							breakpoint,
							props
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
							onChange({ [`border-style-${breakpoint}`]: val });
						}}
					/>
					<AxisControl
						{...getBorderAttributes('width')}
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
					/>
					<AxisControl
						{...getBorderAttributes('radius')}
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
					/>
				</Fragment>
			)}
		</div>
	);
};

export default BorderControl;
