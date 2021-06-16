/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 *
 */
import SettingTabsControl from '../setting-tabs-control';
import SVGDefaultsDisplayer from '../svg-default-displayer';
import SVGFillControl from '../svg-fill-control';
import AdvancedNumberControl from '../advanced-number-control';
import {
	getDefaultAttribute,
	getAttributeKey,
	getGroupAttributes,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Component
 */
const SVGLayer = props => {
	const { onChange, isHover, prefix, clientId } = props;
	const SVGOptions = cloneDeep(props.SVGOptions);

	return (
		<>
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Shape', 'maxi-blocks'),
						content: (
							<SVGDefaultsDisplayer
								SVGOptions={SVGOptions}
								prefix='background-svg-'
								SVGCurrentElement={
									SVGOptions[
										getAttributeKey(
											'background-svg-SVGCurrentElement',
											isHover,
											prefix
										)
									]
								}
								onChange={obj => {
									if (!isEmpty(obj))
										onChange({
											[getAttributeKey(
												'background-svg-SVGCurrentElement',
												isHover,
												prefix
											)]: obj.SVGCurrentElement,
											[getAttributeKey(
												'background-svg-SVGElement',
												isHover,
												prefix
											)]: obj.SVGElement,
											[getAttributeKey(
												'background-svg-SVGMediaID',
												isHover,
												prefix
											)]: obj.SVGMediaID,
											[getAttributeKey(
												'background-svg-SVGMediaURL',
												isHover,
												prefix
											)]: obj.SVGMediaURL,
											[getAttributeKey(
												'background-svg-SVGData',
												isHover,
												prefix
											)]: obj.SVGData,
										});
									else
										onChange({
											[getAttributeKey(
												'background-svg-SVGCurrentElement',
												isHover,
												prefix
											)]: '',
											[getAttributeKey(
												'background-svg-SVGElement',
												isHover,
												prefix
											)]: '',
										});
								}}
							/>
						),
					},
					!isEmpty(SVGOptions['background-svg-SVGElement']) && {
						label: __('Fill', 'maxi-blocks'),
						content: (
							<SVGFillControl
								{...getGroupAttributes(props, 'palette')}
								SVGData={
									SVGOptions[
										getAttributeKey(
											'background-svg-SVGData',
											isHover,
											prefix
										)
									]
								}
								SVGElement={
									SVGOptions[
										getAttributeKey(
											'background-svg-SVGElement',
											isHover,
											prefix
										)
									]
								}
								onChange={obj => {
									onChange({
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
									});
								}}
								onChangePalette={obj => onChange(obj)}
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
								min={0}
							/>
						),
					},
				]}
			/>
		</>
	);
};

export default SVGLayer;
