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
} from '../../extensions/attributes';

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
			target: '_wfc',
			prefix,
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
									'_fw',
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
											'_fw',
											false,
											prefix,
											breakpoint
										)]: val ? 'full' : 'normal',
								  })
								: onChange({
										[getAttributeKey(
											'_fw',
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
						target: '_wfc',
						prefix,
						breakpoint,
						attributes: props,
					})}
					onChange={val => {
						onChange({
							[getAttributeKey(
								'_wfc',
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
						target: '_w.u',
						prefix,
						breakpoint,
						attributes: props,
					})}
					onChangeUnit={val =>
						onChange({
							[getAttributeKey(
								'_w.u',
								false,
								prefix,
								breakpoint
							)]: val,
						})
					}
					value={getLastBreakpointAttribute({
						target: '_w',
						prefix,
						breakpoint,
						attributes: props,
					})}
					onChangeValue={val =>
						onChange({
							[getAttributeKey('_w', false, prefix, breakpoint)]:
								val,
						})
					}
					onReset={() => {
						onChange({
							[getAttributeKey('_w', false, prefix, breakpoint)]:
								getDefaultAttribute(
									getAttributeKey(
										'_w',
										false,
										prefix,
										breakpoint
									)
								),
							[getAttributeKey(
								'_w.u',
								false,
								prefix,
								breakpoint
							)]: getDefaultAttribute(
								getAttributeKey(
									'_w.u',
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
						target: '_far',
						prefix,
						breakpoint,
						attributes: props,
					})}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'_far',
								false,
								prefix,
								breakpoint
							)]: val,
						})
					}
				/>
			)}
			{!getLastBreakpointAttribute({
				target: '_far',
				prefix,
				breakpoint,
				attributes: props,
			}) &&
				!hideHeight && (
					<AdvancedNumberControl
						label={__('Height', 'maxi-blocks')}
						className='maxi-full-size-control__height'
						enableUnit
						unit={getLastBreakpointAttribute({
							target: '_h.u',
							prefix,
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'_h.u',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: '_h',
							prefix,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({ [`${prefix}_h-${breakpoint}`]: val })
						}
						onReset={() => {
							onChange({
								[`${prefix}_h-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}_h-${breakpoint}`
									),

								[getAttributeKey(
									'_h.u',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'_h.u',
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
						target: '_sao',
						prefix,
						props,
					}) || 0
				}
				onChange={val => {
					onChange({
						[getAttributeKey('_sao', false, prefix, breakpoint)]:
							val,
					});
				}}
			/>
			{getAttributesValue({
				target: '_sao',
				prefix,
				props,
			}) && (
				<>
					{!hideMaxWidth &&
						!getLastBreakpointAttribute({
							target: '_wfc',
							prefix,
							breakpoint,
							attributes: props,
						}) && (
							<AdvancedNumberControl
								label={__('Maximum width', 'maxi-blocks')}
								className='maxi-full-size-control__max-width'
								enableUnit
								unit={getLastBreakpointAttribute({
									target: '_mw.u',
									prefix,
									breakpoint,
									attributes: props,
								})}
								onChangeUnit={val =>
									onChange({
										[getAttributeKey(
											'_mw.u',
											false,
											prefix,
											breakpoint
										)]: val,
									})
								}
								value={getLastBreakpointAttribute({
									target: '_mw',
									prefix,
									breakpoint,
									attributes: props,
								})}
								onChangeValue={val =>
									onChange({
										[getAttributeKey(
											'_mw',
											false,
											prefix,
											breakpoint
										)]: val,
									})
								}
								onReset={() => {
									onChange({
										[getAttributeKey(
											'_mw',
											false,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											getAttributeKey(
												'_mw',
												false,
												prefix,
												breakpoint
											)
										),
										[getAttributeKey(
											'_mw.u',
											false,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											getAttributeKey(
												'_mw.u',
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
						target: '_wfc',
						prefix,
						breakpoint,
						attributes: props,
					}) && (
						<AdvancedNumberControl
							label={__('Minimum width', 'maxi-blocks')}
							className='maxi-full-size-control__min-width'
							enableUnit
							unit={getLastBreakpointAttribute({
								target: '_mw.u',
								prefix,
								breakpoint,
								attributes: props,
							})}
							onChangeUnit={val =>
								onChange({
									[getAttributeKey(
										'_miw.u',
										false,
										prefix,
										breakpoint
									)]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: '_mw',
								prefix,
								breakpoint,
								attributes: props,
							})}
							onChangeValue={val =>
								onChange({
									[getAttributeKey(
										'_miw',
										false,
										prefix,
										breakpoint
									)]: val,
								})
							}
							onReset={() => {
								onChange({
									[getAttributeKey(
										'_miw',
										false,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										getAttributeKey(
											'_miw',
											false,
											prefix,
											breakpoint
										)
									),
									[getAttributeKey(
										'_miw.u',
										false,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										getAttributeKey(
											'_miw.u',
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
							target: '_mh.u',
							prefix,
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'_mh.u',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: '_mh',
							prefix,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'_mh',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() => {
							onChange({
								[getAttributeKey(
									'_mh',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'_mh',
										false,
										prefix,
										breakpoint
									)
								),
								[getAttributeKey(
									'_mh.u',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'_mh.u',
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
							target: '_mh.u',
							prefix,
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'_mh.u',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: '_mh',
							prefix,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'_mh',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() => {
							onChange({
								[getAttributeKey(
									'_mh',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'_mh',
										false,
										prefix,
										breakpoint
									)
								),
								[getAttributeKey(
									'_mh.u',
									false,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'_mh.u',
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
