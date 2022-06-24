/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import Button from '../button';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Icons
 */
import { reset } from '../../icons';

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
								if (value < 0) value = 0;

								onChange(value, y, z);
							}
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => onChange(defaultX, y, z)}
						action='reset'
						type='reset'
					>
						{reset}
					</Button>
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
								if (value < 0) value = 0;

								onChange(x, value, z);
							}
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => onChange(x, defaultY, z)}
						action='reset'
						type='reset'
					>
						{reset}
					</Button>
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
								if (value < 0) value = 0;

								onChange(x, y, value);
							}
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => onChange(z, y, defaultZ)}
						action='reset'
						type='reset'
					>
						{reset}
					</Button>
				</BaseControl>
			</div>
		</div>
	);
};

export default RotateControl;
