/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import FancyRadioControl from '../fancy-radio-control';

import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointValue';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

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
	const { onChange, className, breakpoint, hideWidth } = props;

	const classes = classnames('maxi-full-size-control', className);

	const onChangeValue = (target, val) => {
		const response = {};

		if (Array.isArray(target)) {
			target.forEach(el => {
				response[`${el}-${breakpoint}`] = (!isNil(val) && val) || '';
			});
		} else {
			response[`${target}-${breakpoint}`] = (!isNil(val) && val) || '';
		}
		onChange(response);
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
					unit={getLastBreakpointAttribute(
						'width-unit',
						breakpoint,
						props
					)}
					defaultUnit={getDefaultAttribute(
						`width-unit-${breakpoint}`
					)}
					onChangeUnit={val => onChangeValue('width-unit', val)}
					value={getLastBreakpointAttribute(
						'width',
						breakpoint,
						props
					)}
					defaultValue={getDefaultAttribute(`width-${breakpoint}`)}
					onChangeValue={val => onChangeValue('width', val)}
					minMaxSettings={minMaxSettings}
				/>
			)}
			<SizeControl
				label={__('Height', 'maxi-blocks')}
				unit={getLastBreakpointAttribute(
					'height-unit',
					breakpoint,
					props
				)}
				defaultUnit={getDefaultAttribute(`height-unit-${breakpoint}`)}
				onChangeUnit={val => onChangeValue('height-unit', val)}
				value={getLastBreakpointAttribute('height', breakpoint, props)}
				defaultValue={getDefaultAttribute(`height-${breakpoint}`)}
				onChangeValue={val => onChangeValue('height', val)}
				minMaxSettings={minMaxSettings}
			/>
			<FancyRadioControl
				label={__('Advanced Width/Height', 'maxi-blocks')}
				selected={+props['size-advanced-options']}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					onChange({ 'size-advanced-options': !!val });
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
								'min-width-unit',
								'max-width-unit',
								'min-height-unit',
								'max-height-unit',
							],
							'px'
						);
					}
				}}
			/>
			{props['size-advanced-options'] && (
				<Fragment>
					<SizeControl
						label={__('Max Width', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							'max-width-unit',
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`max-width-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue('max-width-unit', val)
						}
						value={getLastBreakpointAttribute(
							'max-width',
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`max-width-${breakpoint}`
						)}
						onChangeValue={val => onChangeValue('max-width', val)}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Min Width', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							'min-width-unit',
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`min-width-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue('min-width-unit', val)
						}
						value={getLastBreakpointAttribute(
							'min-width',
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`min-width-${breakpoint}`
						)}
						onChangeValue={val => onChangeValue('min-width', val)}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Max Height', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							'max-height-unit',
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`max-height-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue('max-height-unit', val)
						}
						value={getLastBreakpointAttribute(
							'max-height',
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`max-height-${breakpoint}`
						)}
						onChangeValue={val => onChangeValue('max-height', val)}
						minMaxSettings={minMaxSettings}
					/>

					<SizeControl
						label={__('Min Height', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							'min-height-unit',
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`min-height-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue('min-height-unit', val)
						}
						value={getLastBreakpointAttribute(
							'min-height',
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`min-height-${breakpoint}`
						)}
						onChangeValue={val => onChangeValue('min-height', val)}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default FullSizeControl;
