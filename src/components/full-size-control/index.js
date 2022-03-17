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
import { isEmpty } from 'lodash';

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
				response[`${el}-${breakpoint}`] = val;
			});
		} else {
			response[`${target}-${breakpoint}`] = val;
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
		vh: {
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
			{!hideWidth && !isEmpty(currentBlockRoot) && (
				<AdvancedNumberControl
					label={__('Width', 'maxi-blocks')}
					enableUnit
					unit={getLastBreakpointAttribute({
						target: `${prefix}width-unit`,
						breakpoint,
						attributes: props,
					})}
					onChangeUnit={val =>
						onChangeValue(`${prefix}width-unit`, val)
					}
					value={getLastBreakpointAttribute({
						target: `${prefix}width`,
						breakpoint,
						attributes: props,
					})}
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
				unit={getLastBreakpointAttribute({
					target: `${prefix}height-unit`,
					breakpoint,
					attributes: props,
				})}
				onChangeUnit={val =>
					onChangeValue([`${prefix}height-unit`], val)
				}
				value={getLastBreakpointAttribute({
					target: `${prefix}height`,
					breakpoint,
					attributes: props,
				})}
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
				allowedUnits={['px', '%', 'em', 'vw', 'vh']}
			/>
			<ToggleSwitch
				label={__('Set custom min/max values', 'maxi-blocks')}
				selected={props[`${prefix}size-advanced-options`] || 0}
				onChange={val => {
					onChange({
						[`${prefix}size-advanced-options`]: val,
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
							label={__('Maximum width', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute({
								target: `${prefix}max-width-unit`,
								breakpoint,
								attributes: props,
							})}
							onChangeUnit={val =>
								onChangeValue(`${prefix}max-width-unit`, val)
							}
							value={getLastBreakpointAttribute({
								target: `${prefix}max-width`,
								breakpoint,
								attributes: props,
							})}
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
						label={__('Minimum width', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute({
							target: `${prefix}min-width-unit`,
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChangeValue(`${prefix}min-width-unit`, val)
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}min-width`,
							breakpoint,
							attributes: props,
						})}
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
						label={__('Maximum height', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute({
							target: `${prefix}max-height-unit`,
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChangeValue(`${prefix}max-height-unit`, val)
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}max-height`,
							breakpoint,
							attributes: props,
						})}
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
						allowedUnits={['px', 'em', 'vw', 'vh']}
					/>
					<AdvancedNumberControl
						label={__('Minimum height', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute({
							target: `${prefix}min-height-unit`,
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChangeValue(`${prefix}min-height-unit`, val)
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}min-height`,
							breakpoint,
							attributes: props,
						})}
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
						allowedUnits={['px', 'em', 'vw', 'vh']}
					/>
				</>
			)}
		</div>
	);
};

export default FullSizeControl;
