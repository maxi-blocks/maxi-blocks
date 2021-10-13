/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import BaseControl from '../base-control';
import Button from '../button';

import { Range } from 'react-range';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { reset } from '../../icons';

/**
 * Component
 */
const RangeSliderControl = props => {
	const {
		label,
		className,
		placeholder = '',
		min = 0,
		max = 999,
		step = 1,
		defaultValues = '',
		values,
		onChange,
		disableReset = false,
		onReset,
	} = props;

	const classes = classnames('maxi-advanced-number-control', className);

	const rangeSliderControlId = `maxi-advanced-number-control__${useInstanceId(
		RangeSliderControl
	)}`;

	return (
		<BaseControl
			id={rangeSliderControlId}
			label={label}
			className={classes}
		>
			<Range
				label={label}
				step={step}
				min={min}
				max={max}
				values={values}
				onChange={values => onChange({ ...values })}
				renderTrack={({ props, children }) => (
					<div
						{...props}
						style={{
							...props.style,
							height: '2px',
							width: '100%',
							background: '#dddfe1',
						}}
					>
						{children}
					</div>
				)}
				renderThumb={({ props }) => (
					<div
						{...props}
						style={{
							...props.style,
							height: '16px',
							width: '16px',
							borderRadius: '50%',
							background: '#fff',
							border: '1px solid rgb(126, 137, 147)',
						}}
					/>
				)}
			/>
		</BaseControl>
	);
};

export default RangeSliderControl;
