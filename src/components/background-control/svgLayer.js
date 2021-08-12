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
	const { onChange, isHover, prefix, clientId, layerId } = props;

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
								layerId={layerId}
								style={getBlockStyle(clientId)}
							/>
						),
					},
					!isEmpty(SVGOptions['background-svg-SVGElement']) && {
						label: __('Fill', 'maxi-blocks'),
						content: (
							<SVGFillControl
								SVGOptions={SVGOptions}
								onChange={obj =>
									onChange({
										'background-palette-svg-color':
											obj['background-palette-svg-color'],
										'background-palette-svg-color-status':
											obj[
												'background-palette-svg-color-status'
											],
										[getAttributeKey(
											'background-svg-SVGData',
											isHover,
											prefix
										)]: obj.SVGData,
										[getAttributeKey(
											'background-svg-SVGElement',
											isHover,
											prefix
										)]: obj.SVGElement,
									})
								}
								clientId={clientId}
								isHover={isHover}
							/>
						),
					},
					!isEmpty(
						SVGOptions[
							getAttributeKey(
								'background-svg-SVGElement',
								isHover,
								prefix
							)
						]
					) && {
						label: __('Position', 'maxi-blocks'),
						content: (
							<>
								<AdvancedNumberControl
									label={__('Y-axis', 'maxi-blocks')}
									value={
										SVGOptions[
											getAttributeKey(
												'background-svg-top',
												isHover,
												prefix
											)
										]
									}
									enableUnit
									unit={
										SVGOptions[
											getAttributeKey(
												'background-svg-top--unit',
												isHover,
												prefix
											)
										]
									}
									onChangeValue={val => {
										onChange({
											[getAttributeKey(
												'background-svg-top',
												isHover,
												prefix
											)]: val,
										});
									}}
									onChangeUnit={val =>
										onChange({
											[getAttributeKey(
												'background-svg-top--unit',
												isHover,
												prefix
											)]: val,
										})
									}
									onReset={() =>
										onChange({
											[getAttributeKey(
												'background-svg-top',
												isHover,
												prefix
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-top',
													isHover,
													prefix
												)
											),
											[getAttributeKey(
												'background-svg-top--unit',
												isHover,
												prefix
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-top--unit',
													isHover,
													prefix
												)
											),
										})
									}
									min={0}
								/>
								<AdvancedNumberControl
									label={__('X-axis', 'maxi-blocks')}
									value={
										SVGOptions[
											getAttributeKey(
												'background-svg-left',
												isHover,
												prefix
											)
										]
									}
									enableUnit
									unit={
										SVGOptions[
											getAttributeKey(
												'background-svg-left--unit',
												isHover,
												prefix
											)
										]
									}
									onChangeValue={val => {
										onChange({
											[getAttributeKey(
												'background-svg-left',
												isHover,
												prefix
											)]: val,
										});
									}}
									onChangeUnit={val =>
										onChange({
											[getAttributeKey(
												'background-svg-left--unit',
												isHover,
												prefix
											)]: val,
										})
									}
									onReset={() =>
										onChange({
											[getAttributeKey(
												'background-svg-left',
												isHover,
												prefix
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-left',
													isHover,
													prefix
												)
											),
											[getAttributeKey(
												'background-svg-left--unit',
												isHover,
												prefix
											)]: getDefaultAttribute(
												getAttributeKey(
													'background-svg-left--unit',
													isHover,
													prefix
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
								value={
									SVGOptions[
										getAttributeKey(
											'background-svg-size',
											isHover,
											prefix
										)
									]
								}
								allowedUnits={['px', 'em', 'vw', '%']}
								enableUnit
								unit={
									SVGOptions[
										getAttributeKey(
											'background-svg-size--unit',
											isHover,
											prefix
										)
									]
								}
								onChangeValue={val => {
									onChange({
										[getAttributeKey(
											'background-svg-size',
											isHover,
											prefix
										)]: val,
									});
								}}
								onChangeUnit={val =>
									onChange({
										[getAttributeKey(
											'background-svg-size--unit',
											isHover,
											prefix
										)]: val,
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey(
											'background-svg-size',
											isHover,
											prefix
										)]: getDefaultAttribute(
											getAttributeKey(
												'background-svg-size',
												isHover,
												prefix
											)
										),
										[getAttributeKey(
											'background-svg-size--unit',
											isHover,
											prefix
										)]: getDefaultAttribute(
											getAttributeKey(
												'background-svg-size--unit',
												isHover,
												prefix
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
