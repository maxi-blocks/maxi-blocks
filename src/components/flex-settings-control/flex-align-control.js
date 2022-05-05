/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';

const FlexAlignControl = props => {
	const { breakpoint, onChange } = props;

	return (
		<>
			<SelectControl
				label={__('Horizontal align (Justify Content)', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: 'justify-content',
					breakpoint,
					attributes: props,
				})}
				options={[
					{
						label: __('Flex-start', 'maxi-blocks'),
						value: 'flex-start',
					},
					{
						label: __('Flex-end', 'maxi-blocks'),
						value: 'flex-end',
					},
					{
						label: __('Center', 'maxi-blocks'),
						value: 'center',
					},
					{
						label: __('Space between', 'maxi-blocks'),
						value: 'space-between',
					},
					{
						label: __('Space around', 'maxi-blocks'),
						value: 'space-around',
					},
					{
						label: __('Space-evenly', 'maxi-blocks'),
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
				label={__('Vertical align (Align Items)', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: 'align-items',
					breakpoint,
					attributes: props,
				})}
				options={[
					{
						label: __('Flex-start', 'maxi-blocks'),
						value: 'flex-start',
					},
					{
						label: __('Flex-end', 'maxi-blocks'),
						value: 'flex-end',
					},
					{
						label: __('Center', 'maxi-blocks'),
						value: 'center ',
					},
					{
						label: __('Stretch', 'maxi-blocks'),
						value: 'stretch',
					},
					{
						label: __('Baseline', 'maxi-blocks'),
						value: 'baseline',
					},
				]}
				onChange={val =>
					onChange({
						[`align-items-${breakpoint}`]: val,
					})
				}
			/>
		</>
	);
};

export default FlexAlignControl;
