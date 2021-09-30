/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 */
import SettingTabsControl from '../setting-tabs-control';
import SVGFillControl from '../svg-fill-control';
import AdvancedNumberControl from '../advanced-number-control';
import {
	getDefaultAttribute,
	getAttributeKey,
	getBlockStyle,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import MaxiModal from '../../editor/library/modal';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Component
 */
const SVGLayer = props => {
	const {
		onChange,
		isHover,
		prefix = '',
		clientId,
		layerId,
		breakpoint,
	} = props;

	const SVGOptions = cloneDeep(props.SVGOptions);
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
			max: 999,
		},
	};

	return (
		<>
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Shape', 'maxi-blocks'),
						content: (
							<MaxiModal
								type='bg-shape'
								style={getBlockStyle(clientId)}
								onRemove={obj => {
									if (layerId) {
										delete SVGOptions[
											'background-svg-SVGElement'
										];
										delete SVGOptions[
											'background-svg-SVGMediaID'
										];
										delete SVGOptions[
											'background-svg-SVGMediaURL'
										];
										delete SVGOptions[
											'background-svg-SVGData'
										];
									}
									onChange({ ...SVGOptions, ...obj });
								}}
								icon={getLastBreakpointAttribute(
									`${prefix}background-svg-SVGElement`,
									breakpoint,
									SVGOptions,
									isHover
								)}
								onSelect={obj => {
									if (breakpoint)
										Object.entries(obj).forEach(
											([key, val]) => {
												if (
													key.lastIndexOf(
														`-${breakpoint}`
													) !==
													key.length -
														`-${breakpoint}`.length
												) {
													obj[
														`${key}-${breakpoint}`
													] = val;

													delete obj[key];
												}
											}
										);

									onChange(obj);
								}}
							/>
						),
					},
					!isEmpty(
						getLastBreakpointAttribute(
							`${prefix}background-svg-SVGElement`,
							breakpoint,
							SVGOptions,
							isHover
						)
					) && {
						label: __('Fill', 'maxi-blocks'),
						content: (
							<SVGFillControl
								SVGOptions={SVGOptions}
								onChange={obj => onChange(obj)}
								clientId={clientId}
								isHover={isHover}
								breakpoint={breakpoint}
							/>
						),
					},
					!isEmpty(
						getLastBreakpointAttribute(
							`${prefix}background-svg-SVGElement`,
							breakpoint,
							SVGOptions,
							isHover
						)
					) && {
						label: __('Position', 'maxi-blocks'),
						content: (
							<>
								<AdvancedNumberControl
									label={__('Y-axis', 'maxi-blocks')}
									value={getLastBreakpointAttribute(
										`${prefix}background-svg-top`,
										breakpoint,
										SVGOptions,
										isHover
									)}
									enableUnit
									unit={getLastBreakpointAttribute(
										`${prefix}background-svg-top--unit`,
										breakpoint,
										SVGOptions,
										isHover
									)}
									onChangeValue={val => {
										onChange({
											[getAttributeKey(
												'background-svg-top',
												isHover,
												prefix,
												breakpoint
											)]: val,
										});
									}}
									onChangeUnit={val =>
										onChange({
											[getAttributeKey(
												'background-svg-top--unit',
												isHover,
												prefix,
												breakpoint
											)]: val,
										})
									}
									onReset={() =>
										onChange({
											[getAttributeKey(
												'background-svg-top',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-top',
													isHover,
													prefix,
													breakpoint
												)
											),
											[getAttributeKey(
												'background-svg-top--unit',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-top--unit',
													isHover,
													prefix,
													breakpoint
												)
											),
										})
									}
									min={0}
								/>
								<AdvancedNumberControl
									label={__('X-axis', 'maxi-blocks')}
									value={getLastBreakpointAttribute(
										`${prefix}background-svg-left`,
										breakpoint,
										SVGOptions,
										isHover
									)}
									enableUnit
									unit={getLastBreakpointAttribute(
										`${prefix}background-svg-left--unit`,
										breakpoint,
										SVGOptions,
										isHover
									)}
									onChangeValue={val => {
										onChange({
											[getAttributeKey(
												'background-svg-left',
												isHover,
												prefix,
												breakpoint
											)]: val,
										});
									}}
									onChangeUnit={val =>
										onChange({
											[getAttributeKey(
												'background-svg-left--unit',
												isHover,
												prefix,
												breakpoint
											)]: val,
										})
									}
									onReset={() =>
										onChange({
											[getAttributeKey(
												'background-svg-left',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-left',
													isHover,
													prefix,
													breakpoint
												)
											),
											[getAttributeKey(
												'background-svg-left--unit',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-left--unit',
													isHover,
													prefix,
													breakpoint
												)
											),
										})
									}
									min={0}
								/>
							</>
						),
					},
					!isEmpty(SVGOptions['background-svg-SVGElement']) && {
						label: __('Size', 'maxi-blocks'),
						content: (
							<AdvancedNumberControl
								label={__('Size', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									`${prefix}background-svg-size`,
									breakpoint,
									SVGOptions,
									isHover
								)}
								allowedUnits={['px', 'em', 'vw', '%']}
								enableUnit
								unit={getLastBreakpointAttribute(
									`${prefix}background-svg-size--unit`,
									breakpoint,
									SVGOptions,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[getAttributeKey(
											'background-svg-size',
											isHover,
											prefix,
											breakpoint
										)]: val,
									});
								}}
								onChangeUnit={val =>
									onChange({
										[getAttributeKey(
											'background-svg-size--unit',
											isHover,
											prefix,
											breakpoint
										)]: val,
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey(
											'background-svg-size',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											getAttributeKey(
												'background-svg-size',
												isHover,
												prefix,
												breakpoint
											)
										),
										[getAttributeKey(
											'background-svg-size--unit',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											getAttributeKey(
												'background-svg-size--unit',
												isHover,
												prefix,
												breakpoint
											)
										),
									})
								}
								minMaxSettings={minMaxSettings}
							/>
						),
					},
				]}
			/>
		</>
	);
};

export default SVGLayer;
