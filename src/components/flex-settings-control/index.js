/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import SettingTabsControl from '../setting-tabs-control';

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

	const [flexType, setflexType] = useState('flex-parent');

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
				label=''
				type='buttons'
				selected={flexType}
				fullWidthMode
				items={[
					{
						label: __('Flex-parent', 'maxi-blocks'),
						value: 'flex-parent',
					},
					{
						label: __('Flex-child', 'maxi-blocks'),
						value: 'flex-child',
					},
				]}
				onChange={val => setflexType(val)}
				depth={2}
				hasBorder
			/>
			{flexType === 'flex-parent' &&
				(wrapperBlocks.includes(name) ? (
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
									label: __('wrap-reverse', 'maxi-blocks'),
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
									label: __('row-reverse', 'maxi-blocks'),
									value: 'row-reverse',
								},
								{
									label: __('column', 'maxi-blocks'),
									value: 'column',
								},
								{
									label: __('column-reverse', 'maxi-blocks'),
									value: 'column-reverse',
								},
							]}
							onChange={val =>
								onChange({
									[`flex-direction-${breakpoint}`]: val,
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
									label: __('flex-start', 'maxi-blocks'),
									value: 'flex-start',
								},
								{
									label: __('flex-end', 'maxi-blocks'),
									value: 'flex-end',
								},
								{
									label: __('center', 'maxi-blocks'),
									value: 'center ',
								},
								{
									label: __('space-between', 'maxi-blocks'),
									value: 'space-between',
								},
								{
									label: __('space-around', 'maxi-blocks'),
									value: 'space-around',
								},
								{
									label: __('space-evenly', 'maxi-blocks'),
									value: 'space-evenly',
								},
							]}
							onChange={val =>
								onChange({
									[`justify-content-${breakpoint}`]: val,
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
									label: __('flex-start', 'maxi-blocks'),
									value: 'flex-start',
								},
								{
									label: __('flex-end', 'maxi-blocks'),
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
									label: __('baseline', 'maxi-blocks'),
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
									label: __('flex-start', 'maxi-blocks'),
									value: 'flex-start',
								},
								{
									label: __('flex-end', 'maxi-blocks'),
									value: 'flex-end',
								},
								{
									label: __('center', 'maxi-blocks'),
									value: 'center ',
								},
								{
									label: __('space-between', 'maxi-blocks'),
									value: 'space-between',
								},
								{
									label: __('space-around', 'maxi-blocks'),
									value: 'space-around',
								},
								{
									label: __('space-evenly', 'maxi-blocks'),
									value: 'space-evenly',
								},
								{
									label: __('stretch', 'maxi-blocks'),
									value: 'stretch ',
								},
								{
									label: __('baseline', 'maxi-blocks'),
									value: 'baseline',
								},
							]}
							onChange={val =>
								onChange({
									[`align-content-${breakpoint}`]: val,
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
							label={__('gap', 'maxi-blocks')}
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
						<TextControl
							label={__('row-gap', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'row-gap',
								breakpoint,
								attributes: props,
							})}
							onChange={val => {
								onChange({
									[`row-gap-${breakpoint}`]: val,
								});
							}}
						/>
						<TextControl
							label={__('column-gap', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'column-gap',
								breakpoint,
								attributes: props,
							})}
							onChange={val => {
								onChange({
									[`column-gap-${breakpoint}`]: val,
								});
							}}
						/>
					</>
				) : (
					<div className='maxi-warning-box'>
						{__(
							'The block should be wrapper to use flex-parent properties, use Flex-child instead',
							'maxi-blocks'
						)}
					</div>
				))}
			{flexType === 'flex-child' &&
				(wrapperBlocks.includes(getParentBlockName) ? (
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
						<TextControl
							label={__('Flex-grow', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'flex-grow',
								breakpoint,
								attributes: props,
							})}
							onChange={val => {
								onChange({
									[`flex-grow-${breakpoint}`]: val,
								});
							}}
						/>
						<TextControl
							label={__('flex-shrink', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'flex-shrink',
								breakpoint,
								attributes: props,
							})}
							onChange={val => {
								onChange({
									[`flex-shrink-${breakpoint}`]: val,
								});
							}}
						/>
						<TextControl
							label={__('flex-basis', 'maxi-blocks')}
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
				))}
		</div>
	);
};

export default FLexSettingsControl;
