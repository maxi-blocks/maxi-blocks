/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, round } from 'lodash';

/**
 * Component
 */
const OpacityControl = props => {
	const {
		className,
		onChange,
		label,
		breakpoint,
		prefix = '',
		opacity,
	} = props;

	const classes = classnames('maxi-opacity-control', className);
	const opacityValue = getLastBreakpointAttribute(
		`${prefix}opacity`,
		breakpoint,
		props
	);

	return (
		<>
			{isEmpty(breakpoint) ? (
				<AdvancedNumberControl
					className={classes}
					label={`${
						!isEmpty(label) ? label : __('Opacity', 'maxi-blocks')
					}`}
					value={
						opacity !== undefined &&
						opacity !== '' &&
						opacity !== -1
							? round(opacity * 100, 2)
							: opacity === -1
							? ''
							: 100
					}
					onChangeValue={val => {
						onChange(
							val !== undefined && val !== ''
								? round(val / 100, 2)
								: -1
						);
					}}
					min={0}
					max={100}
					onReset={() => onChange('')}
				/>
			) : (
				<AdvancedNumberControl
					className={classes}
					label={`${
						!isEmpty(label) ? label : __('Opacity', 'maxi-blocks')
					}`}
					defaultValue={getDefaultAttribute(
						`${prefix}opacity-${breakpoint}`
					)}
					value={
						opacityValue !== undefined &&
						opacityValue !== '' &&
						opacityValue !== -1
							? round(opacityValue * 100, 2)
							: opacityValue === -1
							? ''
							: 100
					}
					onChangeValue={val =>
						onChange({
							[`${prefix}opacity-${breakpoint}`]:
								val !== undefined && val !== ''
									? round(val / 100, 2)
									: -1,
						})
					}
					min={0}
					max={100}
					onReset={() =>
						onChange({
							[`${prefix}opacity-${breakpoint}`]:
								getDefaultAttribute(
									`${prefix}opacity-${breakpoint}`
								),
						})
					}
					initialPosition={getDefaultAttribute(
						`${prefix}opacity-${breakpoint}`
					)}
				/>
			)}
		</>
	);
};

export default OpacityControl;
