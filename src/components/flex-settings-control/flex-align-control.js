/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getOptions from './utils';
import { handleOnReset } from '../../extensions/attributes';

const FlexAlignControl = props => {
	const { breakpoint, onChange } = props;

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
					}) ?? ''
				}
				onReset={() =>
					onChange(
						handleOnReset({
							[`justify-content-${breakpoint}`]:
								getDefaultAttribute(
									`justify-content-${breakpoint}`
								),
						})
					)
				}
				options={getOptions([
					'flex-start',
					'flex-end',
					'center',
					'space-between',
					'space-around',
					'space-evenly',
				])}
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
					}) ?? ''
				}
				onReset={() =>
					onChange(
						handleOnReset({
							[`align-items-${breakpoint}`]: getDefaultAttribute(
								`align-items-${breakpoint}`
							),
						})
					)
				}
				options={getOptions([
					'flex-start',
					'flex-end',
					'center',
					'stretch',
					'baseline',
				])}
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
