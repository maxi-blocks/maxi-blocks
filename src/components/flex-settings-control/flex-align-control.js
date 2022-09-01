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

const FlexAlignControl = props => {
	const { breakpoint, onChange } = props;

	const alignValues = [
		'flex-start',
		'flex-end',
		'center',
		'space-between',
		'space-around',
		'space-evenly',
	];

	return (
		<>
			<SelectControl
				label={__('Justify content horizontally', 'maxi-blocks')}
				className='maxi-flex-align-control__justify-content'
				value={
					getLastBreakpointAttribute({
						target: 'justify-content',
						breakpoint,
						attributes: props,
					}) ?? 'none'
				}
				options={getOptions(alignValues)}
				onChange={val =>
					onChange({
						[`justify-content-${breakpoint}`]: val,
					})
				}
			/>
			<SelectControl
				label={__('Align items vertically', 'maxi-blocks')}
				className='maxi-flex-align-control__align-items'
				value={
					getLastBreakpointAttribute({
						target: 'align-items',
						breakpoint,
						attributes: props,
					}) ?? 'none'
				}
				options={getOptions(alignValues)}
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
