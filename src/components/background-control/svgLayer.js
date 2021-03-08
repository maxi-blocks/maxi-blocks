/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 *
 */
import SettingTabsControl from '../setting-tabs-control';
import SVGDefaultsDisplayer from '../svg-default-displayer';
import SVGFillControl from '../svg-fill-control';
import SizeControl from '../size-control';
import { getDefaultAttribute, getAttributeKey } from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, isNil } from 'lodash';

/**
 * Component
 */
const SVGLayer = props => {
	const { onChange, isHover, prefix } = props;
	const SVGOptions = cloneDeep(props.SVGOptions);
	return (
		<Fragment>
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Shape', 'maxi-blocks'),
						content: (
							<SVGDefaultsDisplayer
								SVGOptions={SVGOptions}
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
								onChange={obj =>
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
									})
								}
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
							<Fragment>
								<SizeControl
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
									defaultValue={getDefaultAttribute(
										getAttributeKey(
											'background-svg-top',
											isHover,
											prefix
										)
									)}
									defaultUnit={getDefaultAttribute(
										getAttributeKey(
											'background-svg-top--unit',
											isHover,
											prefix
										)
									)}
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
									min={0}
								/>
								<SizeControl
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
									defaultValue={getDefaultAttribute(
										getAttributeKey(
											'background-svg-left',
											isHover,
											prefix
										)
									)}
									defaultUnit={getDefaultAttribute(
										getAttributeKey(
											'background-svg-left--unit',
											isHover,
											prefix
										)
									)}
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
									min={0}
								/>
							</Fragment>
						),
					},
					!isEmpty(SVGOptions['background-svg-SVGElement']) && {
						label: __('Size', 'maxi-blocks'),
						content: (
							<SizeControl
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
								defaultValue={getDefaultAttribute(
									getAttributeKey(
										'background-svg-size',
										isHover,
										prefix
									)
								)}
								defaultUnit={getDefaultAttribute(
									getAttributeKey(
										'background-svg-size--unit',
										isHover,
										prefix
									)
								)}
								unit={
									SVGOptions[
										getAttributeKey(
											'background-svg-size--unit',
											isHover,
											prefix
										)
									]
								}
								onChangeValue={val =>
									onChange({
										[getAttributeKey(
											'background-svg-size',
											isHover,
											prefix
										)]: val,
									})
								}
								onChangeUnit={val =>
									onChange({
										[getAttributeKey(
											'background-svg-size--unit',
											isHover,
											prefix
										)]: val,
									})
								}
								min={0}
							/>
						),
					},
				]}
			/>
		</Fragment>
	);
};

export default SVGLayer;
