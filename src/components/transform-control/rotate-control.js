/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import ResetButton from '../reset-control';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Component
 */
const RotateControl = props => {
	const { x, y, z, defaultX, defaultY, defaultZ, onChange } = props;

	return (
		<div className='maxi-transform-control__rotate-control'>
			<div className='maxi-transform-control__rotate-control__item'>
				<BaseControl
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
						min={-360}
						max={360}
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(x) ? '' : x}
						min={-360}
						max={360}
						onChange={e => {
							if (e.target.value === '') {
								onChange(defaultX, y, z);
							} else {
								let value = +e.target.value;

								if (value > 360) value = 360;
								if (value < -360) value = -360;

								onChange(value, y, z);
							}
						}}
					/>
					<ResetButton
						className='components-maxi-control__reset-button'
						reset={() => onChange(defaultX, y, z)}
						action='reset'
						type='reset'
					/>
				</BaseControl>
			</div>
			<div className='maxi-transform-control__rotate-control__item'>
				<BaseControl
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
						min={-360}
						max={360}
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(y) ? '' : y}
						min={-360}
						max={360}
						onChange={e => {
							if (e.target.value === '') {
								onChange(x, defaultY, z);
							} else {
								let value = +e.target.value;

								if (value > 360) value = 360;
								if (value < -360) value = -360;

								onChange(x, value, z);
							}
						}}
					/>
					<ResetButton
						className='components-maxi-control__reset-button'
						reset={() => onChange(x, defaultY, z)}
						action='reset'
						type='reset'
					/>
				</BaseControl>
			</div>
			<div className='maxi-transform-control__rotate-control__item'>
				<BaseControl
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
						min={-360}
						max={360}
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(z) ? '' : z}
						min={-360}
						max={360}
						onChange={e => {
							if (e.target.value === '') {
								onChange(x, y, defaultZ);
							} else {
								let value = +e.target.value;

								if (value > 360) value = 360;
								if (value < -360) value = -360;

								onChange(x, y, value);
							}
						}}
					/>
					<ResetButton
						className='components-maxi-control__reset-button'
						reset={() => onChange(x, y, defaultZ)}
						action='reset'
						type='reset'
					/>
				</BaseControl>
			</div>
		</div>
	);
};

export default RotateControl;
