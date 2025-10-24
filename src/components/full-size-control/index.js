/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ToggleSwitch from '@components/toggle-switch';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '@extensions/styles';

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
		hideHeight,
		hideWidth,
		hideMaxWidth,
		hideFit,
		prefix = '',
		isBlockFullWidth,
		allowForceAspectRatio = false,
		showFullWidth = false,
		block = false,
		isImage = false,
	} = props;

	const classes = classnames('maxi-full-size-control', className);

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
			{showFullWidth &&
				(block ? (
					<ToggleSwitch
						label={__('Set block full-width', 'maxi-blocks')}
						className='maxi-full-width-toggle'
						selected={isBlockFullWidth}
						onChange={val =>
							onChange({
								[`full-width-${breakpoint}`]: val,
							})
						}
					/>
				) : (
					<ToggleSwitch
						label={__('Set block full-width', 'maxi-blocks')}
						selected={isBlockFullWidth}
						onChange={val =>
							isImage
								? onChange({
										imageRatio: 'original',
										imageSize: 'full',
										[`img-width-${breakpoint}`]: 100,
										[`${prefix}full-width-${breakpoint}`]:
											val,
								  })
								: onChange({
										[`${prefix}full-width-${breakpoint}`]:
											val,
								  })
						}
					/>
				))}
			{!isBlockFullWidth && !hideFit && (
				<ToggleSwitch
					label={__('Set width to fit content', 'maxi-blocks')}
					className='maxi-full-size-control__width-fit-content'
					selected={getLastBreakpointAttribute({
						target: `${prefix}width-fit-content`,
						breakpoint,
						attributes: props,
					})}
					onChange={val => {
						onChange({
							[`${prefix}width-fit-content-${breakpoint}`]: val,
						});
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
						onChange({ [`${prefix}width-unit-${breakpoint}`]: val })
					}
					value={getLastBreakpointAttribute({
						target: `${prefix}width`,
						breakpoint,
						attributes: props,
					})}
					onChangeValue={(val, meta) =>
						onChange({
							[`${prefix}width-${breakpoint}`]: val,
							meta,
						})
					}
					onReset={() => {
						onChange({
							[`${prefix}width-${breakpoint}`]:
								getDefaultAttribute(
									`${prefix}width-${breakpoint}`
								),
							[`${prefix}width-unit-${breakpoint}`]:
								getDefaultAttribute(
									`${prefix}width-unit-${breakpoint}`
								),
							isReset: true,
						});
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
						onChange({
							[`${prefix}force-aspect-ratio-${breakpoint}`]: val,
						})
					}
				/>
			)}
			{!getLastBreakpointAttribute({
				target: `${prefix}force-aspect-ratio`,
				breakpoint,
				attributes: props,
			}) &&
				!hideHeight && (
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
							onChange({
								[`${prefix}height-unit-${breakpoint}`]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}height`,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={(val, meta) =>
							onChange({
								[`${prefix}height-${breakpoint}`]: val,
								meta,
							})
						}
						onReset={() => {
							onChange({
								[`${prefix}height-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}height-${breakpoint}`
									),

								[`${prefix}height-unit-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}height-unit-${breakpoint}`
									),
								isReset: true,
							});
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
									onChange({
										[`${prefix}max-width-unit-${breakpoint}`]:
											val,
									})
								}
								value={getLastBreakpointAttribute({
									target: `${prefix}max-width`,
									breakpoint,
									attributes: props,
								})}
								onChangeValue={(val, meta) =>
									onChange({
										[`${prefix}max-width-${breakpoint}`]:
											val,
										meta,
									})
								}
								onReset={() => {
									onChange({
										[`${prefix}max-width-${breakpoint}`]:
											getDefaultAttribute(
												`${prefix}max-width-${breakpoint}`
											),
										[`${prefix}max-width-unit-${breakpoint}`]:
											getDefaultAttribute(
												`${prefix}max-width-unit-${breakpoint}`
											),
										isReset: true,
									});
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
								onChange({
									[`${prefix}min-width-unit-${breakpoint}`]:
										val,
								})
							}
							value={getLastBreakpointAttribute({
								target: `${prefix}min-width`,
								breakpoint,
								attributes: props,
							})}
							onChangeValue={(val, meta) =>
								onChange({
									[`${prefix}min-width-${breakpoint}`]: val,
									meta,
								})
							}
							onReset={() => {
								onChange({
									[`${prefix}min-width-${breakpoint}`]:
										getDefaultAttribute(
											`${prefix}min-width-${breakpoint}`
										),
									[`${prefix}min-width-unit-${breakpoint}`]:
										getDefaultAttribute(
											`${prefix}min-width-unit-${breakpoint}`
										),
									isReset: true,
								});
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
							onChange({
								[`${prefix}max-height-unit-${breakpoint}`]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}max-height`,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={(val, meta) =>
							onChange({
								[`${prefix}max-height-${breakpoint}`]: val,
								meta,
							})
						}
						onReset={() => {
							onChange({
								[`${prefix}max-height-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}max-height-${breakpoint}`
									),
								[`${prefix}max-height-unit-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}max-height-unit-${breakpoint}`
									),
								isReset: true,
							});
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', 'vh', '%']}
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
							onChange({
								[`${prefix}min-height-unit-${breakpoint}`]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}min-height`,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={(val, meta) =>
							onChange({
								[`${prefix}min-height-${breakpoint}`]: val,
								meta,
							})
						}
						onReset={() => {
							onChange({
								[`${prefix}min-height-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}min-height-${breakpoint}`
									),
								[`${prefix}min-height-unit-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}min-height-unit-${breakpoint}`
									),
								isReset: true,
							});
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', 'vh', '%']}
						optionType='string'
					/>
				</>
			)}
		</div>
	);
};

export default withRTC(FullSizeControl);
