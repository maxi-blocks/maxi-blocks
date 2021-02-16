/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button, BaseControl } = wp.components;
const { useState, useEffect } = wp.element;

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import { reset } from '../../icons';

/**
 * Component
 */
const RotateControl = props => {
	const { x, y, z, onChange } = props;

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
							let value = +e.target.value;

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
						value={xAxis}
						min={0}
						max={360}
						onChange={e => {
							let value = +e.target.value;

							if (value > 360) value = 360;
							if (value < 0) value = 0;

							const newValue = !isEmpty(value) ? value : '';

							changeXAxis(newValue);
							onChange(newValue, yAxis, zAxis);
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => {
							changeXAxis(0);
							onChange(0, yAxis, zAxis);
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
							let value = +e.target.value;

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
						value={yAxis}
						min={0}
						max={360}
						onChange={e => {
							let value = +e.target.value;

							if (value > 360) value = 360;
							if (value < 0) value = 0;

							const newValue = !isEmpty(value) ? value : '';
							changeYAxis(newValue);
							onChange(xAxis, newValue, zAxis);
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => {
							changeYAxis(0);
							onChange(xAxis, 0, zAxis);
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
							let value = +e.target.value;

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
						value={zAxis}
						min={0}
						max={360}
						onChange={e => {
							let value = +e.target.value;

							if (value > 360) value = 360;
							if (value < 0) value = 0;

							const newValue = !isEmpty(value) ? value : '';
							changeZAxis(newValue);
							onChange(xAxis, yAxis, newValue);
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => {
							changeZAxis(0);
							onChange(xAxis, yAxis, 0);
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
