/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState, useEffect } = wp.element;
const { RangeControl, SelectControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import {
	ColorControl,
	SizeControl,
	DefaultStylesControl,
	__experimentalOpacityControl,
	__experimentalFancyRadioControl,
} from '../../components';
import { getLastBreakpointValue } from '../../utils';
import {
	dividerSolidHorizontal,
	dividerDottedHorizontal,
	dividerDashedHorizontal,
	dividerSolidVertical,
	dividerDottedVertical,
	dividerDashedVertical,
	dividerNone,
} from './defaults';

/**
 * External dependencies
 */
import { isNil, isObject } from 'lodash';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

/**
 * Component
 */
const DividerControl = props => {
	const {
		divider,
		defaultDivider,
		onChange,
		lineOrientation,
		disableColor = false,
		disableLineStyle = false,
		disableBorderRadius = false,
		breakpoint = 'general',
	} = props;

	const minMaxSettings = {
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
			max: 100,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const [orientation, changeOrientation] = useState(lineOrientation);

	const value = !isObject(divider) ? JSON.parse(divider) : divider;

	const defaultValue = !isObject(defaultDivider)
		? JSON.parse(defaultDivider)
		: defaultDivider;

	useEffect(() => {
		if (lineOrientation !== orientation) {
			changeOrientation(lineOrientation);
			if (lineOrientation === 'vertical') {
				if (!isNil(value.general.width)) {
					value.general.height = value.general.width;
					value.general.width = '';
				}
				if (!isNil(value.general['border-top-width'])) {
					value.general['border-right-width'] =
						value.general['border-top-width'];
					value.general['border-top-width'] = '';
				}
			} else {
				if (!isNil(value.general.height)) {
					value.general.width = value.general.height;
					value.general.height = '';
				}
				if (!isNil(value.general['border-top-width'])) {
					value.general['border-top-width'] =
						value.general['border-right-width'];
					value.general['border-right-width'] = '';
				}
			}

			onChange(JSON.stringify(value));
		}
	}, [lineOrientation, orientation, value, onChange]);

	return (
		<Fragment>
			<DefaultStylesControl
				items={[
					{
						activeItem: value.general['border-style'] === 'none',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChange(JSON.stringify(dividerNone)),
					},
					{
						activeItem: value.general['border-style'] === 'solid',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(
									JSON.stringify(dividerSolidHorizontal)
								);
							else onChange(JSON.stringify(dividerSolidVertical));
						},
					},
					{
						activeItem: value.general['border-style'] === 'dashed',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(
									JSON.stringify(dividerDashedHorizontal)
								);
							else
								onChange(JSON.stringify(dividerDashedVertical));
						},
					},
					{
						activeItem: value.general['border-style'] === 'dotted',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dotted}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(
									JSON.stringify(dividerDottedHorizontal)
								);
							else
								onChange(JSON.stringify(dividerDottedVertical));
						},
					},
				]}
			/>
			{!disableColor && (
				<ColorControl
					label={__('Color', 'maxi-blocks')}
					color={value.general['border-color']}
					defaultColor={defaultValue.general['border-color']}
					onChange={val => {
						value.general['border-color'] = val;
						onChange(JSON.stringify(value));
					}}
					disableGradient
				/>
			)}
			{!disableLineStyle && (
				<SelectControl
					label={__('Line Style', 'maxi-blocks')}
					options={[
						{ label: __('None', 'maxi-blocks'), value: 'none' },
						{ label: __('Dotted', 'maxi-blocks'), value: 'dotted' },
						{ label: __('Dashed', 'maxi-blocks'), value: 'dashed' },
						{ label: __('Solid', 'maxi-blocks'), value: 'solid' },
						{ label: __('Double', 'maxi-blocks'), value: 'double' },
					]}
					value={value.general['border-style']}
					onChange={val => {
						value.general['border-style'] = val;
						if (val === 'none') value.general.width = 0;
						onChange(JSON.stringify(value));
					}}
				/>
			)}
			{!disableBorderRadius && value.general['border-style'] === 'solid' && (
				<__experimentalFancyRadioControl
					label={__('Border Radius', 'maxi-blocks')}
					selected={value.general['border-radius']}
					options={[
						{ label: __('No', 'maxi-blocks'), value: '' },
						{ label: __('Yes', 'maxi-blocks'), value: '20px' },
					]}
					onChange={val => {
						value.general['border-radius'] = val;
						onChange(JSON.stringify(value));
					}}
				/>
			)}
			{orientation === 'horizontal' && (
				<Fragment>
					<SizeControl
						label={__('Line Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'widthUnit',
							breakpoint
						)}
						defaultUnit={defaultValue[breakpoint].widthUnit}
						onChangeUnit={val => {
							value.general.widthUnit = val;

							onChange(JSON.stringify(value));
						}}
						value={getLastBreakpointValue(
							value,
							'width',
							breakpoint
						)}
						defaultValue={defaultValue[breakpoint].width}
						onChangeValue={val => {
							value.general.width = Number(val);

							onChange(JSON.stringify(value));
						}}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Line Weight', 'maxi-blocks')}
						disableUnit
						unit={getLastBreakpointValue(
							value,
							'border-top-widthUnit',
							breakpoint
						)}
						defaultUnit={
							defaultValue[breakpoint]['border-top-widthUnit']
						}
						onChangeUnit={val => {
							value.general['border-top-widthUnit'] = val;

							onChange(JSON.stringify(value));
						}}
						value={getLastBreakpointValue(
							value,
							'border-top-width',
							breakpoint
						)}
						defaultValue={
							defaultValue[breakpoint]['border-top-width']
						}
						onChangeValue={val => {
							value.general['border-top-width'] = Number(val);

							onChange(JSON.stringify(value));
						}}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
			{orientation === 'vertical' && (
				<Fragment>
					<RangeControl
						label={__('Size', 'maxi-blocks')}
						value={Number(value.general.height)}
						onChange={val => {
							isNil(val)
								? (value.general.height =
										defaultValue.general.height)
								: (value.general.height = Number(val));

							onChange(JSON.stringify(value));
						}}
						max={100}
						allowReset
						initialPosition={defaultValue.general.height}
					/>
					<RangeControl
						label={__('Weight', 'maxi-blocks')}
						value={Number(value.general['border-right-width'])}
						onChange={val => {
							isNil(val)
								? (value.general['border-right-width'] =
										defaultValue.general[
											'border-right-width'
										])
								: (value.general['border-right-width'] = Number(
										val
								  ));

							onChange(JSON.stringify(value));
						}}
						max={100}
						allowReset
						initialPosition={
							defaultValue.general['border-right-width']
						}
					/>
				</Fragment>
			)}
			<__experimentalOpacityControl
				opacity={value.opacity}
				defaultOpacity={defaultValue.opacity}
				onChange={val => {
					value.opacity = JSON.parse(val);
					onChange(JSON.stringify(value));
				}}
			/>
		</Fragment>
	);
};

export default DividerControl;
