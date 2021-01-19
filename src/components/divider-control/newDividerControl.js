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
import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointValue';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';
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
		breakpoint,
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

	// useEffect(() => {
	// 	if (lineOrientation !== orientation) {
	// 		changeOrientation(lineOrientation);
	// 		if (lineOrientation === 'vertical') {
	// 			if (!isNil(divider.general.width)) {
	// 				divider.general.height = divider.general.width;
	// 				divider.general.width = '';
	// 			}
	// 			if (!isNil(divider.general['border-top-width'])) {
	// 				divider.general['border-right-width'] =
	// 					divider.general['border-top-width'];
	// 				divider.general['border-top-width'] = '';
	// 			}
	// 		} else {
	// 			if (!isNil(divider.general.height)) {
	// 				divider.general.width = divider.general.height;
	// 				divider.general.height = '';
	// 			}
	// 			if (!isNil(divider.general['border-top-width'])) {
	// 				divider.general['border-top-width'] =
	// 					divider.general['border-right-width'];
	// 				divider.general['border-right-width'] = '';
	// 			}
	// 		}

	// 		onChange(divider);
	// 	}
	// }, [lineOrientation, orientation, divider, onChange]);

	return (
		<Fragment>
			<DefaultStylesControl
				items={[
					{
						activeItem: props['border-style'] === 'none',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChange(dividerNone),
					},
					{
						activeItem: props['border-style'] === 'solid',
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
						activeItem: props['border-style'] === 'dashed',
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
						activeItem: props['border-style'] === 'dotted',
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
					color={props['border-color']}
					defaultColor={getDefaultAttribute('border-color')}
					onChange={val => onChange({ 'border-color': val })}
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
					value={props['border-style']}
					onChange={val => onChange({ 'border-style': val })}
				/>
			)}
			{!disableBorderRadius && props['border-style'] === 'solid' && (
				<FancyRadioControl
					label={__('Line Radius', 'maxi-blocks')}
					selected={props['border-radius']}
					options={[
						{ label: __('No', 'maxi-blocks'), value: '' },
						{ label: __('Yes', 'maxi-blocks'), value: '20px' },
					]}
					onChange={val => onChange({ 'border-radius': val })}
				/>
			)}
			{orientation === 'horizontal' && (
				<Fragment>
					<SizeControl
						label={__('Line Size', 'maxi-blocks')}
						unit={props['width-unit']}
						defaultUnit={getDefaultAttribute('width-unit')}
						onChange={val => onChange({ 'width-unit': val })}
						value={props['width']}
						defaultValue={getDefaultAttribute('width')}
						onChangeValue={val => onChange({ width: val })}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Line Weight', 'maxi-blocks')}
						allowedUnits={['px', 'em', 'vw']}
						unit={props['border-top-unit']}
						defaultUnit={getDefaultAttribute('border-top-unit')}
						onChange={val => onChange({ 'border-top-unit': val })}
						value={props['border-top-width']}
						defaultValue={getDefaultAttribute('border-top-width')}
						onChangeValue={val =>
							onChange({ 'border-top-width': val })
						}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
			{orientation === 'vertical' && (
				<Fragment>
					<RangeControl
						label={__('Size', 'maxi-blocks')}
						value={props['height']}
						onChange={val => {
							const value = isNil(val)
								? getDefaultAttribute('height')
								: val;

							onChange({ height: value });
						}}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute('height')}
					/>
					<RangeControl
						label={__('Weight', 'maxi-blocks')}
						value={props['border-right-width']}
						onChange={val => {
							const value = isNil(val)
								? getDefaultAttribute('border-right-width')
								: val;

							onChange({ 'border-right-width': value });
						}}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							'border-right-width'
						)}
					/>
				</Fragment>
			)}
			{/* <OpacityControl
				opacity={divider.opacity}
				defaultOpacity={defaultDivider.opacity}
				onChange={val => {
					divider.opacity = val;
					onChange(divider);
				}}
			/> */}
		</Fragment>
	);
};

export default DividerControl;
