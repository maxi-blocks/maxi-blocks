/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import RadioControl from '../radio-control';
import OpacityControl from '../opacity-control';
import FancyRadioControl from '../fancy-radio-control';
import ToggleSwitch from '../toggle-switch';
import ColorControl from '../color-control';
import AdvancedNumberControl from '../advanced-number-control';
import Dropdown from '../dropdown';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	wavesTop,
	wavesBottom,
	wavesTopOpacity,
	wavesBottomOpacity,
	waveTop,
	waveBottom,
	waveTopOpacity,
	waveBottomOpacity,
	triangleTop,
	triangleBottom,
	swishTop,
	swishBottom,
	swishTopOpacity,
	swishBottomOpacity,
	slantTop,
	slantBottom,
	slantTopOpacity,
	slantBottomOpacity,
	peakTop,
	peakBottom,
	mountainsTop,
	mountainsBottom,
	mountainsTopOpacity,
	mountainsBottomOpacity,
	curveTop,
	curveBottom,
	curveTopOpacity,
	curveBottomOpacity,
	arrowTop,
	arrowBottom,
	arrowTopOpacity,
	arrowBottomOpacity,
	asymmetricTop,
	asymmetricBottom,
	asymmetricTopOpacity,
	asymmetricBottomOpacity,
	cloudTop,
	cloudBottom,
	cloudTopOpacity,
	cloudBottomOpacity,
} from '../../icons';

/**
 * Component
 */
