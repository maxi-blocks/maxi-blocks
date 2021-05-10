/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import AxisControl from '../axis-control';
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
	} = props;

	const classes = classnames('maxi-border-control', className);

	const onChangeDefault = defaultProp => {
		const response = {};

		Object.entries(defaultProp).forEach(([key, value]) => {
			response[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] = value;
		});

		onChange(response);
	};

	const activeBorderStyle =
		getLastBreakpointAttribute(
			`${prefix}border-style`,
			breakpoint,
			props,
			isHover
		) || 'none';

	return (
		<div className={classes}>
			<DefaultStylesControl
				items={[
					{
						activeItem: activeBorderStyle === 'none',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChangeDefault(borderNone(prefix)),
					},
					{
						activeItem: activeBorderStyle === 'solid',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () => onChangeDefault(borderSolid(prefix)),
					},
					{
						activeItem: activeBorderStyle === 'dashed',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () => onChangeDefault(borderDashed(prefix)),
					},
					{
						activeItem: activeBorderStyle === 'dotted',
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
					value={getLastBreakpointAttribute(
						`${prefix}border-style`,
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
							[`${prefix}border-style-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: val,
						});
					}}
				/>
			)}
			{!disableAdvanced && activeBorderStyle !== 'none' && !disableColor && (
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
					onChange={val => {
						onChange({
							[`${prefix}border-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`]: val,
						});
					}}
					disableImage
					disableVideo
					disableGradient
				/>
			)}

			{!disableAdvanced && activeBorderStyle !== 'none' && (
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
			)}
		</div>
	);
};

export default BorderControl;
