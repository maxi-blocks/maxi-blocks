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
	getAttributeKey,
	getAttributeValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
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
			target: 'width-fit-content',
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
									'full-width',
									false,
									'',
									breakpoint
								)]: val === true ? 'full' : 'normal',
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
						target: 'width-fit-content',
						prefix,
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
						target: 'width-unit',
						prefix,
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
						target: 'width',
						prefix,
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
						const widthKey = getAttributeKey(
							'width',
							false,
							prefix,
							breakpoint
						);
						const widthUnitKey = getAttributeKey(
							'width-unit',
							false,
							prefix,
							breakpoint
						);

						onChange({
							[widthKey]: getDefaultAttribute(widthKey),
							[widthUnitKey]: getDefaultAttribute(widthUnitKey),
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
						target: 'force-aspect-ratio',
						prefix,
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
				target: 'force-aspect-ratio',
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
							target: 'height-unit',
							prefix,
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
							target: 'height',
							prefix,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'height',
									false,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() => {
							const heightKey = getAttributeKey(
								'height',
								false,
								prefix,
								breakpoint
							);
							const heightUnitKey = getAttributeKey(
								'height-unit',
								false,
								prefix,
								breakpoint
							);

							onChange({
								[heightKey]: getDefaultAttribute(heightKey),
								[heightUnitKey]:
									getDefaultAttribute(heightUnitKey),
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
					getAttributeValue({
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
							prefix
						)]: val,
					});
				}}
			/>
			{getAttributeValue({
				target: 'size-advanced-options',
				prefix,
				props,
			}) && (
				<>
					{!hideMaxWidth &&
						!getLastBreakpointAttribute({
							target: 'width-fit-content',
							prefix,
							breakpoint,
							attributes: props,
						}) && (
							<AdvancedNumberControl
								label={__('Maximum width', 'maxi-blocks')}
								className='maxi-full-size-control__max-width'
								enableUnit
								unit={getLastBreakpointAttribute({
									target: 'max-width-unit',
									prefix,
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
									target: 'max-width',
									prefix,
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
									const maxWidthKey = getAttributeKey(
										'max-width',
										false,
										prefix,
										breakpoint
									);
									const maxWidthUnitKey = getAttributeKey(
										'max-width-unit',
										false,
										prefix,
										breakpoint
									);

									onChange({
										[maxWidthKey]:
											getDefaultAttribute(maxWidthKey),
										[maxWidthUnitKey]:
											getDefaultAttribute(
												maxWidthUnitKey
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
						target: 'width-fit-content',
						prefix,
						breakpoint,
						attributes: props,
					}) && (
						<AdvancedNumberControl
							label={__('Minimum width', 'maxi-blocks')}
							className='maxi-full-size-control__min-width'
							enableUnit
							unit={getLastBreakpointAttribute({
								target: 'min-width-unit',
								prefix,
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
								target: 'min-width',
								prefix,
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
								const minWidthKey = getAttributeKey(
									'min-width',
									false,
									prefix,
									breakpoint
								);
								const minWidthUnitKey = getAttributeKey(
									'min-width-unit',
									false,
									prefix,
									breakpoint
								);

								onChange({
									[minWidthKey]:
										getDefaultAttribute(minWidthKey),
									[minWidthUnitKey]:
										getDefaultAttribute(minWidthUnitKey),
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
							target: 'max-height-unit',
							prefix,
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
							target: 'max-height',
							prefix,
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
							const maxHeightKey = getAttributeKey(
								'max-height',
								false,
								prefix,
								breakpoint
							);
							const maxHeightUnitKey = getAttributeKey(
								'max-height-unit',
								false,
								prefix,
								breakpoint
							);

							onChange({
								[maxHeightKey]:
									getDefaultAttribute(maxHeightKey),
								[maxHeightUnitKey]:
									getDefaultAttribute(maxHeightUnitKey),
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
							target: 'min-height-unit',
							prefix,
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
							target: 'min-height',
							prefix,
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
							const minHeightKey = getAttributeKey(
								'min-height',
								false,
								prefix,
								breakpoint
							);
							const minHeightUnitKey = getAttributeKey(
								'min-height-unit',
								false,
								prefix,
								breakpoint
							);

							onChange({
								[minHeightKey]:
									getDefaultAttribute(minHeightKey),
								[minHeightUnitKey]:
									getDefaultAttribute(minHeightUnitKey),
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
