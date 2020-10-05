/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RadioControl, Dropdown } = wp.components;
const { Fragment, useState } = wp.element;

/**
 * Internal dependencies
 */
import __experimentalOpacityControl from '../opacity-control';
import BackgroundControl from '../background-control';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

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
	const { shapeDividerOptions, defaultShapeDividerOptions, onChange } = props;

	const value = !isObject(shapeDividerOptions)
		? JSON.parse(shapeDividerOptions)
		: shapeDividerOptions;

	let {
		top: shapeDividerTopOptions,
		bottom: shapeDividerBottomOptions,
	} = value;

	const defaultValue = !isObject(defaultShapeDividerOptions)
		? JSON.parse(defaultShapeDividerOptions)
		: defaultShapeDividerOptions;

	const {
		top: defaultShapeDividerTopOptions,
		bottom: defaultShapeDividerBottomOptions,
	} = defaultValue;

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
				? shapeDividerTopOptions.shapeStyle
				: shapeDividerBottomOptions.shapeStyle
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
			<div className='maxi-fancy-radio-control'>
				<RadioControl
					label=''
					selected={shapeDividerStatus}
					options={[
						{ label: __('Top', 'maxi-blocks'), value: 'top' },
						{ label: __('Bottom', 'maxi-blocks'), value: 'bottom' },
					]}
					onChange={value => setShapeDividerStatus(value)}
				/>
			</div>
			{shapeDividerStatus === 'top' && (
				<Fragment>
					<div className='maxi-fancy-radio-control'>
						<RadioControl
							label={__(
								'Enable Top Shape Divider',
								'maxi-blocks'
							)}
							selected={shapeDividerTopOptions.status}
							options={[
								{ label: __('No', 'maxi-blocks'), value: 0 },
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
							]}
							onChange={val => {
								shapeDividerTopOptions.status = Number(val);
								onChange(JSON.stringify(value));
							}}
						/>
					</div>
					{!!shapeDividerTopOptions.status && (
						<Fragment>
							<div className='maxi-fancy-radio-control'>
								<RadioControl
									label={__(
										'Enable Scroll Effect',
										'maxi-blocks'
									)}
									selected={parseInt(
										shapeDividerTopOptions.effects.status
									)}
									options={[
										{
											label: __('No', 'maxi-blocks'),
											value: 0,
										},
										{
											label: __('Yes', 'maxi-blocks'),
											value: 1,
										},
									]}
									onChange={val => {
										shapeDividerTopOptions.effects.status = val;
										onChange(JSON.stringify(value));
									}}
								/>
							</div>
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
											shapeDividerTopOptions.shapeStyle
										}
										options={shapeItems}
										onChange={val => {
											shapeDividerTopOptions.shapeStyle = val;
											onChange(JSON.stringify(value));
										}}
									/>
								)}
							/>
							<__experimentalOpacityControl
								opacity={shapeDividerTopOptions.opacity}
								defaultOpacity={
									defaultShapeDividerTopOptions.opacity
								}
								onChange={val => {
									shapeDividerTopOptions.opacity = JSON.parse(
										val
									);
									onChange(JSON.stringify(value));
								}}
							/>
							<BackgroundControl
								background={shapeDividerTopOptions}
								defaultBackground={
									defaultShapeDividerTopOptions
								}
								onChange={val => {
									shapeDividerTopOptions = val;
									onChange(JSON.stringify(value));
								}}
								disableImage
								disableGradient
								disableVideo
								disableClipPath
							/>
							<SizeControl
								label={__('Divider Height', 'maxi-blocks')}
								unit={shapeDividerTopOptions.heightUnit}
								defaultUnit={
									defaultShapeDividerTopOptions.heightUnit
								}
								allowedUnits={['px']}
								onChangeUnit={val => {
									shapeDividerTopOptions.heightUnit = val;
									onChange(JSON.stringify(value));
								}}
								value={shapeDividerTopOptions.height}
								defaultValue={
									defaultShapeDividerTopOptions.height
								}
								onChangeValue={val => {
									shapeDividerTopOptions.height = val;
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
				</Fragment>
			)}
			{shapeDividerStatus === 'bottom' && (
				<Fragment>
					<div className='maxi-fancy-radio-control'>
						<RadioControl
							label={__(
								'Enable Bottom Shape Divider',
								'maxi-blocks'
							)}
							selected={shapeDividerBottomOptions.status}
							options={[
								{ label: __('No', 'maxi-blocks'), value: 0 },
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
							]}
							onChange={val => {
								shapeDividerBottomOptions.status = Number(val);
								onChange(JSON.stringify(value));
							}}
						/>
					</div>
					{!!shapeDividerBottomOptions.status && (
						<Fragment>
							<div className='maxi-fancy-radio-control'>
								<RadioControl
									label={__(
										'Enable Scroll Effect',
										'maxi-blocks'
									)}
									selected={parseInt(
										shapeDividerBottomOptions.effects.status
									)}
									options={[
										{
											label: __('No', 'maxi-blocks'),
											value: 0,
										},
										{
											label: __('Yes', 'maxi-blocks'),
											value: 1,
										},
									]}
									onChange={val => {
										shapeDividerBottomOptions.effects.status = val;
										onChange(JSON.stringify(value));
									}}
								/>
							</div>
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
											shapeDividerBottomOptions.shapeStyle
										}
										options={shapeItems}
										onChange={val => {
											shapeDividerBottomOptions.shapeStyle = val;
											onChange(JSON.stringify(value));
										}}
									/>
								)}
							/>
							<__experimentalOpacityControl
								opacity={shapeDividerBottomOptions.opacity}
								defaultOpacity={
									defaultShapeDividerBottomOptions.opacity
								}
								onChange={val => {
									shapeDividerBottomOptions.opacity = JSON.parse(
										val
									);
									onChange(JSON.stringify(value));
								}}
							/>
							<BackgroundControl
								background={shapeDividerBottomOptions}
								defaultBackground={
									defaultShapeDividerBottomOptions
								}
								onChange={val => {
									shapeDividerBottomOptions = val;
									onChange(JSON.stringify(value));
								}}
								disableImage
								disableVideo
								disableClipPath
							/>
							<SizeControl
								label={__('Divider Height', 'maxi-blocks')}
								unit={shapeDividerBottomOptions.heightUnit}
								defaultUnit={
									defaultShapeDividerBottomOptions.heightUnit
								}
								allowedUnits={['px']}
								onChangeUnit={val => {
									shapeDividerBottomOptions.heightUnit = val;
									onChange(JSON.stringify(value));
								}}
								value={shapeDividerBottomOptions.height}
								defaultValue={
									defaultShapeDividerBottomOptions.height
								}
								onChangeValue={val => {
									shapeDividerBottomOptions.height = val;
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default ShapeDividerControl;