const ShapeDividerControl = props => {
	const { onChange } = props;

	const shapeItems = [
		{ label: __('None', 'max-block'), value: '' },
		{ label: wavesTop, value: 'waves-top' },
		{ label: wavesBottom, value: 'waves-bottom' },
		{ label: wavesTopOpacity, value: 'waves-top-opacity' },
		{ label: wavesBottomOpacity, value: 'waves-bottom-opacity' },
		{ label: waveTop, value: 'wave-top' },
		{ label: waveBottom, value: 'wave-bottom' },
		{ label: waveTopOpacity, value: 'wave-top-opacity' },
		{ label: waveBottomOpacity, value: 'wave-bottom-opacity' },
		{ label: triangleTop, value: 'triangle-top' },
		{ label: triangleBottom, value: 'triangle-bottom' },
		{ label: swishTop, value: 'swish-top' },
		{ label: swishBottom, value: 'swish-bottom' },
		{ label: swishTopOpacity, value: 'swish-top-opacity' },
		{ label: swishBottomOpacity, value: 'swish-bottom-opacity' },
		{ label: slantTop, value: 'slant-top' },
		{ label: slantBottom, value: 'slant-bottom' },
		{ label: slantTopOpacity, value: 'slant-top-opacity' },
		{ label: slantBottomOpacity, value: 'slant-bottom-opacity' },
		{ label: peakTop, value: 'peak-top' },
		{ label: peakBottom, value: 'peak-bottom' },
		{ label: mountainsTop, value: 'mountains-top' },
		{ label: mountainsBottom, value: 'mountains-bottom' },
		{ label: mountainsTopOpacity, value: 'mountains-top-opacity' },
		{ label: mountainsBottomOpacity, value: 'mountains-bottom-opacity' },
		{ label: curveTop, value: 'curve-top' },
		{ label: curveBottom, value: 'curve-bottom' },
		{ label: curveTopOpacity, value: 'curve-top-opacity' },
		{ label: curveBottomOpacity, value: 'curve-bottom-opacity' },
		{ label: arrowTop, value: 'arrow-top' },
		{ label: arrowBottom, value: 'arrow-bottom' },
		{ label: arrowTopOpacity, value: 'arrow-top-opacity' },
		{ label: arrowBottomOpacity, value: 'arrow-bottom-opacity' },
		{ label: asymmetricTop, value: 'asymmetric-top' },
		{ label: asymmetricBottom, value: 'asymmetric-bottom' },
		{ label: asymmetricTopOpacity, value: 'asymmetric-top-opacity' },
		{ label: asymmetricBottomOpacity, value: 'asymmetric-bottom-opacity' },
		{ label: cloudTop, value: 'cloud-top' },
		{ label: cloudBottom, value: 'cloud-bottom' },
		{ label: cloudTopOpacity, value: 'cloud-top-opacity' },
		{ label: cloudBottomOpacity, value: 'cloud-bottom-opacity' },
	];

	const showShapes = position => {
		switch (
			position === 'top'
				? props['shape-divider-top-shape-style']
				: props['shape-divider-bottom-shape-style']
		) {
			case 'waves-top':
				return wavesTop;
			case 'waves-bottom':
				return wavesBottom;
			case 'waves-top-opacity':
				return wavesTopOpacity;
			case 'waves-bottom-opacity':
				return wavesBottomOpacity;
			case 'wave-top':
				return waveTop;
			case 'wave-bottom':
				return waveBottom;
			case 'wave-top-opacity':
				return waveTopOpacity;
			case 'wave-bottom-opacity':
				return waveBottomOpacity;
			case 'triangle-top':
				return triangleTop;
			case 'triangle-bottom':
				return triangleBottom;
			case 'swish-top':
				return swishTop;
			case 'swish-bottom':
				return swishBottom;
			case 'swish-top-opacity':
				return swishTopOpacity;
			case 'swish-bottom-opacity':
				return swishBottomOpacity;
			case 'slant-top':
				return slantTop;
			case 'slant-bottom':
				return slantBottom;
			case 'slant-top-opacity':
				return slantTopOpacity;
			case 'slant-bottom-opacity':
				return slantBottomOpacity;
			case 'peak-top':
				return peakTop;
			case 'peak-bottom':
				return peakBottom;
			case 'mountains-top':
				return mountainsTop;
			case 'mountains-bottom':
				return mountainsBottom;
			case 'mountains-top-opacity':
				return mountainsTopOpacity;
			case 'mountains-bottom-opacity':
				return mountainsBottomOpacity;
			case 'curve-top':
				return curveTop;
			case 'curve-bottom':
				return curveBottom;
			case 'curve-top-opacity':
				return curveTopOpacity;
			case 'curve-bottom-opacity':
				return curveBottomOpacity;
			case 'arrow-top':
				return arrowTop;
			case 'arrow-bottom':
				return arrowBottom;
			case 'arrow-top-opacity':
				return arrowTopOpacity;
			case 'arrow-bottom-opacity':
				return arrowBottomOpacity;
			case 'asymmetric-top':
				return asymmetricTop;
			case 'asymmetric-bottom':
				return asymmetricBottom;
			case 'asymmetric-top-opacity':
				return asymmetricTopOpacity;
			case 'asymmetric-bottom-opacity':
				return asymmetricBottomOpacity;
			case 'cloud-top':
				return cloudTop;
			case 'cloud-bottom':
				return cloudBottom;
			case 'cloud-top-opacity':
				return cloudTopOpacity;
			case 'cloud-bottom-opacity':
				return cloudBottomOpacity;
			default:
				return __('Divider Style', 'max-block');
		}
	};

	const [shapeDividerStatus, setShapeDividerStatus] = useState('top');

	return (
		<div className='maxi-shapedividercontrol'>
			<FancyRadioControl
				label=''
				selected={shapeDividerStatus}
				options={[
					{ label: __('Top', 'maxi-blocks'), value: 'top' },
					{ label: __('Bottom', 'maxi-blocks'), value: 'bottom' },
				]}
				optionType='string'
				onChange={val => setShapeDividerStatus(val)}
			/>
			{shapeDividerStatus === 'top' && (
				<>
					<ToggleSwitch
						label={__('Enable Top Shape Divider', 'maxi-blocks')}
						selected={props['shape-divider-top-status']}
						onChange={() =>
							onChange({
								'shape-divider-top-status':
									!props['shape-divider-top-status'],
							})
						}
					/>
					{!!props['shape-divider-top-status'] && (
						<>
							<ToggleSwitch
								label={__(
									'Enable Scroll Effect',
									'maxi-blocks'
								)}
								selected={
									props['shape-divider-top-effects-status']
								}
								onChange={() =>
									onChange({
										'shape-divider-top-effects-status':
											!props[
												'shape-divider-top-effects-status'
											],
									})
								}
							/>
							<Dropdown
								className='maxi-shapedividercontrol__shape-selector'
								contentClassName='maxi-shapedividercontrol_popover'
								position='bottom center'
								renderToggle={({ isOpen, onToggle }) => (
									<div
										className='maxi-shapedividercontrol__shape-selector__display'
										onClick={onToggle}
									>
										{showShapes('top')}
									</div>
								)}
								renderContent={() => (
									<RadioControl
										className='maxi-shapedividercontrol__shape-list'
										selected={
											props[
												'shape-divider-top-shape-style'
											]
										}
										options={shapeItems}
										onChange={shapeStyle =>
											onChange({
												'shape-divider-top-shape-style':
													shapeStyle,
											})
										}
									/>
								)}
							/>
							<OpacityControl
								opacity={props['shape-divider-top-opacity']}
								onChange={opacity =>
									onChange({
										'shape-divider-top-opacity': opacity,
									})
								}
							/>
							<ColorControl
								label={__('Shape Top', 'maxi-blocks')}
								color={props['shape-divider-top-color']}
								defaultColor={getDefaultAttribute(
									'shape-divider-top-color'
								)}
								paletteColor={
									props['shape-divider-palette-top-color']
								}
								paletteStatus={
									props[
										'shape-divider-palette-top-color-status'
									]
								}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
								}) =>
									onChange({
										'shape-divider-top-color': color,
										'shape-divider-palette-top-color':
											paletteColor,
										'shape-divider-palette-top-color-status':
											paletteStatus,
									})
								}
								disableOpacity
							/>
							<AdvancedNumberControl
								label={__('Divider Height', 'maxi-blocks')}
								enableUnit
								unit={props['shape-divider-top-height-unit']}
								allowedUnits={['px']}
								onChangeUnit={val =>
									onChange({
										'shape-divider-top-height-unit': val,
									})
								}
								value={props['shape-divider-top-height']}
								onChangeValue={val =>
									onChange({
										'shape-divider-top-height': val,
									})
								}
								onReset={() =>
									onChange({
										'shape-divider-top-height':
											getDefaultAttribute(
												'shape-divider-top-height'
											),
										'shape-divider-top-height-unit':
											getDefaultAttribute(
												'shape-divider-top-height-unit'
											),
									})
								}
							/>
						</>
					)}
				</>
			)}
			{shapeDividerStatus === 'bottom' && (
				<>
					<ToggleSwitch
						label={__('Enable Bottom Shape Divider', 'maxi-blocks')}
						selected={props['shape-divider-bottom-status']}
						onChange={() =>
							onChange({
								'shape-divider-bottom-status':
									!props['shape-divider-bottom-status'],
							})
						}
					/>
					{!!props['shape-divider-bottom-status'] && (
						<>
							<ToggleSwitch
								label={__(
									'Enable Scroll Effect',
									'maxi-blocks'
								)}
								selected={
									props['shape-divider-bottom-effects-status']
								}
								onChange={() =>
									onChange({
										'shape-divider-bottom-effects-status':
											!props[
												'shape-divider-bottom-effects-status'
											],
									})
								}
							/>
							<Dropdown
								className='maxi-shapedividercontrol__shape-selector'
								contentClassName='maxi-shapedividercontrol_popover'
								position='bottom center'
								renderToggle={({ isOpen, onToggle }) => (
									<div
										className='maxi-shapedividercontrol__shape-selector__display'
										onClick={onToggle}
									>
										{showShapes('bottom')}
									</div>
								)}
								renderContent={() => (
									<RadioControl
										className='maxi-shapedividercontrol__shape-list'
										selected={
											props[
												'shape-divider-bottom-shape-style'
											]
										}
										options={shapeItems}
										onChange={shapeStyle =>
											onChange({
												'shape-divider-bottom-shape-style':
													shapeStyle,
											})
										}
									/>
								)}
							/>
							<OpacityControl
								opacity={props['shape-divider-bottom-opacity']}
								onChange={opacity =>
									onChange({
										'shape-divider-bottom-opacity': opacity,
									})
								}
							/>
							<ColorControl
								label={__('Shape Bottom', 'maxi-blocks')}
								color={props['shape-divider-bottom-color']}
								defaultColor={getDefaultAttribute(
									'shape-divider-bottom-color'
								)}
								paletteColor={
									props['shape-divider-palette-bottom-color']
								}
								paletteStatus={
									props[
										'shape-divider-palette-bottom-color-status'
									]
								}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
								}) =>
									onChange({
										'shape-divider-bottom-color': color,
										'shape-divider-palette-bottom-color':
											paletteColor,
										'shape-divider-palette-bottom-color-status':
											paletteStatus,
									})
								}
								disableOpacity
							/>
							<AdvancedNumberControl
								label={__('Divider Height', 'maxi-blocks')}
								enableUnit
								unit={props['shape-divider-bottom-height-unit']}
								allowedUnits={['px']}
								onChangeUnit={val =>
									onChange({
										'shape-divider-bottom-height-unit': val,
									})
								}
								value={props['shape-divider-bottom-height']}
								onChangeValue={val =>
									onChange({
										'shape-divider-bottom-height': val,
									})
								}
								onReset={() =>
									onChange({
										'shape-divider-bottom-height':
											getDefaultAttribute(
												'shape-divider-bottom-height'
											),
										'shape-divider-bottom-height-unit':
											getDefaultAttribute(
												'shape-divider-bottom-height-unit'
											),
									})
								}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default ShapeDividerControl;
