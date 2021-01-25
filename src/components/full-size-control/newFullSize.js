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
	const {
		onChange,
		className,
		breakpoint,
		hideWidth,
		hideMaxWidth,
		prefix,
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
						`${prefix ? prefix : ''}width-unit`,
						breakpoint,
						props
					)}
					defaultUnit={getDefaultAttribute(
						`${prefix ? prefix : ''}width-unit-${breakpoint}`
					)}
					onChangeUnit={val =>
						onChangeValue(`${prefix ? prefix : ''}width-unit`, val)
					}
					value={getLastBreakpointAttribute(
						`${prefix ? prefix : ''}width`,
						breakpoint,
						props
					)}
					defaultValue={getDefaultAttribute(
						`${prefix ? prefix : ''}width-${breakpoint}`
					)}
					onChangeValue={val =>
						onChangeValue(`${prefix ? prefix : ''}width`, val)
					}
					minMaxSettings={minMaxSettings}
				/>
			)}
			<SizeControl
				label={__('Height', 'maxi-blocks')}
				unit={getLastBreakpointAttribute(
					`${prefix ? prefix : ''}height-unit`,
					breakpoint,
					props
				)}
				defaultUnit={getDefaultAttribute(
					`${prefix ? prefix : ''}height-unit-${breakpoint}`
				)}
				onChangeUnit={val =>
					onChangeValue([`${prefix ? prefix : ''}height-unit`], val)
				}
				value={getLastBreakpointAttribute(
					`${prefix ? prefix : ''}height`,
					breakpoint,
					props
				)}
				defaultValue={getDefaultAttribute(
					`${prefix ? prefix : ''}height-${breakpoint}`
				)}
				onChangeValue={val =>
					onChangeValue([`${prefix ? prefix : ''}height`], val)
				}
				minMaxSettings={minMaxSettings}
			/>
			<FancyRadioControl
				label={__('Advanced Width/Height', 'maxi-blocks')}
				selected={
					+props[`${prefix ? prefix : ''}size-advanced-options`]
				}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					onChange({
						[`${
							prefix ? prefix : ''
						}size-advanced-options`]: !!+val,
					});
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
			{props[`${prefix ? prefix : ''}size-advanced-options`] && (
				<Fragment>
					{!hideMaxWidth && (
						<SizeControl
							label={__('Max Width', 'maxi-blocks')}
							unit={getLastBreakpointAttribute(
								`${prefix ? prefix : ''}max-width-unit`,
								breakpoint,
								props
							)}
							defaultUnit={getDefaultAttribute(
								`${
									prefix ? prefix : ''
								}max-width-unit-${breakpoint}`
							)}
							onChangeUnit={val =>
								onChangeValue(
									`${prefix ? prefix : ''}max-width-unit`,
									val
								)
							}
							value={getLastBreakpointAttribute(
								`${prefix ? prefix : ''}max-width`,
								breakpoint,
								props
							)}
							defaultValue={getDefaultAttribute(
								`${prefix ? prefix : ''}max-width-${breakpoint}`
							)}
							onChangeValue={val =>
								onChangeValue(
									`${prefix ? prefix : ''}max-width`,
									val
								)
							}
							minMaxSettings={minMaxSettings}
						/>
					)}
					<SizeControl
						label={__('Min Width', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							`${prefix ? prefix : ''}min-width-unit`,
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`${
								prefix ? prefix : ''
							}min-width-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue(
								`${prefix ? prefix : ''}min-width-unit`,
								val
							)
						}
						value={getLastBreakpointAttribute(
							`${prefix ? prefix : ''}min-width`,
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`${prefix ? prefix : ''}min-width-${breakpoint}`
						)}
						onChangeValue={val =>
							onChangeValue(
								`${prefix ? prefix : ''}min-width`,
								val
							)
						}
						minMaxSettings={minMaxSettings}
					/>
					<SizeControl
						label={__('Max Height', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							`${prefix ? prefix : ''}max-height-unit`,
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`${
								prefix ? prefix : ''
							}max-height-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue(
								`${prefix ? prefix : ''}max-height-unit`,
								val
							)
						}
						value={getLastBreakpointAttribute(
							`${prefix ? prefix : ''}max-height`,
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`${prefix ? prefix : ''}max-height-${breakpoint}`
						)}
						onChangeValue={val =>
							onChangeValue(
								`${prefix ? prefix : ''}max-height`,
								val
							)
						}
						minMaxSettings={minMaxSettings}
					/>
					<SizeControl
						label={__('Min Height', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							`${prefix ? prefix : ''}min-height-unit`,
							breakpoint,
							props
						)}
						defaultUnit={getDefaultAttribute(
							`${
								prefix ? prefix : ''
							}min-height-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChangeValue(
								`${prefix ? prefix : ''}min-height-unit`,
								val
							)
						}
						value={getLastBreakpointAttribute(
							`${prefix ? prefix : ''}min-height`,
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`${prefix ? prefix : ''}min-height-${breakpoint}`
						)}
						onChangeValue={val =>
							onChangeValue(
								`${prefix ? prefix : ''}min-height`,
								val
							)
						}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default FullSizeControl;
