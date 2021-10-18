/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
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
		type,
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

	const classes = classnames(
		'maxi-advanced-number-control maxi-range-slider-control',
		className
	);

	const rangeSliderControlId = `maxi-advanced-number-control__${useInstanceId(
		RangeSliderControl
	)}`;

	const getDefaultValue = key => {
		switch (key) {
			case 0:
				return 0;
			case 1:
				return 50;
			case 2:
				return 100;
			default:
				return 0;
		}
	};

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
							marginBottom: '20px',
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
			{values.map((value, key) => {
				return (
					<input
						// eslint-disable-next-line react/no-array-index-key
						key={key}
						className='maxi-range-slider-control__content__item__input'
						type='number'
						//	placeholder={getDefaultValue(key)}
						value={value}
						onChange={val => {
							const newValues = [];
							newValues[key] = val.target.value;
							onChange({ ...values, ...newValues });
						}}
						min={0}
						max={100}
						step={0.1}
					/>
				);
			})}
		</BaseControl>
	);
};

export default RangeSliderControl;
