/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import SettingTabsControl from '../setting-tabs-control';
import AdvancedNumberControl from '../advanced-number-control';
/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const FLexSettingsControl = props => {
	const {
		className,
		onChange,
		name,
		breakpoint = 'general',
		getParentBlockName,
	} = props;

	const wrapperBlocks = [
		'maxi-blocks/container-maxi',
		'maxi-blocks/row-maxi',
		'maxi-blocks/column-maxi',
		'maxi-blocks/group-maxi',
	];

	const classes = classnames('maxi-flex-settings--control', className);

	return (
		<div className={classes}>
			<SettingTabsControl
				fullWidthMode
				items={[
					{
						label: __('Flex-parent', 'maxi-blocks'),
						value: 'flex-parent',
						content: wrapperBlocks.includes(name) ? (
							<>
								<SelectControl
									label={__('Flex wrap', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'flex-wrap',
										breakpoint,
										attributes: props,
									})}
									options={[
										{
											label: __('choose', 'maxi-blocks'),
											value: '',
										},
										{
											label: __('nowrap', 'maxi-blocks'),
											value: 'nowrap',
										},
										{
											label: __('wrap', 'maxi-blocks'),
											value: 'wrap',
										},
										{
											label: __(
												'wrap-reverse',
												'maxi-blocks'
											),
											value: 'wrap-reverse',
										},
									]}
									onChange={val =>
										onChange({
											[`flex-wrap-${breakpoint}`]: val,
										})
									}
								/>
								<SelectControl
									label={__('Flex direction', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'flex-direction',
										breakpoint,
										attributes: props,
									})}
									options={[
										{
											label: __('choose', 'maxi-blocks'),
											value: '',
										},
										{
											label: __('row', 'maxi-blocks'),
											value: 'row',
										},
										{
											label: __(
												'row-reverse',
												'maxi-blocks'
											),
											value: 'row-reverse',
										},
										{
											label: __('column', 'maxi-blocks'),
											value: 'column',
										},
										{
											label: __(
												'column-reverse',
												'maxi-blocks'
											),
											value: 'column-reverse',
										},
									]}
									onChange={val =>
										onChange({
											[`flex-direction-${breakpoint}`]:
												val,
										})
									}
								/>
								<SelectControl
									label={__('Justify Content', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'justify-content',
										breakpoint,
										attributes: props,
									})}
									options={[
										{
											label: __('choose', 'maxi-blocks'),
											value: '',
										},
										{
											label: __(
												'flex-start',
												'maxi-blocks'
											),
											value: 'flex-start',
										},
										{
											label: __(
												'flex-end',
												'maxi-blocks'
											),
											value: 'flex-end',
										},
										{
											label: __('center', 'maxi-blocks'),
											value: 'center ',
										},
										{
											label: __(
												'space-between',
												'maxi-blocks'
											),
											value: 'space-between',
										},
										{
											label: __(
												'space-around',
												'maxi-blocks'
											),
											value: 'space-around',
										},
										{
											label: __(
												'space-evenly',
												'maxi-blocks'
											),
											value: 'space-evenly',
										},
									]}
									onChange={val =>
										onChange({
											[`justify-content-${breakpoint}`]:
												val,
										})
									}
								/>
								<SelectControl
									label={__('Align items', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'align-items',
										breakpoint,
										attributes: props,
									})}
									options={[
										{
											label: __('choose', 'maxi-blocks'),
											value: '',
										},
										{
											label: __(
												'flex-start',
												'maxi-blocks'
											),
											value: 'flex-start',
										},
										{
											label: __(
												'flex-end',
												'maxi-blocks'
											),
											value: 'flex-end',
										},
										{
											label: __('center', 'maxi-blocks'),
											value: 'center ',
										},
										{
											label: __('stretch', 'maxi-blocks'),
											value: 'stretch',
										},
										{
											label: __(
												'baseline',
												'maxi-blocks'
											),
											value: 'baseline',
										},
									]}
									onChange={val =>
										onChange({
											[`align-items-${breakpoint}`]: val,
										})
									}
								/>
								<SelectControl
									label={__('Align content', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'align-content',
										breakpoint,
										attributes: props,
									})}
									options={[
										{
											label: __('choose', 'maxi-blocks'),
											value: '',
										},
										{
											label: __(
												'flex-start',
												'maxi-blocks'
											),
											value: 'flex-start',
										},
										{
											label: __(
												'flex-end',
												'maxi-blocks'
											),
											value: 'flex-end',
										},
										{
											label: __('center', 'maxi-blocks'),
											value: 'center ',
										},
										{
											label: __(
												'space-between',
												'maxi-blocks'
											),
											value: 'space-between',
										},
										{
											label: __(
												'space-around',
												'maxi-blocks'
											),
											value: 'space-around',
										},
										{
											label: __(
												'space-evenly',
												'maxi-blocks'
											),
											value: 'space-evenly',
										},
										{
											label: __('stretch', 'maxi-blocks'),
											value: 'stretch ',
										},
										{
											label: __(
												'baseline',
												'maxi-blocks'
											),
											value: 'baseline',
										},
									]}
									onChange={val =>
										onChange({
											[`align-content-${breakpoint}`]:
												val,
										})
									}
								/>
								<SelectControl
									label={__('Flex-flow', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'flex-flow',
										breakpoint,
										attributes: props,
									})}
									options={[
										{
											label: __('choose', 'maxi-blocks'),
											value: '',
										},
										{
											label: __('column', 'maxi-blocks'),
											value: 'column',
										},
										{
											label: __('wrap', 'maxi-blocks'),
											value: 'wrap',
										},
									]}
									onChange={val =>
										onChange({
											[`flex-flow-${breakpoint}`]: val,
										})
									}
								/>
								<TextControl
									label={__('Gap', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'gap',
										breakpoint,
										attributes: props,
									})}
									onChange={val => {
										onChange({
											[`gap-${breakpoint}`]: val,
										});
									}}
								/>
								<AdvancedNumberControl
									className='maxi-typography-control__size'
									label={__('Row-gap', 'maxi-blocks')}
									enableUnit
									unit={getLastBreakpointAttribute({
										target: 'row-gap-unit',
										breakpoint,
										attributes: props,
									})}
									onChangeUnit={val => {
										onChange({
											[`row-gap-unit-${breakpoint}`]: val,
										});
									}}
									value={getLastBreakpointAttribute({
										target: 'row-gap',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val => {
										onChange({
											[`row-gap-${breakpoint}`]: val,
										});
									}}
									minMaxSettings={{
										px: {
											min: 0,
											max: 999,
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
											max: 100,
										},
									}}
									allowedUnits={['px', 'em', 'vw', '%']}
									onReset={() =>
										onChange({
											[`row-gap-${breakpoint}`]: null,
										})
									}
								/>
								<AdvancedNumberControl
									className='maxi-typography-control__size'
									label={__('Column-gap', 'maxi-blocks')}
									enableUnit
									unit={getLastBreakpointAttribute({
										target: 'column-gap-unit',
										breakpoint,
										attributes: props,
									})}
									onChangeUnit={val => {
										onChange({
											[`column-gap-unit-${breakpoint}`]:
												val,
										});
									}}
									value={getLastBreakpointAttribute({
										target: 'column-gap',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val => {
										onChange({
											[`column-gap-${breakpoint}`]: val,
										});
									}}
									minMaxSettings={{
										px: {
											min: 0,
											max: 999,
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
											max: 100,
										},
									}}
									allowedUnits={['px', 'em', 'vw', '%']}
									onReset={() =>
										onChange({
											[`column-gap-${breakpoint}`]: null,
										})
									}
								/>
							</>
						) : (
							<div className='maxi-warning-box'>
								{__(
									'The block should be wrapper to use flex-parent properties, use Flex-child instead',
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
								<TextControl
									label={__('Order', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'order',
										breakpoint,
										attributes: props,
									})}
									onChange={val => {
										onChange({
											[`order-${breakpoint}`]: val,
										});
									}}
								/>
								<AdvancedNumberControl
									className='maxi-typography-control__size'
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
										})
									}
								/>
								<AdvancedNumberControl
									className='maxi-typography-control__size'
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
										})
									}
								/>
								<TextControl
									label={__('Flex-basis', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: 'flex-basis',
										breakpoint,
										attributes: props,
									})}
									onChange={val => {
										onChange({
											[`flex-basis-${breakpoint}`]: val,
										});
									}}
								/>
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

export default FLexSettingsControl;
