/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * Component
 */

const FlexWrapControl = props => {
	const { breakpoint, onChange } = props;

	return (
		<SelectControl
			label={__('Flex wrap', 'maxi-blocks')}
			value={getLastBreakpointAttribute({
				target: 'flex-wrap',
				breakpoint,
				attributes: props,
			})}
			options={[
				{
					label: __('Nowrap', 'maxi-blocks'),
					value: 'nowrap',
				},
				{
					label: __('Wrap', 'maxi-blocks'),
					value: 'wrap',
				},
				{
					label: __('Wrap-reverse', 'maxi-blocks'),
					value: 'wrap-reverse',
				},
			]}
			onChange={val =>
				onChange({
					[`flex-wrap-${breakpoint}`]: val,
				})
			}
		/>
	);
};

export default FlexWrapControl;
