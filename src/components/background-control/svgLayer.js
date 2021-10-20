/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SettingTabsControl from '../setting-tabs-control';
import SVGFillControl from '../svg-fill-control';
import {
	getAttributeKey,
	getBlockStyle,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import MaxiModal from '../../editor/library/modal';
import { getDefaultLayerAttr } from './utils';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Component
 */
const SVGLayerContent = props => {
	const {
		onChange,
		isHover = false,
		prefix = '',
		breakpoint,
		isGeneral = false,
		isLayer = false,
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

	const getDefaultAttr = target => {
		if (isLayer) return getDefaultLayerAttr('SVGOptions', target);

		return getDefaultAttribute(
			getAttributeKey(target, isHover, prefix, breakpoint)
		);
	};

	return (
		<>
			<SettingTabsControl
				disablePadding
				items={[
					{
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
										`${prefix}background-svg-top-unit`,
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
											...(isGeneral && {
												[getAttributeKey(
													'background-svg-top',
													isHover,
													prefix,
													'general'
												)]: val,
											}),
										});
									}}
									onChangeUnit={val =>
										onChange({
											[getAttributeKey(
												'background-svg-top-unit',
												isHover,
												prefix,
												breakpoint
											)]: val,
											...(isGeneral && {
												[getAttributeKey(
													'background-svg-top-unit',
													isHover,
													prefix,
													'general'
												)]: val,
											}),
										})
									}
									onReset={() =>
										onChange({
											[getAttributeKey(
												'background-svg-top',
												isHover,
												prefix,
												breakpoint
											)]:
												getDefaultAttr(
													'background-svg-top'
												),
											[getAttributeKey(
												'background-svg-top-unit',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttr(
												'background-svg-top-unit'
											),
											...(isGeneral && {
												[getAttributeKey(
													'background-svg-top',
													isHover,
													prefix,
													'general'
												)]:
													getDefaultAttr(
														'background-svg-top'
													),
												[getAttributeKey(
													'background-svg-top-unit',
													isHover,
													prefix,
													'general'
												)]: getDefaultAttr(
													'background-svg-top-unit'
												),
											}),
										})
									}
									minMaxSettings={{
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
											min: -100,
											max: 100,
										},
									}}
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
										`${prefix}background-svg-left-unit`,
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
											...(isGeneral && {
												[getAttributeKey(
													'background-svg-left',
													isHover,
													prefix,
													'general'
												)]: val,
											}),
										});
									}}
									onChangeUnit={val =>
										onChange({
											[getAttributeKey(
												'background-svg-left-unit',
												isHover,
												prefix,
												breakpoint
											)]: val,
											...(isGeneral && {
												[getAttributeKey(
													'background-svg-left-unit',
													isHover,
													prefix,
													'general'
												)]: val,
											}),
										})
									}
									onReset={() =>
										onChange({
											[getAttributeKey(
												'background-svg-left',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttr(
												'background-svg-left'
											),
											[getAttributeKey(
												'background-svg-left-unit',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttr(
												'background-svg-left-unit'
											),
											...(isGeneral && {
												[getAttributeKey(
													'background-svg-left',
													isHover,
													prefix,
													'general'
												)]: getDefaultAttr(
													'background-svg-left'
												),
												[getAttributeKey(
													'background-svg-left-unit',
													isHover,
													prefix,
													'general'
												)]: getDefaultAttr(
													'background-svg-left-unit'
												),
											}),
										})
									}
									minMaxSettings={{
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
											min: -100,
											max: 100,
										},
									}}
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
									`${prefix}background-svg-size-unit`,
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
										...(isGeneral && {
											[getAttributeKey(
												'background-svg-size',
												isHover,
												prefix,
												'general'
											)]: val,
										}),
									});
								}}
								onChangeUnit={val =>
									onChange({
										[getAttributeKey(
											'background-svg-size-unit',
											isHover,
											prefix,
											breakpoint
										)]: val,
										...(isGeneral && {
											[getAttributeKey(
												'background-svg-size-unit',
												isHover,
												prefix,
												'general'
											)]: val,
										}),
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey(
											'background-svg-size',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttr(
											'background-svg-size'
										),
										[getAttributeKey(
											'background-svg-size-unit',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttr(
											'background-svg-size-unit'
										),
										...(isGeneral && {
											[getAttributeKey(
												'background-svg-size',
												isHover,
												prefix,
												'general'
											)]: getDefaultAttr(
												'background-svg-size'
											),
											[getAttributeKey(
												'background-svg-size-unit',
												isHover,
												prefix,
												'general'
											)]: getDefaultAttr(
												'background-svg-size-unit'
											),
										}),
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

const SVGLayer = props => {
	const {
		clientId,
		SVGOptions,
		layerId,
		onChange,
		breakpoint,
		prefix = '',
		isHover = false,
		isLayer = false,
	} = props;

	const SVGElement = SVGOptions[`${prefix}background-svg-SVGElement`];

	return (
		<>
			<MaxiModal
				type='bg-shape'
				style={getBlockStyle(clientId)}
				onRemove={obj => {
					if (layerId) {
						delete SVGOptions[`${prefix}background-svg-SVGElement`];
						delete SVGOptions[`${prefix}background-svg-SVGMediaID`];
						delete SVGOptions[
							`${prefix}background-svg-SVGMediaURL`
						];
						delete SVGOptions[`${prefix}background-svg-SVGData`];
					}
					onChange({ ...SVGOptions, ...obj });
				}}
				icon={SVGElement}
				onSelect={obj => onChange(obj)}
			/>
			{!isEmpty(SVGElement) && (
				<>
					<SVGFillControl
						SVGOptions={SVGOptions}
						onChange={obj => onChange(obj)}
						clientId={clientId}
						isHover={isHover}
						breakpoint={breakpoint}
					/>
					<ResponsiveTabsControl breakpoint={breakpoint}>
						<SVGLayerContent
							SVGOptions={SVGOptions}
							onChange={onChange}
							prefix={prefix}
							isHover={isHover}
							isLayer={isLayer}
						/>
					</ResponsiveTabsControl>
				</>
			)}
		</>
	);
};

export default SVGLayer;
