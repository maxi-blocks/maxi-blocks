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
				label={__('Justify content horizontal', 'maxi-blocks')}
				className='maxi-flex-align-control__justify-content'
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
				label={__('Align items vertical', 'maxi-blocks')}
				className='maxi-flex-align-control__align-items'
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
