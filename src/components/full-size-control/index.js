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
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

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
	const {
		onChange,
		className,
		breakpoint,
		hideWidth,
		hideMaxWidth,
		prefix = '',
	} = props;

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
						`${prefix}width-unit`,
						breakpoint,
						props
					)}
					defaultUnit={getDefaultAttribute(
						`${prefix}width-unit-${breakpoint}`
					)}
					onChangeUnit={val =>
						onChangeValue(`${prefix}width-unit`, val)
					}
					value={getLastBreakpointAttribute(
						`${prefix}width`,
						breakpoint,
						props
					)}
					defaultValue={getDefaultAttribute(
						`${prefix}width-${breakpoint}`
					)}
					onChangeValue={val => onChangeValue(`${prefix}width`, val)}
					minMaxSettings={minMaxSettings}
				/>
			)}
			<SizeControl
				label={__('Height', 'maxi-blocks')}
				unit={getLastBreakpointAttribute(
					`${prefix}height-unit`,
					breakpoint,
					props
				)}
				defaultUnit={getDefaultAttribute(
					`${prefix}height-unit-${breakpoint}`
				)}
				onChangeUnit={val =>
					onChangeValue([`${prefix}height-unit`], val)
				}
				value={getLastBreakpointAttribute(
					`${prefix}height`,
					breakpoint,
					props
				)}
				defaultValue={getDefaultAttribute(
					`${prefix}height-${breakpoint}`
				)}
				onChangeValue={val => onChangeValue([`${prefix}height`], val)}
				minMaxSettings={minMaxSettings}
			/>
			<FancyRadioControl
				label={__('Advanced Width/Height', 'maxi-blocks')}
				selected={+props[`${prefix}size-advanced-options`]}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				attr={`${prefix}size-advanced-options`}
				onChange={obj => {
					onChange(obj);
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
			{props[`${prefix}size-advanced-options`] && (
				<Fragment>
					{!hideMaxWidth && (
						<SizeControl
							label={__('Max Width', 'maxi-blocks')}
							unit={getLastBreakpointAttribute(
								`${prefix}max-width-unit`,
								breakpoint,
								props
							)}
							defaultUnit={getDefaultAttribute(
								`${prefix}max-width-unit-${breakpoint}`
							)}
							onChangeUnit={val =>
								onChangeValue(`${prefix}max-width-unit`, val)
							}
							value={getLastBreakpointAttribute(
								`${prefix}max-width`,
								breakpoint,
								props
							)}
							defaultValue={getDefaultAttribute(
								`${prefix}max-width-${breakpoint}`
							)}
							onChangeValue={val =>
								onChangeValue(`${prefix}max-width`, val)
							}
							minMaxSettings={minMaxSettings}
						/>
					)}
					<SizeControl
						label={__('Min Width', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							`${prefix}min-width-unit`,
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`${prefix}min-width-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue(`${prefix}min-width-unit`, val)
						}
						value={getLastBreakpointAttribute(
							`${prefix}min-width`,
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`${prefix}min-width-${breakpoint}`
						)}
						onChangeValue={val =>
							onChangeValue(`${prefix}min-width`, val)
						}
						minMaxSettings={minMaxSettings}
					/>
					<SizeControl
						label={__('Max Height', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							`${prefix}max-height-unit`,
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`${prefix}max-height-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue(`${prefix}max-height-unit`, val)
						}
						value={getLastBreakpointAttribute(
							`${prefix}max-height`,
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`${prefix}max-height-${breakpoint}`
						)}
						onChangeValue={val =>
							onChangeValue(`${prefix}max-height`, val)
						}
						minMaxSettings={minMaxSettings}
					/>
					<SizeControl
						label={__('Min Height', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							`${prefix}min-height-unit`,
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`${prefix}min-height-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue(`${prefix}min-height-unit`, val)
						}
						value={getLastBreakpointAttribute(
							`${prefix}min-height`,
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`${prefix}min-height-${breakpoint}`
						)}
						onChangeValue={val =>
							onChangeValue(`${prefix}min-height`, val)
						}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default FullSizeControl;
