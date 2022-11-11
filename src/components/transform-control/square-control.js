/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useCallback, useEffect } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../button';
import SelectControl from '../select-control';
import BlockResizer from '../block-resizer';
import { validateOriginValue } from '../../extensions/styles';
import ResetButton from '../reset-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNaN, isNumber, round, toNumber } from 'lodash';

/**
 * Icons
 */
import { sync as syncIcon } from '../../icons';

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
	const [xAxis, changeXAxis] = useState(x || '');
	const [yAxis, changeYAxis] = useState(y || '');
	const [xAxisUnit, changeXUnit] = useState(xUnit || '%');
	const [yAxisUnit, changeYUnit] = useState(yUnit || '%');
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

	const getPlaceholder = (value, isYAxis = false) => {
		switch (type) {
			case 'resize':
				return '100';
			case 'drag':
				return '0%';
			case 'origin':
				return isYAxis ? 'middle' : 'center';
			default:
				return false;
		}
	};

	const getMinMax = () => {
		switch (type) {
			case 'resize':
				return {
					min: '0',
					max: '300',
				};
			case 'drag':
				return {
					min: '-100',
					max: '100',
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
			case 'origin':
				onSave();
				break;
			default:
				return false;
		}
		return false;
	};
	const transformStr = useCallback(() => {
		return `translateX(${xAxis}${xUnit}) translateY(${yAxis}${yUnit})`;
	}, [xAxis, xUnit, yAxis, yUnit]);

	const isShowUnit = axis => !isNaN(toNumber(axis));

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

	useEffect(() => {
		changeXUnit(xUnit);
		changeYUnit(yUnit);
	}, [xUnit, yUnit]);

	return (
		<div className='maxi-transform-control__square-control'>
			<div
				className='maxi-transform-control__square-control__canvas'
				ref={canvasRef}
				onMouseMove={e => {
					e.preventDefault();

					if (isMoving) {
						changeXAxis(
							Number(xAxis || 0) -
								(Number(clientX) - Number(e.clientX)) * 2
						);
						changeClientX(Number(e.clientX));
						changeYAxis(
							Number(yAxis || 0) -
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
						enable={{
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
							onChange(
								pxToPercent(elt.style.width.replace('px', '')),
								pxToPercent(elt.style.height.replace('px', ''))
							);
						}}
						onResizeStop={(event, direction, elt) => {
							changeXAxis(
								pxToPercent(elt.style.width.replace('px', ''))
							);
							changeYAxis(
								pxToPercent(elt.style.height.replace('px', ''))
							);
							onSave(
								pxToPercent(elt.style.width.replace('px', '')),
								pxToPercent(elt.style.height.replace('px', ''))
							);
						}}
					/>
				)}
				{type === 'drag' && (
					<span
						className='maxi-transform-control__square-control__canvas__draggable'
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
						onMouseOut={() => {
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
								onChange('left', 'top', xUnit, yUnit);
								onSave('left', 'top', xUnit, yUnit);
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
								onChange('center', 'top', xUnit, yUnit);
								onSave('center', 'top', xUnit, yUnit);
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
								onChange('right', 'top', xUnit, yUnit);
								onSave('right', 'top', xUnit, yUnit);
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
								onChange('left', 'center', xUnit, yUnit);
								onSave('left', 'center', xUnit, yUnit);
							}}
						/>
						<Button
							aria-pressed={
								(xAxis === 'middle' && yAxis === 'center') ||
								(!xAxis && !yAxis)
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
								onChange('middle', 'center', xUnit, yUnit);
								onSave('middle', 'center', xUnit, yUnit);
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
								onChange('right', 'center', xUnit, yUnit);
								onSave('right', 'center', xUnit, yUnit);
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
								onChange('left', 'bottom', xUnit, yUnit);
								onSave('left', 'bottom', xUnit, yUnit);
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
								onChange('center', 'bottom', xUnit, yUnit);
								onSave('center', 'bottom', xUnit, yUnit);
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
								onChange('right', 'bottom', xUnit, yUnit);
								onSave('right', 'bottom', xUnit, yUnit);
							}}
						/>
					</div>
				)}
				<span className='maxi-transform-control__square-control__canvas__placeholder' />
			</div>
			{type === 'origin' && (
				<>
					<div className='maxi-transform-control__square-control__y-control'>
						<input
							type='range'
							className='maxi-transform-control__square-control__y-control__range'
							value={yAxis || ''}
							onChange={e => {
								const value = Number(e.target.value);

								if (!sync) {
									changeYAxis(value);
									onChange(
										`${xAxis}`,
										`${value}`,
										xUnit,
										yUnit
									);
									onSave(
										`${xAxis}`,
										`${value}`,
										xUnit,
										yUnit
									);
								} else {
									changeYAxis(value);
									changeXAxis(value);
									onChange(
										`${value}`,
										`${value}`,
										xUnit,
										yUnit
									);
									onSave(
										`${value}`,
										`${value}`,
										xUnit,
										yUnit
									);
								}
							}}
							min={getMinMax()?.min}
							max={getMinMax()?.max}
							step='.5'
						/>
						<div className='maxi-transform-control__square-control__y-control__value'>
							<input
								type='number'
								placeholder={getPlaceholder(yAxis, true)}
								className='maxi-transform-control__square-control__y-control__value__input'
								value={
									!isNumber(validateOriginValue(yAxis))
										? ''
										: validateOriginValue(yAxis)
								}
								onChange={e => {
									const newValue = !isEmpty(e.target.value)
										? validateOriginValue(e.target.value)
										: '';

									if (!sync) {
										changeYAxis(newValue);
										onChange(
											`${xAxis}`,
											`${newValue}`,
											xUnit,
											yUnit
										);
										onSave(
											`${xAxis}`,
											`${newValue}`,
											xUnit,
											yUnit
										);
									} else {
										changeYAxis(newValue);
										changeXAxis(newValue);
										onChange(
											`${newValue}`,
											`${newValue}`,
											xUnit,
											yUnit
										);
										onSave(
											`${newValue}`,
											`${newValue}`,
											xUnit,
											yUnit
										);
									}
								}}
							/>
							{isShowUnit(y) && (
								<SelectControl
									options={[
										{ label: 'PX', value: 'px' },
										{ label: 'EM', value: 'em' },
										{ label: 'VW', value: 'vw' },
										{ label: '%', value: '%' },
									]}
									value={yAxisUnit}
									onChange={val => {
										changeYUnit(val);
										changeYAxis(yAxis);
										changeXAxis(xAxis);
										onChange(xAxis, yAxis, xUnit, val);
										onSave(xAxis, yAxis, xUnit, val);
									}}
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
								const value = Number(e.target.value);

								if (!sync) {
									changeXAxis(value);
									onChange(
										`${value}`,
										`${yAxis}`,
										xUnit,
										yUnit
									);
									onSave(
										`${value}`,
										`${yAxis}`,
										xUnit,
										yUnit
									);
								} else {
									changeYAxis(value);
									changeXAxis(value);
									onChange(
										`${value}`,
										`${value}`,
										xUnit,
										yUnit
									);
									onSave(
										`${value}`,
										`${value}`,
										xUnit,
										yUnit
									);
								}
							}}
							min={getMinMax()?.min}
							max={getMinMax()?.max}
							step='.5'
						/>
						<div className='maxi-transform-control__square-control__x-control__value'>
							<input
								type='number'
								placeholder={getPlaceholder(xAxis)}
								className='maxi-transform-control__square-control__x-control__value__input'
								value={
									!isNumber(validateOriginValue(xAxis))
										? ''
										: validateOriginValue(xAxis)
								}
								onChange={e => {
									const newValue = !isEmpty(e.target.value)
										? validateOriginValue(e.target.value)
										: '';

									if (!sync) {
										changeXAxis(newValue);
										onChange(
											`${newValue}`,
											`${yAxis}`,
											xUnit,
											yUnit
										);
										onSave(
											`${newValue}`,
											`${yAxis}`,
											xUnit,
											yUnit
										);
									} else {
										changeYAxis(newValue);
										changeXAxis(newValue);
										onChange(
											`${newValue}`,
											`${newValue}`,
											xUnit,
											yUnit
										);
										onSave(
											`${newValue}`,
											`${newValue}`,
											xUnit,
											yUnit
										);
									}
								}}
							/>
							{isShowUnit(x) && (
								<SelectControl
									options={[
										{ label: 'PX', value: 'px' },
										{ label: 'EM', value: 'em' },
										{ label: 'VW', value: 'vw' },
										{ label: '%', value: '%' },
									]}
									value={xAxisUnit}
									onChange={val => {
										changeXUnit(val);
										changeYAxis(yAxis);
										changeXAxis(xAxis);
										onChange(xAxis, yAxis, val, yUnit);
										onSave(xAxis, yAxis, val, yUnit);
									}}
								/>
							)}
						</div>
					</div>
				</>
			)}
			{type !== 'origin' && (
				<>
					<div className='maxi-transform-control__square-control__y-control'>
						<input
							type='range'
							className='maxi-transform-control__square-control__y-control__range'
							value={yAxis || ''}
							onChange={e => {
								const value = Number(e.target.value);

								if (!sync) {
									changeYAxis(value);
									onChange(xAxis, value, xUnit, yUnit);
									onSave(xAxis, value, xUnit, yUnit);
								} else {
									changeYAxis(value);
									changeXAxis(value);
									onChange(value, value, xUnit, yUnit);
									onSave(value, value, xUnit, yUnit);
								}
							}}
							min={getMinMax()?.min}
							max={getMinMax()?.max}
							step='.5'
						/>
						<div className='maxi-transform-control__square-control__y-control__value'>
							<input
								type='number'
								placeholder={getPlaceholder(yAxis)}
								className='maxi-transform-control__square-control__y-control__value__input'
								value={!isNumber(yAxis) ? '' : yAxis}
								onChange={e => {
									const newValue = !isEmpty(e.target.value)
										? Number(e.target.value)
										: '';

									if (!sync) {
										changeYAxis(newValue);
										onChange(xAxis, newValue, xUnit, yUnit);
										onSave(xAxis, newValue, xUnit, yUnit);
									} else {
										changeYAxis(newValue);
										changeXAxis(newValue);
										onChange(
											newValue,
											newValue,
											xUnit,
											yUnit
										);
										onSave(
											newValue,
											newValue,
											xUnit,
											yUnit
										);
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
									value={yAxisUnit}
									onChange={val => {
										changeYUnit(val);
										changeYAxis(yAxis);
										changeXAxis(xAxis);
										onChange(xAxis, yAxis, xUnit, val);
										onSave(xAxis, yAxis, xUnit, val);
									}}
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
								const value = Number(e.target.value);

								if (!sync) {
									changeXAxis(value);
									onChange(value, yAxis, xUnit, yUnit);
									onSave(value, yAxis, xUnit, yUnit);
								} else {
									changeYAxis(value);
									changeXAxis(value);
									onChange(value, value, xUnit, yUnit);
									onSave(value, value, xUnit, yUnit);
								}
							}}
							min={getMinMax()?.min}
							max={getMinMax()?.max}
							step='.5'
						/>
						<div className='maxi-transform-control__square-control__x-control__value'>
							<input
								type='number'
								placeholder={getPlaceholder(xAxis)}
								className='maxi-transform-control__square-control__x-control__value__input'
								value={!isNumber(xAxis) ? '' : xAxis}
								onChange={e => {
									const newValue = !isEmpty(e.target.value)
										? Number(e.target.value)
										: '';

									if (!sync) {
										changeXAxis(newValue);
										onChange(newValue, yAxis, xUnit, yUnit);
										onSave(newValue, yAxis, xUnit, yUnit);
									} else {
										changeYAxis(newValue);
										changeXAxis(newValue);
										onChange(
											newValue,
											newValue,
											xUnit,
											yUnit
										);
										onSave(
											newValue,
											newValue,
											xUnit,
											yUnit
										);
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
									value={xAxisUnit}
									onChange={val => {
										changeXUnit(val);
										changeYAxis(yAxis);
										changeXAxis(xAxis);
										onChange(xAxis, yAxis, val, yUnit);
										onSave(xAxis, yAxis, val, yUnit);
									}}
								/>
							)}
						</div>
					</div>
				</>
			)}

			<div className='maxi-transform-control__square-control__sync'>
				{type !== 'drag' && (
					<Tooltip
						text={
							sync
								? __('Unsync', 'maxi-blocks')
								: __('Sync', 'maxi-blocks')
						}
					>
						<Button
							aria-label={__('Sync units', 'maxi-blocks')}
							isPrimary={sync}
							aria-pressed={sync}
							onClick={() => changeSync(!sync)}
						>
							{syncIcon}
						</Button>
					</Tooltip>
				)}
				<ResetButton onReset={onReset} />
			</div>
		</div>
	);
};

export default SquareControl;
