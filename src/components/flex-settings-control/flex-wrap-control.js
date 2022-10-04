/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import getOptions from './utils';

/**
 * Component
 */

const FlexWrapControl = props => {
	const { breakpoint, onChange } = props;

	return (
		<SelectControl
			label={__('Flex wrap', 'maxi-blocks')}
			className='maxi-flex-wrap-control'
			value={
				getLastBreakpointAttribute({
					target: 'flex-wrap',
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			options={getOptions(['nowrap', 'wrap', 'wrap-reverse'])}
			onChange={val =>
				onChange({
					[`flex-wrap-${breakpoint}`]: val,
				})
			}
		/>
	);
};

export default FlexWrapControl;
