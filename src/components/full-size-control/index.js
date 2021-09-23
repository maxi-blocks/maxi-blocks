/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';
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

	const currentBlockRoot = select('core/block-editor').getBlockRootClientId(
		select('core/block-editor').getSelectedBlockClientId()
	);

	return (
		<div className={classes}>
			{!hideWidth && currentBlockRoot && (
				<AdvancedNumberControl
					label={__('Width', 'maxi-blocks')}
					enableUnit
					unit={getLastBreakpointAttribute(
						`${prefix}width-unit`,
						breakpoint,
						props
					)}
					onChangeUnit={val =>
						onChangeValue(`${prefix}width-unit`, val)
					}
					value={getLastBreakpointAttribute(
						`${prefix}width`,
						breakpoint,
						props
					)}
					onChangeValue={val => onChangeValue(`${prefix}width`, val)}
					onReset={() => {
						onChangeValue(
							`${prefix}width`,
							getDefaultAttribute(`${prefix}width-${breakpoint}`)
						);
						onChangeValue(
							`${prefix}width-unit`,
							getDefaultAttribute(
								`${prefix}width-unit-${breakpoint}`
							)
						);
					}}
					minMaxSettings={minMaxSettings}
					allowedUnits={['px', 'em', 'vw', '%']}
				/>
			)}
			<AdvancedNumberControl
				label={__('Height', 'maxi-blocks')}
				enableUnit
				unit={getLastBreakpointAttribute(
					`${prefix}height-unit`,
					breakpoint,
					props
				)}
				onChangeUnit={val =>
					onChangeValue([`${prefix}height-unit`], val)
				}
				value={getLastBreakpointAttribute(
					`${prefix}height`,
					breakpoint,
					props
				)}
				onChangeValue={val => onChangeValue([`${prefix}height`], val)}
				onReset={() => {
					onChangeValue(
						[`${prefix}height`],
						getDefaultAttribute(`${prefix}height-${breakpoint}`)
					);
					onChangeValue(
						[`${prefix}height-unit`],
						getDefaultAttribute(
							`${prefix}height-unit-${breakpoint}`
						)
					);
				}}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%']}
			/>
			<ToggleSwitch
				label={__('Advanced Width/Height', 'maxi-blocks')}
				selected={props[`${prefix}size-advanced-options`] || 0}
				onChange={() => {
					onChange({
						[`${prefix}size-advanced-options`]:
							!props[`${prefix}size-advanced-options`],
					});
					if (props[`${prefix}size-advanced-options`]) {
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
				<>
					{!hideMaxWidth && (
						<AdvancedNumberControl
							label={__('Max Width', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute(
								`${prefix}max-width-unit`,
								breakpoint,
								props
							)}
							onChangeUnit={val =>
								onChangeValue(`${prefix}max-width-unit`, val)
							}
							value={getLastBreakpointAttribute(
								`${prefix}max-width`,
								breakpoint,
								props
							)}
							onChangeValue={val =>
								onChangeValue(`${prefix}max-width`, val)
							}
							onReset={() => {
								onChangeValue(
									`${prefix}max-width`,
									getDefaultAttribute(
										`${prefix}max-width-${breakpoint}`
									)
								);
								onChangeValue(
									`${prefix}max-width-unit`,
									getDefaultAttribute(
										`${prefix}max-width-unit-${breakpoint}`
									)
								);
							}}
							minMaxSettings={minMaxSettings}
							allowedUnits={['px', 'em', 'vw', '%']}
						/>
					)}
					<AdvancedNumberControl
						label={__('Min Width', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute(
							`${prefix}min-width-unit`,
							breakpoint,
							props
						)}
						onChangeUnit={val =>
							onChangeValue(`${prefix}min-width-unit`, val)
						}
						value={getLastBreakpointAttribute(
							`${prefix}min-width`,
							breakpoint,
							props
						)}
						onChangeValue={val =>
							onChangeValue(`${prefix}min-width`, val)
						}
						onReset={() => {
							onChangeValue(
								`${prefix}min-width`,
								getDefaultAttribute(
									`${prefix}min-width-${breakpoint}`
								)
							);
							onChangeValue(
								`${prefix}min-width-unit`,
								getDefaultAttribute(
									`${prefix}min-width-unit-${breakpoint}`
								)
							);
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', '%']}
					/>
					<AdvancedNumberControl
						label={__('Max Height', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute(
							`${prefix}max-height-unit`,
							breakpoint,
							props
						)}
						onChangeUnit={val =>
							onChangeValue(`${prefix}max-height-unit`, val)
						}
						value={getLastBreakpointAttribute(
							`${prefix}max-height`,
							breakpoint,
							props
						)}
						onChangeValue={val =>
							onChangeValue(`${prefix}max-height`, val)
						}
						onReset={() => {
							onChangeValue(
								`${prefix}max-height`,
								getDefaultAttribute(
									`${prefix}max-height-${breakpoint}`
								)
							);
							onChangeValue(
								`${prefix}max-height-unit`,
								getDefaultAttribute(
									`${prefix}max-height-unit-${breakpoint}`
								)
							);
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', '%']}
					/>
					<AdvancedNumberControl
						label={__('Min Height', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute(
							`${prefix}min-height-unit`,
							breakpoint,
							props
						)}
						onChangeUnit={val =>
							onChangeValue(`${prefix}min-height-unit`, val)
						}
						value={getLastBreakpointAttribute(
							`${prefix}min-height`,
							breakpoint,
							props
						)}
						onChangeValue={val =>
							onChangeValue(`${prefix}min-height`, val)
						}
						onReset={() => {
							onChangeValue(
								`${prefix}min-height`,
								getDefaultAttribute(
									`${prefix}min-height-${breakpoint}`
								)
							);
							onChangeValue(
								`${prefix}min-height-unit`,
								getDefaultAttribute(
									`${prefix}min-height-unit-${breakpoint}`
								)
							);
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', '%']}
					/>
				</>
			)}
		</div>
	);
};

export default FullSizeControl;
