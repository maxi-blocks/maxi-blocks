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
	DefaultStylesControl,
	OpacityControl,
	FancyRadioControl,
	SizeControl,
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

	const dividerValue = !isObject(divider) ? JSON.parse(divider) : divider;

	const defaultValue = !isObject(defaultDivider)
		? JSON.parse(defaultDivider)
		: defaultDivider;

	useEffect(() => {
		if (lineOrientation !== orientation) {
			changeOrientation(lineOrientation);
			if (lineOrientation === 'vertical') {
				if (!isNil(dividerValue.general.width)) {
					dividerValue.general.height = dividerValue.general.width;
					dividerValue.general.width = '';
				}
				if (!isNil(dividerValue.general['border-top-width'])) {
					dividerValue.general['border-right-width'] =
						dividerValue.general['border-top-width'];
					dividerValue.general['border-top-width'] = '';
				}
			} else {
				if (!isNil(dividerValue.general.height)) {
					dividerValue.general.width = dividerValue.general.height;
					dividerValue.general.height = '';
				}
				if (!isNil(dividerValue.general['border-top-width'])) {
					dividerValue.general['border-top-width'] =
						dividerValue.general['border-right-width'];
					dividerValue.general['border-right-width'] = '';
				}
			}

			onChange(JSON.stringify(dividerValue));
		}
	}, [lineOrientation, orientation, dividerValue, onChange]);

	return (
		<Fragment>
			<DefaultStylesControl
				items={[
					{
						activeItem:
							dividerValue.general['border-style'] === 'none',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChange(JSON.stringify(dividerNone)),
					},
					{
						activeItem:
							dividerValue.general['border-style'] === 'solid',
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
						activeItem:
							dividerValue.general['border-style'] === 'dashed',
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
						activeItem:
							dividerValue.general['border-style'] === 'dotted',
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
					color={dividerValue.general['border-color']}
					defaultColor={defaultValue.general['border-color']}
					onChange={val => {
						dividerValue.general['border-color'] = val;
						onChange(JSON.stringify(dividerValue));
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
					value={dividerValue.general['border-style']}
					onChange={val => {
						dividerValue.general['border-style'] = val;
						if (val === 'none') dividerValue.general.width = 0;
						onChange(JSON.stringify(dividerValue));
					}}
				/>
			)}
			{!disableBorderRadius &&
				dividerValue.general['border-style'] === 'solid' && (
					<FancyRadioControl
						label={__('Line Radius', 'maxi-blocks')}
						selected={dividerValue.general['border-radius']}
						options={[
							{ label: __('No', 'maxi-blocks'), value: '' },
							{ label: __('Yes', 'maxi-blocks'), value: '20px' },
						]}
						onChange={val => {
							dividerValue.general['border-radius'] = val;
							onChange(JSON.stringify(dividerValue));
						}}
					/>
				)}
			{orientation === 'horizontal' && (
				<Fragment>
					<SizeControl
						label={__('Line Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							dividerValue,
							'widthUnit',
							breakpoint
						)}
						defaultUnit={defaultValue[breakpoint].widthUnit}
						onChangeUnit={val => {
							dividerValue.general.widthUnit = val;

							onChange(JSON.stringify(dividerValue));
						}}
						value={getLastBreakpointValue(
							dividerValue,
							'width',
							breakpoint
						)}
						defaultValue={defaultValue[breakpoint].width}
						onChangeValue={val => {
							dividerValue.general.width = Number(val);

							onChange(JSON.stringify(dividerValue));
						}}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Line Weight', 'maxi-blocks')}
						allowedUnits={['px', 'em', 'vw']}
						unit={getLastBreakpointValue(
							dividerValue,
							'border-top-widthUnit',
							breakpoint
						)}
						defaultUnit={
							defaultValue[breakpoint]['border-top-widthUnit']
						}
						onChangeUnit={val => {
							dividerValue.general['border-top-widthUnit'] = val;

							onChange(JSON.stringify(dividerValue));
						}}
						value={getLastBreakpointValue(
							dividerValue,
							'border-top-width',
							breakpoint
						)}
						defaultValue={
							defaultValue[breakpoint]['border-top-width']
						}
						onChangeValue={val => {
							dividerValue.general['border-top-width'] = Number(
								val
							);

							onChange(JSON.stringify(dividerValue));
						}}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
			{orientation === 'vertical' && (
				<Fragment>
					<RangeControl
						label={__('Size', 'maxi-blocks')}
						value={Number(dividerValue.general.height)}
						onChange={val => {
							isNil(val)
								? (dividerValue.general.height =
										defaultValue.general.height)
								: (dividerValue.general.height = Number(val));

							onChange(JSON.stringify(dividerValue));
						}}
						max={100}
						allowReset
						initialPosition={defaultValue.general.height}
					/>
					<RangeControl
						label={__('Weight', 'maxi-blocks')}
						value={Number(
							dividerValue.general['border-right-width']
						)}
						onChange={val => {
							isNil(val)
								? (dividerValue.general['border-right-width'] =
										defaultValue.general[
											'border-right-width'
										])
								: (dividerValue.general[
										'border-right-width'
								  ] = Number(val));

							onChange(JSON.stringify(dividerValue));
						}}
						max={100}
						allowReset
						initialPosition={
							defaultValue.general['border-right-width']
						}
					/>
				</Fragment>
			)}
			<OpacityControl
				opacity={dividerValue.opacity}
				defaultOpacity={defaultValue.opacity}
				onChange={val => {
					dividerValue.opacity = JSON.parse(val);
					onChange(JSON.stringify(dividerValue));
				}}
			/>
		</Fragment>
	);
};

export default DividerControl;
