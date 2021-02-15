/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import {
	ColorControl,
	DefaultStylesControl,
	FancyRadioControl,
	RangeSliderControl,
	SizeControl,
} from '../../components';
import { getDefaultAttribute } from '../../extensions/styles';
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

	return (
		<Fragment>
			<DefaultStylesControl
				items={[
					{
						activeItem: props['divider-border-style'] === 'none',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChange(dividerNone),
					},
					{
						activeItem: props['divider-border-style'] === 'solid',
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
						activeItem: props['divider-border-style'] === 'dashed',
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
						activeItem: props['divider-border-style'] === 'dotted',
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
					color={props['divider-border-color']}
					defaultColor={getDefaultAttribute('border-color')}
					onChange={val => onChange({ 'divider-border-color': val })}
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
					value={props['divider-border-style']}
					onChange={val => onChange({ 'divider-border-style': val })}
				/>
			)}
			{!disableBorderRadius && props['divider-border-style'] === 'solid' && (
				<FancyRadioControl
					label={__('Line Radius', 'maxi-blocks')}
					selected={props['divider-border-radius']}
					options={[
						{ label: __('No', 'maxi-blocks'), value: '' },
						{ label: __('Yes', 'maxi-blocks'), value: '20px' },
					]}
					onChange={val => onChange({ 'divider-border-radius': val })}
				/>
			)}
			{lineOrientation === 'horizontal' && (
				<Fragment>
					<SizeControl
						label={__('Line Size', 'maxi-blocks')}
						unit={props['divider-width-unit']}
						defaultUnit={getDefaultAttribute('width-unit')}
						onChange={val =>
							onChange({ 'divider-width-unit': val })
						}
						value={props['divider-width']}
						defaultValue={getDefaultAttribute('width')}
						onChangeValue={val =>
							onChange({ 'divider-width': val })
						}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Line Weight', 'maxi-blocks')}
						allowedUnits={['px', 'em', 'vw']}
						unit={props['divider-border-top-unit']}
						defaultUnit={getDefaultAttribute('border-top-unit')}
						onChange={val =>
							onChange({ 'divider-border-top-unit': val })
						}
						value={props['divider-border-top-width']}
						defaultValue={getDefaultAttribute('border-top-width')}
						onChangeValue={val =>
							onChange({ 'divider-border-top-width': val })
						}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
			{lineOrientation === 'vertical' && (
				<Fragment>
					<RangeSliderControl
						label={__('Size', 'maxi-blocks')}
						defaultValue={getDefaultAttribute('height')}
						value={props['divider-height']}
						onChange={val => {
							onChange({ 'divider-height': val });
						}}
						min={0}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute('height')}
					/>
					<RangeSliderControl
						label={__('Weight', 'maxi-blocks')}
						defaultValue={getDefaultAttribute('border-right-width')}
						value={props['divider-border-right-width']}
						onChange={val => {
							onChange({ 'divider-border-right-width': val });
						}}
						min={0}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							'border-right-width'
						)}
					/>
				</Fragment>
			)}
		</Fragment>
	);
};

export default DividerControl;
