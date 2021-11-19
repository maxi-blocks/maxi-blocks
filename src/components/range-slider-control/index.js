/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import Button from '../button';

// import { Range } from 'react-range';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and Icons
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
		defaultValues = [0, 50, 100],
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

	return (
		<BaseControl
			id={rangeSliderControlId}
			label={label}
			className={classes}
		>
			{!disableReset && (
				<Button
					className='components-maxi-control__reset-button'
					onClick={e => {
						e.preventDefault();
						onChange({ ...defaultValues });
					}}
					isSmall
					aria-label={sprintf(
						/* translators: %s: a textual label  */
						__('Reset %s settings', 'maxi-blocks'),
						label.toLowerCase()
					)}
					type='reset'
				>
					{reset}
				</Button>
			)}
			{/* <Range
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
				renderThumb={({ index, props }) => (
					<div {...props} style={{ ...props.style, top: '-17px' }}>
						<span>{values[index]}%</span>
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
					</div>
				)}
			/> */}
		</BaseControl>
	);
};

export default RangeSliderControl;
