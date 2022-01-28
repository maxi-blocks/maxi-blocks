/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
// import ColorControl from '../../../color-control';
import DefaultStylesControl from '../../../default-styles-control';
// import ToggleSwitch from '../../../toggle-switch';
import Icon from '../../../icon';
import AdvancedNumberControl from '../../../advanced-number-control';
import { getDefaultAttribute } from '../../../../extensions/styles';
import {
	dividerDashedHorizontal,
	dividerDashedVertical,
	dividerDottedHorizontal,
	dividerDottedVertical,
	dividerNone,
	dividerSolidHorizontal,
	dividerSolidVertical,
} from '../../../divider-control/defaults';

/**
 * Icons
 */
import {
	styleNone,
	dashed,
	dotted,
	solid,
	borderWidth,
} from '../../../../icons';

/**
 * Component
 */
const ToolbarDividerControl = props => {
	const {
		onChange,
		lineOrientation,
		// disableColor = false,
		disableLineStyle = false,
		// disableBorderRadius = false,
		// isHover = false,
		// clientId,
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
			{lineOrientation === 'horizontal' && (
				<>
					<div className='divider-border__weight-wrap'>
						<div
							className={
								props['divider-border-style'] === 'none' &&
								'divider-border__weight-disable'
							}
						>
							{disableLineStyle && <Icon icon={borderWidth} />}
							<AdvancedNumberControl
								label={__('', 'maxi-blocks')}
								unit={props['divider-border-top-unit']}
								onChange={val =>
									onChange({
										'divider-border-top-width': val,
									})
								}
								value={props['divider-border-top-width']}
								onChangeValue={val =>
									onChange({
										'divider-border-top-width': val,
									})
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
						</div>
					</div>
					<AdvancedNumberControl
						className={
							props['divider-border-style'] === 'none' &&
							'divider-border__size-disable'
						}
						label={__('Line size', 'maxi-blocks')}
						value={props['divider-width']}
						onChangeValue={val =>
							onChange({ 'divider-width': val })
						}
						onReset={() =>
							onChange({
								'divider-width':
									getDefaultAttribute('divider-width'),
								'divider-width-unit':
									getDefaultAttribute('divider-width-unit'),
							})
						}
						minMaxSettings={minMaxSettings}
					/>
				</>
			)}
			{lineOrientation === 'vertical' && (
				<>
					<div className='divider-border__weight-wrap'>
						<div
							className={
								props['divider-border-style'] === 'none' &&
								'divider-border__weight-disable'
							}
						>
							{disableLineStyle && <Icon icon={borderWidth} />}
							<AdvancedNumberControl
								label={__('', 'maxi-blocks')}
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
						</div>
					</div>
					<AdvancedNumberControl
						className={
							props['divider-border-style'] === 'none' &&
							'divider-border__size-disable'
						}
						label={__('Size', 'maxi-blocks')}
						value={
							props['divider-height'] !== undefined &&
							props['divider-height'] !== ''
								? props['divider-height']
								: ''
						}
						onChangeValue={val => {
							onChange({
								'divider-height':
									val !== undefined && val !== '' ? val : '',
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
						initialPosition={getDefaultAttribute('divider-height')}
					/>
				</>
			)}
		</>
	);
};

export default ToolbarDividerControl;
