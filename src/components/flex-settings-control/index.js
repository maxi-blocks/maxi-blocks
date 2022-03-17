/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
/**
 * Internal dependencies
 */
import TextControl from '../text-control';
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';

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
		clientId,
		breakpoint = 'general',
	} = props;

	const { getBlockParents, getBlockName } = select('core/block-editor');

	const getParentBlockName = getBlockName(
		getBlockParents(clientId)
			?.filter(id => id != clientId)
			?.slice(-1)
	);

	const wrapperBlocks = [
		'maxi-blocks/container-maxi',
		'maxi-blocks/row-maxi',
		'maxi-blocks/column-maxi',
		'maxi-blocks/group-maxi',
	];

	const classes = classnames('maxi-flex-settings--control', className);

	return (
		<div className={classes}>
			{wrapperBlocks.includes(name) && (
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
							onChange({ [`flex-wrap-${breakpoint}`]: val })
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
								label: __('column', 'maxi-blocks'),
								value: 'column',
							},
							{
								label: __('wrap', 'maxi-blocks'),
								value: 'wrap',
							},
						]}
						onChange={val =>
							onChange({ [`flex-flow-${breakpoint}`]: val })
						}
					/>
				</>
			)}
			{wrapperBlocks.includes(getParentBlockName) && (
				<>
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
			)}
		</div>
	);
};

export default FLexSettingsControl;
