/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import FlexGapControl from './flex-gap-control';
import FlexAlignControl from './flex-align-control';
import FlexWrapControl from './flex-wrap-control';
import FlexDirectionControl from './flex-direction-control';
import AdvancedNumberControl from '../advanced-number-control';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import FlexContentAlignControl from './flex-content-align-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';
import getOptions from './utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { toString } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FlexSettingsControl = props => {
	const {
		className,
		onChange,
		name,
		breakpoint = 'general',
		getParentBlockName,
	} = props;

	const isCustomFlexBasis = /\d/.test(
		getLastBreakpointAttribute({
			target: 'flex-basis',
			attributes: props,
			isHover: false,
			breakpoint,
		})
	);

	const [customFlexBasis, setCustomFlexBasis] = useState(isCustomFlexBasis);

	const wrapperBlocks = [
		'maxi-blocks/container-maxi',
		'maxi-blocks/row-maxi',
		'maxi-blocks/column-maxi',
		'maxi-blocks/group-maxi',
		'maxi-blocks/accordion-maxi',
	];

	const classes = classnames('maxi-flex-settings--control', className);

	return (
		<div className={classes}>
			<SettingTabsControl
				className='maxi-accordion-control__item__flexbox'
				fullWidthMode
				showTooltip
				items={[
					{
						label: __('Flex-parent', 'maxi-blocks'),
						value: 'flex-parent',
						content: wrapperBlocks.includes(name) ? (
							<>
								<div className='maxi-flex-options__wrap'>
									<FlexWrapControl {...props} />
									<FlexDirectionControl {...props} />
									<FlexAlignControl
										{...props}
										onChange={onChange}
										breakpoint={breakpoint}
									/>
									<FlexContentAlignControl {...props} />
								</div>
								<FlexGapControl
									{...props}
									onChange={onChange}
									breakpoint={breakpoint}
								/>
							</>
						) : (
							<div className='maxi-warning-box'>
								{__(
									'Block should be a wrapper to use flex-parent properties. Use Flex-child instead.',
									'maxi-blocks'
								)}
							</div>
						),
					},
					{
						label: __('Flex-child', 'maxi-blocks'),
						value: 'flex-child',
						content: wrapperBlocks.includes(getParentBlockName) ? (
							<>
								<AdvancedNumberControl
									className='maxi-typography-control__order'
									label={__('Order', 'maxi-blocks')}
									enableUnit={false}
									value={getLastBreakpointAttribute({
										target: 'order',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val => {
										onChange({
											[`order-${breakpoint}`]: val,
										});
									}}
									min={0}
									max={12}
									step={1}
									onReset={() =>
										onChange({
											[`order-${breakpoint}`]: null,
											isReset: true,
										})
									}
								/>
								<AdvancedNumberControl
									className='maxi-typography-control__flex-grow'
									label={__('Flex-grow', 'maxi-blocks')}
									enableUnit={false}
									value={getLastBreakpointAttribute({
										target: 'flex-grow',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val => {
										onChange({
											[`flex-grow-${breakpoint}`]: val,
										});
									}}
									min={0}
									max={10}
									step={0.1}
									onReset={() =>
										onChange({
											[`flex-grow-${breakpoint}`]: null,
											isReset: true,
										})
									}
								/>
								<AdvancedNumberControl
									className='maxi-typography-control__flex-shrink'
									label={__('Flex-shrink', 'maxi-blocks')}
									enableUnit={false}
									value={getLastBreakpointAttribute({
										target: 'flex-shrink',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val => {
										onChange({
											[`flex-shrink-${breakpoint}`]: val,
										});
									}}
									min={0}
									max={10}
									step={0.1}
									onReset={() =>
										onChange({
											[`flex-shrink-${breakpoint}`]: null,
											isReset: true,
										})
									}
								/>
								<SelectControl
									label={__('Flex-basis', 'maxi-blocks')}
									className='maxi-typography-control__flex-basis'
									value={
										customFlexBasis
											? 'custom'
											: getLastBreakpointAttribute({
													target: 'flex-basis',
													breakpoint,
													attributes: props,
											  }) ?? ''
									}
									defaultValue={getDefaultAttribute(
										`flex-basis-${breakpoint}`
									)}
									onReset={() =>
										onChange({
											[`flex-basis-${breakpoint}`]:
												getDefaultAttribute(
													`flex-basis-${breakpoint}`
												),
											isReset: true,
										})
									}
									options={getOptions([
										'content',
										'max-content',
										'min-content',
										'fit-content',
										'custom',
									])}
									onChange={val => {
										if (val !== 'custom') {
											onChange({
												[`flex-basis-${breakpoint}`]:
													val,
											});
											setCustomFlexBasis(false);
										} else {
											setCustomFlexBasis(true);
										}
									}}
								/>

								{customFlexBasis && (
									<AdvancedNumberControl
										className='maxi-typography-control__custom-flex-basis'
										label={__(
											'Custom flex-basis',
											'maxi-blocks'
										)}
										enableUnit
										unit={getLastBreakpointAttribute({
											target: 'flex-basis-unit',
											breakpoint,
											attributes: props,
										})}
										onChangeUnit={val => {
											onChange({
												[`flex-basis-unit-${breakpoint}`]:
													val,
											});
										}}
										value={getLastBreakpointAttribute({
											target: 'flex-basis',
											breakpoint,
											attributes: props,
										})}
										onChangeValue={val => {
											onChange({
												[`flex-basis-${breakpoint}`]:
													toString(val),
											});
										}}
										minMaxSettings={{
											px: {
												min: 0,
												max: 9999,
											},
											em: {
												min: 0,
												max: 9999,
											},
											vw: {
												min: 0,
												max: 999,
											},
											'%': {
												min: 0,
												max: 100,
											},
										}}
										allowedUnits={['px', 'em', 'vw', '%']}
										onReset={() =>
											onChange({
												[`flex-basis-${breakpoint}`]:
													null,
												isReset: true,
											})
										}
									/>
								)}
							</>
						) : (
							<div className='maxi-warning-box'>
								{__(
									'The block should have a wrapper to use flex-child properties',
									'maxi-blocks'
								)}
							</div>
						),
					},
				]}
				depth={2}
				hasBorder
			/>
		</div>
	);
};

export default FlexSettingsControl;
