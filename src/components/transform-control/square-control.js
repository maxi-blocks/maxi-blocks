/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useRef, useCallback, useEffect } = wp.element;
const { Tooltip, Button, SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import BlockResizer from '../block-resizer';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isString, isNumber, round } from 'lodash';

/**
 * Icons
 */
import { reset, sync as syncIcon } from '../../icons';

/**
 * Component
 */
const SquareControl = props => {
	const {
		x,
		xUnit = null,
		y,
		yUnit = null,
		onChange,
		onSave,
		type = 'resize',
	} = props;

	const canvasRef = useRef(null);

	const [sync, changeSync] = useState(false);
	const [xAxis, changeXAxis] = useState(x);
	const [yAxis, changeYAxis] = useState(y);
	const [isMoving, changeIsMoving] = useState(false);
	const [clientX, changeClientX] = useState(0);
	const [clientY, changeClientY] = useState(0);

	const percentToPx = value => {
		return round((value / 100) * 40, 1);
	};

	const pxToPercent = value => {
		return round((value / 40) * 100, 1);
	};

	const getDefaultSize = () => {
		const width = isNumber(x) ? percentToPx(x) : 40;
		const height = isNumber(y) ? percentToPx(y) : 40;

		return {
			width: `${width}px`,
			height: `${height}px`,
		};
	};

	const getPlaceholder = value => {
		switch (type) {
			case 'resize':
				return '100%';
			case 'drag':
				return '0%';
			case 'origin':
				return isString(value) ? value : '';
			default:
				return false;
		}
	};

	const getMinMax = () => {
		switch (type) {
			case 'resize':
				return {
					min: '-100',
					max: '300',
				};
			case 'drag':
				return {
					min: '-200',
					max: '200',
				};
			case 'origin':
				return {
					min: '-200',
					max: '200',
				};
			default:
				return false;
		}
	};

	const onReset = () => {
		switch (type) {
			case 'resize':
			case 'drag':
				changeXAxis(0);
				changeYAxis(0);
				onSave('', '', '%', '%');
				break;
			case 'origin':
				changeXAxis('center');
				changeYAxis('center');
				break;
			default:
				return false;
		}
		return false;
	};
	const transformStr = useCallback(() => {
		return `translateX(${xAxis}${xUnit}) translateY(${yAxis}${yUnit})`;
	}, [xAxis, xUnit, yAxis, yUnit]);

	useEffect(() => {
		changeXAxis(x);
		changeYAxis(y);

		if (type === 'resize') {
			const node = document.querySelector(
				'.maxi-transform-control__square-control__canvas__resizer'
			);
			if (node) {
				const size = getDefaultSize();
				node.style.width = size.width;
				node.style.height = size.height;
			}
		}
	}, [x, y]);

	return (
		<div className='maxi-transform-control__square-control'>
			<div
				className='maxi-transform-control__square-control__canvas'
				ref={canvasRef}
				onMouseMove={e => {
					e.preventDefault();
					if (isMoving) {
						changeXAxis(
							Number(xAxis) -
								(Number(clientX) - Number(e.clientX)) * 2
						);
						changeClientX(Number(e.clientX));
						changeYAxis(
							Number(yAxis) -
								(Number(clientY) - Number(e.clientY)) * 2
						);
						changeClientY(Number(e.clientY));
						onChange(xAxis, yAxis, xUnit, yUnit);
					}
				}}
			>
				{type === 'resize' && (
					<BlockResizer
						className={classnames(
							'maxi-block__resizer',
							' maxi-transform-control__square-control__canvas__resizer'
						)}
						defaultSize={getDefaultSize()}
						maxWidth='100%'
						maxHeight='100%'
						minWidth='-100%'
						minHeight='-100%'
						showHandle
						directions={{
							topRight: true,
							bottomRight: true,
							bottomLeft: true,
							topLeft: true,
						}}
						lockAspectRatio={sync}
						onResize={(event, direction, elt) => {
							changeXAxis(
								pxToPercent(elt.style.width.replace('px', ''))
							);
							changeYAxis(
								pxToPercent(elt.style.height.replace('px', ''))
							);
							onChange(xAxis, yAxis);
						}}
						onResizeStop={(event, direction, elt) => {
							changeXAxis(
								pxToPercent(elt.style.width.replace('px', ''))
							);
							changeYAxis(
								pxToPercent(elt.style.height.replace('px', ''))
							);
							onSave(xAxis, yAxis);
						}}
					/>
				)}
				{type === 'drag' && (
					<span
						className='maxi-transform-control__square-control__canvas__draggable'
						onMouseOut={() => {
							changeIsMoving(false);
							onSave(xAxis, yAxis, xUnit, yUnit);
						}}
						onMouseDown={e => {
							e.preventDefault();
							changeClientX(Number(e.clientX));
							changeClientY(Number(e.clientY));
							changeIsMoving(true);
						}}
						onMouseUp={() => {
							changeIsMoving(false);
							onSave(xAxis, yAxis, xUnit, yUnit);
						}}
						style={{
							transform: transformStr(),
						}}
					/>
				)}
				{type === 'origin' && (
					<div className='maxi-transform-control__square-control__canvas__origin'>
						<Button
							aria-pressed={
								xAxis === 'left' && yAxis === 'top'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__left',
								'maxi-transform-control__square-control__canvas__origin__top'
							)}
							onClick={() => {
								changeXAxis('left');
								changeYAxis('top');
								onChange('left', 'top');
							}}
						/>
						<Button
							aria-pressed={
								xAxis === 'center' && yAxis === 'top'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__middle',
								'maxi-transform-control__square-control__canvas__origin__top'
							)}
							onClick={() => {
								changeXAxis('middle');
								changeYAxis('top');
								onChange('center', 'top');
							}}
						/>
						<Button
							aria-pressed={
								xAxis === 'right' && yAxis === 'top'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__right',
								'maxi-transform-control__square-control__canvas__origin__top'
							)}
							onClick={() => {
								changeXAxis('right');
								changeYAxis('top');
								onChange('right', 'top');
							}}
						/>
						<Button
							aria-pressed={
								xAxis === 'left' && yAxis === 'center'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__left',
								'maxi-transform-control__square-control__canvas__origin__center'
							)}
							onClick={() => {
								changeXAxis('left');
								changeYAxis('center');
								onChange('left', 'center');
							}}
						/>
						<Button
							aria-pressed={
								xAxis === 'center' && yAxis === 'center'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__middle',
								'maxi-transform-control__square-control__canvas__origin__center'
							)}
							onClick={() => {
								changeXAxis('middle');
								changeYAxis('center');
								onChange('center', 'center');
							}}
						/>
						<Button
							aria-pressed={
								xAxis === 'right' && yAxis === 'center'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__right',
								'maxi-transform-control__square-control__canvas__origin__center'
							)}
							onClick={() => {
								changeXAxis('right');
								changeYAxis('center');
								onChange('right', 'center');
							}}
						/>
						<Button
							aria-pressed={
								xAxis === 'left' && yAxis === 'bottom'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__left',
								'maxi-transform-control__square-control__canvas__origin__bottom'
							)}
							onClick={() => {
								changeXAxis('left');
								changeYAxis('bottom');
								onChange('left', 'bottom');
							}}
						/>
						<Button
							aria-pressed={
								xAxis === 'center' && yAxis === 'bottom'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__middle',
								'maxi-transform-control__square-control__canvas__origin__bottom'
							)}
							onClick={() => {
								changeXAxis('middle');
								changeYAxis('bottom');
								onChange('center', 'bottom');
							}}
						/>
						<Button
							aria-pressed={
								xAxis === 'right' && yAxis === 'bottom'
									? 'active'
									: ''
							}
							className={classnames(
								'maxi-transform-control__square-control__canvas__origin',
								'maxi-transform-control__square-control__canvas__origin__button',
								'maxi-transform-control__square-control__canvas__origin__right',
								'maxi-transform-control__square-control__canvas__origin__bottom'
							)}
							onClick={() => {
								changeXAxis('right');
								changeYAxis('bottom');
								onChange('right', 'bottom');
							}}
						/>
					</div>
				)}
				<span className='maxi-transform-control__square-control__canvas__placeholder' />
			</div>
			<div className='maxi-transform-control__square-control__y-control'>
				<input
					type='range'
					className='maxi-transform-control__square-control__y-control__range'
					value={yAxis || ''}
					onChange={e => {
						type !== 'origin' && onSave(xAxis, yAxis, xUnit, yUnit);
						if (!sync) {
							changeYAxis(Number(e.target.value));
							onChange(xAxis, Number(e.target.value));
						} else {
							changeYAxis(Number(e.target.value));
							changeXAxis(Number(e.target.value));
							onChange(xAxis, Number(e.target.value));
							onChange(Number(e.target.value), yAxis);
						}
					}}
					min={getMinMax().min}
					max={getMinMax().max}
					step='.5'
				/>
				<div className='maxi-transform-control__square-control__y-control__value'>
					<input
						type='number'
						placeholder={getPlaceholder(yAxis)}
						className='maxi-transform-control__square-control__y-control__value__input'
						value={yAxis || ''}
						onChange={e => {
							const newValue = !isEmpty(e.target.value)
								? Number(e.target.value)
								: '';

							type !== 'origin' &&
								onSave(xAxis, yAxis, xUnit, yUnit);
							if (!sync) {
								changeYAxis(newValue);
								onChange(xAxis, newValue);
							} else {
								changeYAxis(newValue);
								changeXAxis(newValue);
								onChange(xAxis, newValue);
								onChange(newValue, yAxis);
							}
						}}
					/>
					{!!yUnit && (
						<SelectControl
							options={[
								{ label: 'PX', value: 'px' },
								{ label: 'EM', value: 'em' },
								{ label: 'VW', value: 'vw' },
								{ label: '%', value: '%' },
							]}
							value={yUnit}
							onChange={val => onChange(xAxis, yAxis, xUnit, val)}
						/>
					)}
				</div>
			</div>
			<div className='maxi-transform-control__square-control__x-control'>
				<input
					type='range'
					className='maxi-transform-control__square-control__x-control__range'
					value={xAxis || ''}
					onChange={e => {
						type !== 'origin' && onSave(xAxis, yAxis, xUnit, yUnit);
						if (!sync) {
							changeXAxis(Number(e.target.value));
							onChange(Number(e.target.value), yAxis);
						} else {
							changeYAxis(Number(e.target.value));
							changeXAxis(Number(e.target.value));
							onChange(xAxis, Number(e.target.value));
							onChange(Number(e.target.value), yAxis);
						}
					}}
					min={getMinMax().min}
					max={getMinMax().max}
					step='.5'
				/>
				<div className='maxi-transform-control__square-control__x-control__value'>
					<input
						type='number'
						placeholder={getPlaceholder(xAxis)}
						className='maxi-transform-control__square-control__x-control__value__input'
						value={xAxis || ''}
						onChange={e => {
							const newValue = !isEmpty(e.target.value)
								? Number(e.target.value)
								: '';

							type !== 'origin' &&
								onSave(xAxis, yAxis, xUnit, yUnit);
							if (!sync) {
								changeXAxis(newValue);
								onChange(newValue, yAxis);
							} else {
								changeYAxis(newValue);
								changeXAxis(newValue);
								onChange(xAxis, newValue);
								onChange(newValue, yAxis);
							}
						}}
					/>
					{!!xUnit && (
						<SelectControl
							options={[
								{ label: 'PX', value: 'px' },
								{ label: 'EM', value: 'em' },
								{ label: 'VW', value: 'vw' },
								{ label: '%', value: '%' },
							]}
							value={xUnit}
							onChange={val => onChange(xAxis, yAxis, val, yUnit)}
						/>
					)}
				</div>
			</div>

			<div className='maxi-transform-control__square-control__sync'>
				{type !== 'origin' && (
					<Tooltip
						text={
							sync
								? __('Unsync', 'maxi-blocks')
								: __('Sync', 'maxi-blocks')
						}
					>
						<Button
							aria-label={__('Sync Units', 'maxi-blocks')}
							isPrimary={sync}
							aria-pressed={sync}
							onClick={() => changeSync(!sync)}
							isSmall
						>
							{syncIcon}
						</Button>
					</Tooltip>
				)}
				<Button
					className='components-maxi-control__reset-button'
					onClick={onReset}
					// aria-label={sprintf(
					//     __('Reset %s settings', 'maxi-blocks'),
					//     value.label.toLowerCase()
					// )}
					action='reset'
					type='reset'
				>
					{reset}
				</Button>
			</div>
		</div>
	);
};

export default SquareControl;
