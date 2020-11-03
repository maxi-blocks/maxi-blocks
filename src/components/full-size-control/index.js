/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import SizeControl from '../size-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isNil } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FullSizeControl = props => {
	const {
		size,
		defaultSize,
		onChange,
		className,
		breakpoint,
		hideWidth,
	} = props;

	const value = isObject(size) ? size : JSON.parse(size);

	const defaultValue = isObject(defaultSize)
		? defaultSize
		: JSON.parse(defaultSize);

	const classes = classnames('maxi-full-size-control', className);

	const onChangeValue = (target, val) => {
		if (Array.isArray(target)) {
			target.forEach(el => {
				value[breakpoint][el] = (!isNil(val) && val) || '';
			});
		} else {
			value[breakpoint][target] = (!isNil(val) && val) || '';
		}
		onChange(JSON.stringify(value));
	};

	const minMaxSettings = {
		px: {
			min: 0,
			max: 3999,
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
	};

	return (
		<div className={classes}>
			{!hideWidth && (
				<SizeControl
					label={__('Width', 'maxi-blocks')}
					unit={getLastBreakpointValue(
						value,
						'widthUnit',
						breakpoint
					)}
					defaultUnit={defaultValue[breakpoint].widthUnit}
					onChangeUnit={val => onChangeValue('widthUnit', val)}
					value={getLastBreakpointValue(value, 'width', breakpoint)}
					defaultValue={defaultValue[breakpoint].width}
					onChangeValue={val => onChangeValue('width', val)}
					minMaxSettings={minMaxSettings}
				/>
			)}

			<SizeControl
				label={__('Height', 'maxi-blocks')}
				unit={getLastBreakpointValue(value, 'heightUnit', breakpoint)}
				defaultUnit={defaultValue[breakpoint].heightUnit}
				onChangeUnit={val => onChangeValue('heightUnit', val)}
				value={getLastBreakpointValue(value, 'height', breakpoint)}
				defaultValue={defaultValue[breakpoint].heigh}
				onChangeValue={val => onChangeValue('height', val)}
				minMaxSettings={minMaxSettings}
			/>

			<__experimentalFancyRadioControl
				label={__('Advanced Settings', 'maxi-blocks')}
				selected={value[breakpoint].advancedOptions}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					value[breakpoint].advancedOptions = Number(val);
					onChange(JSON.stringify(value));
					if (!Number(val)) {
						onChangeValue(
							[
								'min-width',
								'max-width',
								'min-height',
								'max-height',
							],
							''
						);

						onChangeValue(
							[
								'min-widthUnit',
								'max-widthUnit',
								'min-heightUnit',
								'max-heightUnit',
							],
							'px'
						);
					}
				}}
			/>
			{!!value[breakpoint].advancedOptions && (
				<Fragment>
					<SizeControl
						label={__('Max Width', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'max-widthUnit',
							breakpoint
						)}
						defaultUnit={defaultValue[breakpoint]['max-widthUnit']}
						onChangeUnit={val =>
							onChangeValue('max-widthUnit', val)
						}
						value={getLastBreakpointValue(
							value,
							'max-width',
							breakpoint
						)}
						defaultValue={defaultValue[breakpoint]['max-width']}
						onChangeValue={val => onChangeValue('max-width', val)}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Min Width', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'min-widthUnit',
							breakpoint
						)}
						defaultUnit={defaultValue[breakpoint]['min-widthUnit']}
						onChangeUnit={val =>
							onChangeValue('min-widthUnit', val)
						}
						value={getLastBreakpointValue(
							value,
							'min-width',
							breakpoint
						)}
						defaultValue={defaultValue[breakpoint]['min-width']}
						onChangeValue={val => onChangeValue('min-width', val)}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Max Height', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'max-heightUnit',
							breakpoint
						)}
						defaultUnit={defaultValue[breakpoint]['max-heightUnit']}
						onChangeUnit={val =>
							onChangeValue('max-heightUnit', val)
						}
						value={getLastBreakpointValue(
							value,
							'max-height',
							breakpoint
						)}
						defaultValue={defaultValue[breakpoint]['max-height']}
						onChangeValue={val => onChangeValue('max-height', val)}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Min Height', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'min-heightUnit',
							breakpoint
						)}
						defaultUnit={defaultValue[breakpoint]['min-heightUnit']}
						onChangeUnit={val =>
							onChangeValue('min-heightUnit', val)
						}
						value={getLastBreakpointValue(
							value,
							'min-height',
							breakpoint
						)}
						defaultValue={defaultValue[breakpoint]['min-height']}
						onChangeValue={val => onChangeValue('min-height', val)}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default FullSizeControl;
