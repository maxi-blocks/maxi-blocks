/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
		isBlockFullWidth,
		allowForceAspectRatio = false,
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
			max: 300,
			minRange: 0,
			maxRange: 300,
		},
	};

	const showWidth =
		!hideWidth &&
		!isBlockFullWidth &&
		!getLastBreakpointAttribute({
			target: `${prefix}width-fit-content`,
			breakpoint,
			attributes: props,
		});

	return (
		<div className={classes}>
			{!isBlockFullWidth && (
				<ToggleSwitch
					label={__('Set width to fit content', 'maxi-blocks')}
					className='maxi-full-size-control__width-fit-content'
					selected={getLastBreakpointAttribute({
						target: `${prefix}width-fit-content`,
						breakpoint,
						attributes: props,
					})}
					onChange={val => {
						onChangeValue([`${prefix}width-fit-content`], val);
					}}
				/>
			)}
			{showWidth && (
				<AdvancedNumberControl
					label={__('Width', 'maxi-blocks')}
					className='maxi-full-size-control__width'
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
					optionType='string'
				/>
			)}
			{allowForceAspectRatio && (
				<ToggleSwitch
					label={__(
						'Force canvas equal height & width',
						'maxi-blocks'
					)}
					className='maxi-full-size-control__force-aspect-ratio'
					selected={getLastBreakpointAttribute({
						target: `${prefix}force-aspect-ratio`,
						breakpoint,
						attributes: props,
					})}
					onChange={val =>
						onChangeValue(`${prefix}force-aspect-ratio`, val)
					}
				/>
			)}
			{!getLastBreakpointAttribute({
				target: `${prefix}force-aspect-ratio`,
				breakpoint,
				attributes: props,
			}) && (
				<AdvancedNumberControl
					label={__('Height', 'maxi-blocks')}
					className='maxi-full-size-control__height'
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
					onChangeValue={val =>
						onChangeValue([`${prefix}height`], val)
					}
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
					optionType='string'
				/>
			)}
			<ToggleSwitch
				label={__('Set custom min/max values', 'maxi-blocks')}
				className='maxi-full-size-control__custom-min-max'
				selected={props[`${prefix}size-advanced-options`] || 0}
				onChange={val => {
					onChange({
						[`${prefix}size-advanced-options`]: val,
					});
				}}
			/>
			{props[`${prefix}size-advanced-options`] && (
				<>
					{!hideMaxWidth &&
						!getLastBreakpointAttribute({
							target: `${prefix}width-fit-content`,
							breakpoint,
							attributes: props,
						}) && (
							<AdvancedNumberControl
								label={__('Maximum width', 'maxi-blocks')}
								className='maxi-full-size-control__max-width'
								enableUnit
								unit={getLastBreakpointAttribute({
									target: `${prefix}max-width-unit`,
									breakpoint,
									attributes: props,
								})}
								onChangeUnit={val =>
									onChangeValue(
										`${prefix}max-width-unit`,
										val
									)
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
								optionType='string'
							/>
						)}
					{!getLastBreakpointAttribute({
						target: `${prefix}width-fit-content`,
						breakpoint,
						attributes: props,
					}) && (
						<AdvancedNumberControl
							label={__('Minimum width', 'maxi-blocks')}
							className='maxi-full-size-control__min-width'
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
							optionType='string'
						/>
					)}
					<AdvancedNumberControl
						label={__('Maximum height', 'maxi-blocks')}
						className='maxi-full-size-control__max-height'
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
						optionType='string'
					/>
					<AdvancedNumberControl
						label={__('Minimum height', 'maxi-blocks')}
						className='maxi-full-size-control__min-height'
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
						optionType='string'
					/>
				</>
			)}
		</div>
	);
};

export default FullSizeControl;
