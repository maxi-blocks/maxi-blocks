/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import ResetButton from '@components/reset-control';
import validateNumberInput from '@components/advanced-number-control/utils';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Component
 */
const RotateControl = props => {
	const { x, y, z, defaultX, defaultY, defaultZ, onChange } = props;
	const min = -360;
	const max = 360;
	return (
		<div className='maxi-transform-control__rotate-control'>
			<div className='maxi-transform-control__rotate-control__item'>
				<BaseControl
					__nextHasNoMarginBottom
					label={__('X', 'maxi-blocks')}
					className='maxi-transform-control__rotate-control__item__label'
				>
					<input
						type='range'
						className='maxi-transform-control__rotate-control__item__range'
						value={x || 0}
						onChange={e => {
							const value = +e.target.value;

							onChange(value, y, z);
						}}
						min={min}
						max={max}
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(x) ? '' : x}
						min={min}
						max={max}
						onKeyDown={e => {
							validateNumberInput(e);
						}}
						onChange={e => {
							if (e.target.value === '') {
								onChange(defaultX, y, z);
							} else {
								let value = +e.target.value;

								if (value > max) value = max;
								if (value < min) value = min;

								onChange(value, y, z);
							}
						}}
					/>
					<ResetButton onReset={() => onChange(defaultX, y, z)} />
				</BaseControl>
			</div>
			<div className='maxi-transform-control__rotate-control__item'>
				<BaseControl
					__nextHasNoMarginBottom
					label={__('Y', 'maxi-blocks')}
					className='maxi-transform-control__rotate-control__item__label'
				>
					<input
						type='range'
						className='maxi-transform-control__rotate-control__item__range'
						value={y || 0}
						onChange={e => {
							const value = +e.target.value;

							onChange(x, value, z);
						}}
						min={min}
						max={max}
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(y) ? '' : y}
						min={min}
						max={max}
						onKeyDown={e => {
							validateNumberInput(e);
						}}
						onChange={e => {
							if (e.target.value === '') {
								onChange(x, defaultY, z);
							} else {
								let value = +e.target.value;

								if (value > max) value = max;
								if (value < min) value = min;

								onChange(x, value, z);
							}
						}}
					/>
					<ResetButton onReset={() => onChange(x, defaultY, z)} />
				</BaseControl>
			</div>
			<div className='maxi-transform-control__rotate-control__item'>
				<BaseControl
					__nextHasNoMarginBottom
					label={__('Z', 'maxi-blocks')}
					className='maxi-transform-control__rotate-control__item__label'
				>
					<input
						type='range'
						className='maxi-transform-control__rotate-control__item__range'
						value={z || 0}
						onChange={e => {
							const value = +e.target.value;

							onChange(x, y, value);
						}}
						min={min}
						max={max}
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(z) ? '' : z}
						min={min}
						max={max}
						onKeyDown={e => {
							validateNumberInput(e);
						}}
						onChange={e => {
							if (e.target.value === '') {
								onChange(x, y, defaultZ);
							} else {
								let value = +e.target.value;

								if (value > max) value = max;
								if (value < min) value = min;

								onChange(x, y, value);
							}
						}}
					/>
					<ResetButton onReset={() => onChange(x, y, defaultZ)} />
				</BaseControl>
			</div>
		</div>
	);
};

export default RotateControl;
