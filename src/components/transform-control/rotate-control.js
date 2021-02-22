/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button, BaseControl } = wp.components;
const { useState, useEffect } = wp.element;

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

	const [xAxis, changeXAxis] = useState(x);
	const [yAxis, changeYAxis] = useState(y);
	const [zAxis, changeZAxis] = useState(z);

	useEffect(() => {
		changeXAxis(x);
		changeYAxis(y);
		changeZAxis(z);
	}, [x, y, z]);

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
						value={xAxis || 0}
						onChange={e => {
							const value = +e.target.value;

							changeXAxis(value);
							onChange(value, yAxis, zAxis);
						}}
						min={0}
						max={360}
						orient='vertical'
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(xAxis) ? '' : xAxis}
						min={0}
						max={360}
						onChange={e => {
							if (e.target.value === '') {
								changeXAxis(defaultX);
								onChange(defaultX, yAxis, zAxis);
							} else {
								let value = +e.target.value;

								if (value > 360) value = 360;
								if (value < 0) value = 0;

								changeXAxis(value);
								onChange(value, yAxis, zAxis);
							}
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => {
							changeXAxis(defaultX);
							onChange(defaultX, yAxis, zAxis);
						}}
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
						value={yAxis || 0}
						onChange={e => {
							const value = +e.target.value;

							changeYAxis(value);
							onChange(xAxis, value, zAxis);
						}}
						min={0}
						max={360}
						orient='vertical'
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(yAxis) ? '' : yAxis}
						min={0}
						max={360}
						onChange={e => {
							if (e.target.value === '') {
								changeYAxis(defaultY);
								onChange(xAxis, defaultY, zAxis);
							} else {
								let value = +e.target.value;

								if (value > 360) value = 360;
								if (value < 0) value = 0;

								changeYAxis(value);
								onChange(xAxis, value, zAxis);
							}
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => {
							changeYAxis(defaultY);
							onChange(xAxis, defaultY, zAxis);
						}}
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
						value={zAxis || 0}
						onChange={e => {
							const value = +e.target.value;

							changeZAxis(value);
							onChange(xAxis, yAxis, value);
						}}
						min={0}
						max={360}
						orient='vertical'
					/>
					<input
						type='number'
						placeholder='0deg'
						className='maxi-transform-control__rotate-control__item__input'
						value={isNil(zAxis) ? '' : zAxis}
						min={0}
						max={360}
						onChange={e => {
							if (e.target.value === '') {
								changeZAxis(defaultZ);
								onChange(xAxis, yAxis, defaultZ);
							} else {
								let value = +e.target.value;

								if (value > 360) value = 360;
								if (value < 0) value = 0;

								changeZAxis(value);
								onChange(xAxis, yAxis, value);
							}
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => {
							changeZAxis(defaultZ);
							onChange(xAxis, yAxis, defaultZ);
						}}
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
