/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
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
import { ResponsiveTabsControl } from '..';

/**
 * Component
 */
const SVGLayerContent = props => {
	const {
		onChange,
		isHover = false,
		prefix = '',
		clientId,
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
												'background-svg-top-unit',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-top-unit',
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
												'background-svg-left-unit',
												isHover,
												prefix,
												breakpoint
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-left-unit',
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
											'background-svg-size-unit',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											getAttributeKey(
												'background-svg-size-unit',
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

const SVGLayer = props => {
	const {
		clientId,
		SVGOptions,
		layerId,
		onChange,
		prefix,
		isHover,
		breakpoint,
	} = props;

	const SVGElement =
		SVGOptions[
			getAttributeKey('background-svg-SVGElement', isHover, prefix)
		];

	return (
		<>
			<MaxiModal
				type='bg-shape'
				style={getBlockStyle(clientId)}
				onRemove={obj => {
					if (layerId) {
						delete SVGOptions['background-svg-SVGElement'];
						delete SVGOptions['background-svg-SVGMediaID'];
						delete SVGOptions['background-svg-SVGMediaURL'];
						delete SVGOptions['background-svg-SVGData'];
					}
					onChange({ ...SVGOptions, ...obj });
				}}
				icon={SVGElement}
				onSelect={obj => onChange(obj)}
			/>
			{!isEmpty(SVGElement) && (
				<ResponsiveTabsControl breakpoint={breakpoint}>
					<SVGLayerContent
						clientId={clientId}
						SVGOptions={SVGOptions}
						onChange={onChange}
						prefix={prefix}
						isHover={isHover}
					/>
				</ResponsiveTabsControl>
			)}
		</>
	);
};

export default SVGLayer;
