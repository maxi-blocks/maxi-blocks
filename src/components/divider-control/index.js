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
import { isNil } from 'lodash';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

/**
 * Component
 */
const DividerControl = props => {
	const {
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

	const divider = { ...props.divider };
	const defaultDivider = { ...props.defaultDivider };

	useEffect(() => {
		if (lineOrientation !== orientation) {
			changeOrientation(lineOrientation);
			if (lineOrientation === 'vertical') {
				if (!isNil(divider.general.width)) {
					divider.general.height = divider.general.width;
					divider.general.width = '';
				}
				if (!isNil(divider.general['border-top-width'])) {
					divider.general['border-right-width'] =
						divider.general['border-top-width'];
					divider.general['border-top-width'] = '';
				}
			} else {
				if (!isNil(divider.general.height)) {
					divider.general.width = divider.general.height;
					divider.general.height = '';
				}
				if (!isNil(divider.general['border-top-width'])) {
					divider.general['border-top-width'] =
						divider.general['border-right-width'];
					divider.general['border-right-width'] = '';
				}
			}

			onChange(divider);
		}
	}, [lineOrientation, orientation, divider, onChange]);

	return (
		<Fragment>
			<DefaultStylesControl
				items={[
					{
						activeItem: divider.general['border-style'] === 'none',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChange(dividerNone),
					},
					{
						activeItem: divider.general['border-style'] === 'solid',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(dividerSolidHorizontal);
							else onChange(dividerSolidVertical);
						},
					},
					{
						activeItem:
							divider.general['border-style'] === 'dashed',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(dividerDashedHorizontal);
							else onChange(dividerDashedVertical);
						},
					},
					{
						activeItem:
							divider.general['border-style'] === 'dotted',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dotted}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(dividerDottedHorizontal);
							else onChange(dividerDottedVertical);
						},
					},
				]}
			/>
			{!disableColor && (
				<ColorControl
					label={__('Color', 'maxi-blocks')}
					color={divider.general['border-color']}
					defaultColor={defaultDivider.general['border-color']}
					onChange={val => {
						divider.general['border-color'] = val;
						onChange(divider);
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
					value={divider.general['border-style']}
					onChange={val => {
						divider.general['border-style'] = val;
						if (val === 'none') divider.general.width = 0;
						onChange(divider);
					}}
				/>
			)}
			{!disableBorderRadius &&
				divider.general['border-style'] === 'solid' && (
					<FancyRadioControl
						label={__('Line Radius', 'maxi-blocks')}
						selected={divider.general['border-radius']}
						options={[
							{ label: __('No', 'maxi-blocks'), value: '' },
							{ label: __('Yes', 'maxi-blocks'), value: '20px' },
						]}
						onChange={val => {
							divider.general['border-radius'] = val;
							onChange(divider);
						}}
					/>
				)}
			{orientation === 'horizontal' && (
				<Fragment>
					<SizeControl
						label={__('Line Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							divider,
							'widthUnit',
							breakpoint
						)}
						defaultUnit={defaultDivider[breakpoint].widthUnit}
						onChangeUnit={val => {
							divider.general.widthUnit = val;

							onChange(divider);
						}}
						value={getLastBreakpointValue(
							divider,
							'width',
							breakpoint
						)}
						defaultDivider={defaultDivider[breakpoint].width}
						onChangeValue={val => {
							divider.general.width = Number(val);

							onChange(divider);
						}}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Line Weight', 'maxi-blocks')}
						allowedUnits={['px', 'em', 'vw']}
						unit={getLastBreakpointValue(
							divider,
							'border-top-widthUnit',
							breakpoint
						)}
						defaultUnit={
							defaultDivider[breakpoint]['border-top-widthUnit']
						}
						onChangeUnit={val => {
							divider.general['border-top-widthUnit'] = val;

							onChange(divider);
						}}
						value={getLastBreakpointValue(
							divider,
							'border-top-width',
							breakpoint
						)}
						defaultDivider={
							defaultDivider[breakpoint]['border-top-width']
						}
						onChangeValue={val => {
							divider.general['border-top-width'] = Number(val);

							onChange(divider);
						}}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
			{orientation === 'vertical' && (
				<Fragment>
					<RangeControl
						label={__('Size', 'maxi-blocks')}
						value={Number(divider.general.height)}
						onChange={val => {
							isNil(val)
								? (divider.general.height =
										defaultDivider.general.height)
								: (divider.general.height = Number(val));

							onChange(divider);
						}}
						max={100}
						allowReset
						initialPosition={defaultDivider.general.height}
					/>
					<RangeControl
						label={__('Weight', 'maxi-blocks')}
						value={Number(divider.general['border-right-width'])}
						onChange={val => {
							isNil(val)
								? (divider.general['border-right-width'] =
										defaultDivider.general[
											'border-right-width'
										])
								: (divider.general[
										'border-right-width'
								  ] = Number(val));

							onChange(divider);
						}}
						max={100}
						allowReset
						initialPosition={
							defaultDivider.general['border-right-width']
						}
					/>
				</Fragment>
			)}
			<OpacityControl
				opacity={divider.opacity}
				defaultOpacity={defaultDivider.opacity}
				onChange={val => {
					divider.opacity = val;
					onChange(divider);
				}}
			/>
		</Fragment>
	);
};

export default DividerControl;
