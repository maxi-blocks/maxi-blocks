/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import SizeControl from '../size-control';
import FancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FullSizeControl = props => {
	const { onChange, className, breakpoint, hideWidth, hideMaxWidth } = props;
	const size = { ...props.size };
	const defaultSize = { ...props.defaultSize };
	const classes = classnames('maxi-full-size-control', className);

	const onChangeValue = (target, val) => {
		if (Array.isArray(target)) {
			target.forEach(el => {
				size[breakpoint][el] = (!isNil(val) && val) || '';
			});
		} else {
			size[breakpoint][target] = (!isNil(val) && val) || '';
		}
		onChange(size);
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
					unit={getLastBreakpointValue(size, 'widthUnit', breakpoint)}
					defaultUnit={defaultSize[breakpoint].widthUnit}
					onChangeUnit={val => onChangeValue('widthUnit', val)}
					value={getLastBreakpointValue(size, 'width', breakpoint)}
					defaultValue={defaultSize[breakpoint].width}
					onChangeValue={val => onChangeValue('width', val)}
					minMaxSettings={minMaxSettings}
				/>
			)}

			<SizeControl
				label={__('Height', 'maxi-blocks')}
				unit={getLastBreakpointValue(size, 'heightUnit', breakpoint)}
				defaultUnit={defaultSize[breakpoint].heightUnit}
				onChangeUnit={val => onChangeValue('heightUnit', val)}
				value={getLastBreakpointValue(size, 'height', breakpoint)}
				defaultValue={defaultSize[breakpoint].heigh}
				onChangeValue={val => onChangeValue('height', val)}
				minMaxSettings={minMaxSettings}
			/>

			<FancyRadioControl
				label={__('Advanced Width/Height', 'maxi-blocks')}
				selected={size.advancedOptions}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					size.advancedOptions = Number(val);
					onChange(size);
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
			{!!size.advancedOptions && (
				<Fragment>
					{!hideMaxWidth && (
						<SizeControl
							label={__('Max Width', 'maxi-blocks')}
							unit={getLastBreakpointValue(
								size,
								'max-widthUnit',
								breakpoint
							)}
							defaultUnit={
								defaultSize[breakpoint]['max-widthUnit']
							}
							onChangeUnit={val =>
								onChangeValue('max-widthUnit', val)
							}
							value={getLastBreakpointValue(
								size,
								'max-width',
								breakpoint
							)}
							defaultValue={defaultSize[breakpoint]['max-width']}
							onChangeValue={val =>
								onChangeValue('max-width', val)
							}
							minMaxSettings={minMaxSettings}
						/>
					)}

					<SizeControl
						label={__('Min Width', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							size,
							'min-widthUnit',
							breakpoint
						)}
						defaultUnit={defaultSize[breakpoint]['min-widthUnit']}
						onChangeUnit={val =>
							onChangeValue('min-widthUnit', val)
						}
						value={getLastBreakpointValue(
							size,
							'min-width',
							breakpoint
						)}
						defaultValue={defaultSize[breakpoint]['min-width']}
						onChangeValue={val => onChangeValue('min-width', val)}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Max Height', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							size,
							'max-heightUnit',
							breakpoint
						)}
						defaultUnit={defaultSize[breakpoint]['max-heightUnit']}
						onChangeUnit={val =>
							onChangeValue('max-heightUnit', val)
						}
						value={getLastBreakpointValue(
							size,
							'max-height',
							breakpoint
						)}
						defaultValue={defaultSize[breakpoint]['max-height']}
						onChangeValue={val => onChangeValue('max-height', val)}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Min Height', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							size,
							'min-heightUnit',
							breakpoint
						)}
						defaultUnit={defaultSize[breakpoint]['min-heightUnit']}
						onChangeUnit={val =>
							onChangeValue('min-heightUnit', val)
						}
						value={getLastBreakpointValue(
							size,
							'min-height',
							breakpoint
						)}
						defaultValue={defaultSize[breakpoint]['min-height']}
						onChangeValue={val => onChangeValue('min-height', val)}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default FullSizeControl;
