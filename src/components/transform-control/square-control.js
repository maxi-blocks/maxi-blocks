/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useCallback, useEffect } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import SelectControl from '@components/select-control';
import BlockResizer from '@components/block-resizer';
import { validateOriginValue, getIsValid } from '@extensions/styles';
import ResetButton from '@components/reset-control';
import validateNumberInput from '@components/advanced-number-control/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNaN, isNumber, round, toNumber } from 'lodash';

/**
 * Icons
 */
import { sync as syncIcon } from '@maxi-icons';

/**
 * Component
 */
const SquareControl = props => {
	const {
		x,
		xUnit = null,
		y,
		yUnit = null,
		breakpoint,
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
	const [tempX, changeTempX] = useState(0);
	const [tempY, changeTempY] = useState(0);

	const percentToPx = value => {
		return round((value / 100) * 40, 1);
	};

	const pxToPercent = value => {
		return round((value / 40) * 100, 1);
	};

	const pxToUnit = (value, unit) => {
		// converts a percentage value to the equivalent value in that unit
		switch (unit) {
			case 'em':
				return value / 12;
			case 'px':
				return value;
			case 'vw':
				return value / (window.innerWidth / 100);
			default:
				return (value / 40) * 100;
		}
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
				return '100';
			case 'drag':
				return '0';
			case 'origin':
				return validateOriginValue(value);
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
			case 'drag':
			case 'resize':
			case 'origin':
				onSave();
				break;
			default:
				return false;
		}
		return false;
	};

	const getNewValueFromEmpty = (e, currentValue, placeholder) => {
		const {
			nativeEvent: { inputType },
		} = e;

		const newValue = !isEmpty(e.target.value) ? Number(e.target.value) : '';

		if (isNumber(currentValue) && Number.isFinite(currentValue))
			return newValue;

		const typeofEvent = getIsValid(inputType, true) ? 'type' : 'click';

		switch (typeofEvent) {
			case 'click':
				return (
					(!isNaN(Number(placeholder)) && isEmpty(currentValue)
						? +placeholder
						: 0) + +newValue
				);
			case 'type':
			default:
				return newValue;
		}
	};

	const transformStr = useCallback(() => {
		return `translateX(${tempX}${xUnit}) translateY(${tempY}${yUnit})`;
	}, [tempX, xAxis, xUnit, tempY, yAxis, yUnit]);

	const isShowUnit = axis => !isNaN(toNumber(axis));

	useEffect(() => {
		if (!isMoving) {
			if (Math.round(tempX) !== xAxis && isNumber(xAxis))
				changeTempX(xAxis);
			if (Math.round(tempY) !== yAxis && isNumber(yAxis))
				changeTempY(yAxis);
		}
	}, [xAxis, yAxis, xUnit, yUnit]);

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

	let mouseOutDelay = null;

	return (
		<div className='maxi-transform-control__square-control'>
			<div
				className='maxi-transform-control__square-control__canvas'
				ref={canvasRef}
				onMouseMove={e => {
					e.preventDefault();

					if (isMoving) {
						// Change the tempX and tempY with floating point values and set x and y to the rounded values
						// The temp values should only change by 2 pixels at a time (convert the mouseX and mouseY according to unit)
						const xChange = pxToUnit(
							Number(clientX) - Number(e.clientX),
							xUnit
						);

						changeTempX(Number(tempX || 0) - xChange);

						changeXAxis(Math.round(tempX));
						changeClientX(Number(e.clientX));

						const yChange = pxToUnit(
							Number(clientY) - Number(e.clientY),
							yUnit
						);
						changeTempY(Number(tempY || 0) - yChange);
						changeYAxis(Math.round(tempY));

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
						deviceType={breakpoint}
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
						onMouseOut={e => {
							mouseOutDelay = setTimeout(() => {
								changeIsMoving(false);
							}, 500);
						}}
						onMouseOver={() => {
							clearTimeout(mouseOutDelay);
						}}
						style={{
							transform: transformStr(),
						}}
					/>
				)}
				{type === 'origin' && (
					<div className='maxi-transform-control__square-control__canvas__origin'>
						{[
							{
								xAxis: 'left',
								yAxis: 'top',
							},
							{
								xAxis: 'middle',
								yAxis: 'top',
							},
							{
								xAxis: 'right',
								yAxis: 'top',
							},
							{
								xAxis: 'left',
								yAxis: 'center',
							},
							{ xAxis: 'middle', yAxis: 'center' },
							{ xAxis: 'right', yAxis: 'center' },
							{ xAxis: 'left', yAxis: 'bottom' },
							{ xAxis: 'middle', yAxis: 'bottom' },
							{ xAxis: 'right', yAxis: 'bottom' },
						].map(
							({ xAxis: itemXAxis, yAxis: itemYAxis }, index) => (
								<Button
									// eslint-disable-next-line react/no-array-index-key
									key={index}
									aria-pressed={
										xAxis === itemXAxis &&
										yAxis === itemYAxis
											? 'active'
											: ''
									}
									className={classnames(
										'maxi-transform-control__square-control__canvas__origin',
										'maxi-transform-control__square-control__canvas__origin__button',
										`maxi-transform-control__square-control__canvas__origin__${itemXAxis}`,
										`maxi-transform-control__square-control__canvas__origin__${itemYAxis}`
									)}
									onClick={() => {
										changeXAxis(itemXAxis);
										changeYAxis(itemYAxis);
										onChange(
											itemXAxis,
											itemYAxis,
											xUnit,
											yUnit
										);
										onSave(
											itemXAxis,
											itemYAxis,
											xUnit,
											yUnit
										);
									}}
								/>
							)
						)}
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
							value={
								!isNumber(validateOriginValue(yAxis))
									? ''
									: validateOriginValue(yAxis)
							}
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
								placeholder={
									validateOriginValue(yAxis) === false
										? getPlaceholder(yAxis)
										: validateOriginValue(yAxis)
								}
								className='maxi-transform-control__square-control__y-control__value__input'
								value={
									isNumber(validateOriginValue(yAxis))
										? validateOriginValue(yAxis)
										: ''
								}
								onChange={e => {
									const newValue = getNewValueFromEmpty(
										e,
										validateOriginValue(yAxis),
										getPlaceholder(yAxis)
									);

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
								min={getMinMax()?.min}
								max={getMinMax()?.max}
							/>
							{isShowUnit(y) && (
								<SelectControl
									__nextHasNoMarginBottom
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
							value={
								!isNumber(validateOriginValue(xAxis))
									? ''
									: validateOriginValue(xAxis)
							}
							placeholder={getPlaceholder(xAxis)}
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
								placeholder={
									validateOriginValue(xAxis) === false
										? getPlaceholder(xAxis, true)
										: validateOriginValue(xAxis)
								}
								className='maxi-transform-control__square-control__x-control__value__input'
								value={
									isNumber(validateOriginValue(xAxis))
										? validateOriginValue(xAxis)
										: ''
								}
								onChange={e => {
									const newValue = getNewValueFromEmpty(
										e,
										validateOriginValue(xAxis),
										getPlaceholder(xAxis)
									);

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
								min={getMinMax()?.min}
								max={getMinMax()?.max}
							/>
							{isShowUnit(x) && (
								<SelectControl
									__nextHasNoMarginBottom
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
							value={
								!isNumber(yAxis)
									? getPlaceholder(yAxis, true)
									: yAxis
							}
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
								onKeyDown={e => {
									validateNumberInput(e);
								}}
								onChange={e => {
									const newValue = getNewValueFromEmpty(
										e,
										yAxis,
										getPlaceholder(yAxis)
									);

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
								min={getMinMax()?.min}
								max={getMinMax()?.max}
							/>
							{!!yUnit && (
								<SelectControl
									__nextHasNoMarginBottom
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
							value={
								!isNumber(xAxis) ? getPlaceholder(xAxis) : xAxis
							}
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
								onKeyDown={e => {
									validateNumberInput(e);
								}}
								onChange={e => {
									const newValue = getNewValueFromEmpty(
										e,
										xAxis,
										getPlaceholder(xAxis)
									);

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
								min={getMinMax()?.min}
								max={getMinMax()?.max}
							/>
							{!!xUnit && (
								<SelectControl
									__nextHasNoMarginBottom
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
