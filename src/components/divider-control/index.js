/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import FancyRadioControl from '../fancy-radio-control';
import Icon from '../icon';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import {
	dividerDashedHorizontal,
	dividerDashedVertical,
	dividerDottedHorizontal,
	dividerDottedVertical,
	dividerNone,
	dividerSolidHorizontal,
	dividerSolidVertical,
} from './defaults';

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
		isHover = false,
		clientId,
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
		<>
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
			{props['divider-border-style'] !== 'none' && !disableColor && (
				<ColorControl
					label={__('Color', 'maxi-blocks')}
					color={props['divider-border-color']}
					defaultColor={getDefaultAttribute('border-color')}
					onChange={val => onChange({ 'divider-border-color': val })}
					disableGradient
					showPalette
					palette={{ ...getGroupAttributes(props, 'palette') }}
					isHover={isHover}
					colorPaletteType='divider'
					onChangePalette={val => onChange(val)}
					clientId={clientId}
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
			{props['divider-border-style'] !== 'none' &&
				!disableBorderRadius &&
				props['divider-border-style'] === 'solid' && (
					<FancyRadioControl
						label={__('Line Radius', 'maxi-blocks')}
						selected={props['divider-border-radius']}
						options={[
							{
								label: __('Yes', 'maxi-blocks'),
								value: 1,
							},
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val =>
							onChange({ 'divider-border-radius': val })
						}
					/>
				)}
			{props['divider-border-style'] !== 'none' &&
				lineOrientation === 'horizontal' && (
					<>
						<AdvancedNumberControl
							label={__('Line Size', 'maxi-blocks')}
							unit={props['divider-width-unit']}
							onChangeUnit={val =>
								onChange({ 'divider-width-unit': val })
							}
							value={props['divider-width']}
							onChangeValue={val =>
								onChange({ 'divider-width': val })
							}
							onReset={() =>
								onChange({
									'divider-width':
										getDefaultAttribute('divider-width'),
									'divider-width-unit':
										getDefaultAttribute(
											'divider-width-unit'
										),
								})
							}
							minMaxSettings={minMaxSettings}
						/>
						<AdvancedNumberControl
							label={__('Line Weight', 'maxi-blocks')}
							allowedUnits={['px', 'em', 'vw']}
							unit={props['divider-border-top-unit']}
							onChangeUnit={val =>
								onChange({ 'divider-border-top-unit': val })
							}
							onChange={val =>
								onChange({ 'divider-border-top-width': val })
							}
							value={props['divider-border-top-width']}
							onChangeValue={val =>
								onChange({ 'divider-border-top-width': val })
							}
							onReset={() =>
								onChange({
									'divider-border-top-width':
										getDefaultAttribute(
											'divider-border-top-width'
										),
									'divider-border-top-unit':
										getDefaultAttribute(
											'divider-border-top-unit'
										),
								})
							}
							minMaxSettings={minMaxSettings}
						/>
					</>
				)}
			{props['divider-border-style'] !== 'none' &&
				lineOrientation === 'vertical' && (
					<>
						<AdvancedNumberControl
							label={__('Size', 'maxi-blocks')}
							placeholder=''
							value={
								props['divider-height'] !== undefined &&
								props['divider-height'] !== ''
									? props['divider-height']
									: ''
							}
							onChangeValue={val => {
								onChange({
									'divider-height':
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									'divider-height':
										getDefaultAttribute('divider-height'),
								})
							}
							initialPosition={getDefaultAttribute(
								'divider-height'
							)}
						/>
						<AdvancedNumberControl
							label={__('Weight', 'maxi-blocks')}
							placeholder=''
							value={props['divider-border-right-width']}
							onChangeValue={val => {
								onChange({
									'divider-border-right-width':
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									'divider-border-right-width':
										getDefaultAttribute(
											'divider-border-right-width'
										),
								})
							}
							initialPosition={getDefaultAttribute(
								'divider-border-right-width'
							)}
						/>
					</>
				)}
		</>
	);
};

export default DividerControl;
