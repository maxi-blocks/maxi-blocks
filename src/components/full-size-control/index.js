/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getAttributesValue,
	getAttributeKey,
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
								[getAttributeKey(
									'full-width',
									false,
									false,
									breakpoint
								)]: val ? 'full' : 'normal',
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
										imgWidth: 100,
										[getAttributeKey(
											'full-width',
											false,
											prefix,
											breakpoint
										)]: val ? 'full' : 'normal',
								  })
								: onChange({
										[getAttributeKey(
											'full-width',
											false,
											prefix,
											breakpoint
										)]: val ? 'full' : 'normal',
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
							[getAttributeKey(
								'width-fit-content',
								false,
								prefix,
								breakpoint
							)]: val,
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
						onChange({
							[getAttributeKey(
								'width-unit',
								false,
								prefix,
								breakpoint
							)]: val,
						})
					}
					value={getLastBreakpointAttribute({
						target: `${prefix}width`,
						breakpoint,
						attributes: props,
					})}
					onChangeValue={val =>
						onChange({
							[getAttributeKey(
								'width',
								false,
								prefix,
								breakpoint
							)]: val,
						})
					}
					onReset={() => {
						onChange({
							[getAttributeKey(
								'width',
								false,
								prefix,
								breakpoint
							)]: getDefaultAttribute(
								getAttributeKey(
									'width',
									false,
									prefix,
									breakpoint
								)
							),
							[getAttributeKey(
								'width-unit',
								false,
								prefix,
								breakpoint
							)]: getDefaultAttribute(
								getAttributeKey(
									'width-unit',
									false,
									prefix,
									breakpoint
								)
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
							[getAttributeKey(
								'force-aspect-ratio',
								false,
								prefix,
								breakpoint
							)]: val,
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
								[getAttributeKey(
									'height-unit',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}height`,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({ [`${prefix}height-${breakpoint}`]: val })
						}
						onReset={() => {
							onChange({
								[`${prefix}height-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}height-${breakpoint}`
									),

								[getAttributeKey(
									'height-unit',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'height-unit',
										false,
										prefix,
										breakpoint
									)
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
				selected={
					getAttributesValue({
						target: 'size-advanced-options',
						prefix,
						props,
					}) || 0
				}
				onChange={val => {
					onChange({
						[getAttributeKey(
							'size-advanced-options',
							false,
							prefix,
							breakpoint
						)]: val,
					});
				}}
			/>
			{getAttributesValue({
				target: 'size-advanced-options',
				prefix,
				props,
			}) && (
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
										[getAttributeKey(
											'max-width-unit',
											false,
											prefix,
											breakpoint
										)]: val,
									})
								}
								value={getLastBreakpointAttribute({
									target: `${prefix}max-width`,
									breakpoint,
									attributes: props,
								})}
								onChangeValue={val =>
									onChange({
										[getAttributeKey(
											'max-width',
											false,
											prefix,
											breakpoint
										)]: val,
									})
								}
								onReset={() => {
									onChange({
										[getAttributeKey(
											'max-width',
											false,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											getAttributeKey(
												'max-width',
												false,
												prefix,
												breakpoint
											)
										),
										[getAttributeKey(
											'max-width-unit',
											false,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											getAttributeKey(
												'max-width-unit',
												false,
												prefix,
												breakpoint
											)
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
									[getAttributeKey(
										'min-width-unit',
										false,
										prefix,
										breakpoint
									)]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: `${prefix}min-width`,
								breakpoint,
								attributes: props,
							})}
							onChangeValue={val =>
								onChange({
									[getAttributeKey(
										'min-width',
										false,
										prefix,
										breakpoint
									)]: val,
								})
							}
							onReset={() => {
								onChange({
									[getAttributeKey(
										'min-width',
										false,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										getAttributeKey(
											'min-width',
											false,
											prefix,
											breakpoint
										)
									),
									[getAttributeKey(
										'min-width-unit',
										false,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										getAttributeKey(
											'min-width-unit',
											false,
											prefix,
											breakpoint
										)
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
								[getAttributeKey(
									'max-height-unit',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}max-height`,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'max-height',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() => {
							onChange({
								[getAttributeKey(
									'max-height',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'max-height',
										false,
										prefix,
										breakpoint
									)
								),
								[getAttributeKey(
									'max-height-unit',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'max-height-unit',
										false,
										prefix,
										breakpoint
									)
								),
								isReset: true,
							});
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
							onChange({
								[getAttributeKey(
									'min-height-unit',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}min-height`,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'min-height',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() => {
							onChange({
								[getAttributeKey(
									'min-height',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'min-height',
										false,
										prefix,
										breakpoint
									)
								),
								[getAttributeKey(
									'min-height-unit',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'min-height-unit',
										false,
										prefix,
										breakpoint
									)
								),
								isReset: true,
							});
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

export default withRTC(FullSizeControl);
