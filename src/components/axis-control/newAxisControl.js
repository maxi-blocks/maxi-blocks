/**
 * WordPress dependencies
 */
const { useInstanceId } = wp.compose;
const { __, sprintf } = wp.i18n;
const { BaseControl, SelectControl, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../extensions/styles/getLastBrakpointValue';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNumber } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { reset, sync } from '../../icons';

/**
 * Component
 */
const AxisControlTest = props => {
	const {
		label,
		className,
		onChange,
		breakpoint = 'general',
		disableAuto = false,
		allowedUnits = ['px', 'em', 'vw', '%'],
		minMaxSettings = {
			px: {
				min: -999,
				max: 999,
			},
			em: {
				min: -999,
				max: 999,
			},
			vw: {
				min: -999,
				max: 999,
			},
			'%': {
				min: 0,
				max: 999,
			},
		},
		target,
		auxTarget = false,
	} = props;

	const instanceId = useInstanceId(AxisControlTest);

	const classes = classnames('maxi-axis-control', className);

	const inputsArray = ['top', 'right', 'bottom', 'left', 'unit', 'sync'];

	const getOptions = () => {
		const options = [];
		allowedUnits.includes('px') &&
			options.push({ label: 'PX', value: 'px' });
		allowedUnits.includes('em') &&
			options.push({ label: 'EM', value: 'em' });
		allowedUnits.includes('vw') &&
			options.push({ label: 'VW', value: 'vw' });
		allowedUnits.includes('%') && options.push({ label: '%', value: '%' });
		return options;
	};

	const getKey = key => {
		return `${target}-${key}${auxTarget ? `-${auxTarget}` : ''}`;
	};

	const getValue = key => {
		const inputValue = getLastBreakpointAttribute(
			getKey(key),
			breakpoint,
			props
		);

		if (!!Number(inputValue) || parseInt(inputValue, 10) === 0)
			return Number(inputValue);
		return inputValue;
	};

	const onReset = () => {
		const response = {};

		inputsArray.forEach(key => {
			response[`${getKey(key)}-${breakpoint}`] = getDefaultAttribute(
				`${getKey(key)}-${breakpoint}`
			);
		});

		onChange(response);
	};

	const onChangeSync = () => {
		onChange({
			[`${getKey('sync')}-${breakpoint}`]: !getLastBreakpointAttribute(
				getKey('sync'),
				breakpoint,
				props
			),
		});
	};

	const getDisplayValue = key => {
		const inputValue = getValue(key);

		if (!!Number(inputValue) || parseInt(inputValue) === 0)
			return Number(inputValue);

		return inputValue;
	};

	const currentUnit =
		getLastBreakpointAttribute(getKey('unit'), breakpoint) || 'px';

	const onChangeValue = (newValue, singleTarget) => {
		if (
			isNumber(newValue) &&
			getLastBreakpointAttribute(getKey('sync'), breakpoint, props)
		) {
			const response = {};

			inputsArray.forEach(key => {
				if (key !== 'sync' && key !== 'unit')
					response[
						`${target}-${key}${
							auxTarget ? `-${auxTarget}` : ''
						}-${breakpoint}`
					] = +newValue;
			});

			onChange(response);
		} else {
			onChange({
				[`${target}-${singleTarget}${
					auxTarget ? `-${auxTarget}` : ''
				}-${breakpoint}`]: newValue,
			});
		}
	};

	return (
		<div className={classes}>
			<BaseControl
				label={__(label, 'maxi-blocks')}
				className='maxi-axis-control__header'
			>
				<SelectControl
					className='maxi-axis-control__units'
					options={getOptions()}
					value={currentUnit}
					onChange={val =>
						onChange({
							[`${target}-unit${
								auxTarget ? `-${auxTarget}` : ''
							}-${breakpoint}`]: val,
						})
					}
				/>
				<Button
					className='components-maxi-control__reset-button'
					onClick={onReset}
					aria-label={sprintf(
						__('Reset %s settings', 'maxi-blocks'),
						label.toLowerCase()
					)}
					action='reset'
					type='reset'
				>
					{reset}
				</Button>
			</BaseControl>
			<div className='maxi-axis-control__content'>
				<div className='maxi-axis-control__content__item maxi-axis-control__content__item__top'>
					<p className='maxi-axis-control__content__item__label'>
						{__('Top', 'maxi-blocks')}
					</p>
					<input
						className='maxi-axis-control__content__item__input'
						type='number'
						placeholder={getValue('top') === 'auto' ? 'auto' : ''}
						value={getDisplayValue('top')}
						onChange={e => onChangeValue(+e.target.value, 'top')}
						aria-label={sprintf(__('%s Top', 'maxi-blocks'), label)}
						min={minMaxSettings[currentUnit].min}
						max={minMaxSettings[currentUnit].max}
					/>
					{!disableAuto && (
						<label
							className='maxi-axis-control__content__item__checkbox'
							htmlFor={`${instanceId}-top`}
						>
							<input
								type='checkbox'
								checked={getValue('top') === 'auto'}
								onChange={e => {
									const newValue = e.target.checked
										? 'auto'
										: '';
									onChangeValue(+newValue, 'top');
								}}
								id={`${instanceId}-top`}
							/>
							{__('auto', 'maxi-blocks')}
						</label>
					)}
				</div>
				<div className='maxi-axis-control__content__item maxi-axis-control__content__item__right'>
					<p className='maxi-axis-control__content__item__label'>
						{__('Right', 'maxi-blocks')}
					</p>
					<input
						className='maxi-axis-control__content__item__input'
						type='number'
						placeholder={getValue('right') === 'auto' ? 'auto' : ''}
						value={getDisplayValue('right')}
						onChange={e => onChangeValue(+e.target.value, 'right')}
						aria-label={sprintf(
							__('%s Right', 'maxi-blocks'),
							label
						)}
						min={minMaxSettings[currentUnit].min}
						max={minMaxSettings[currentUnit].max}
					/>
					{!disableAuto && (
						<label
							className='maxi-axis-control__content__item__checkbox'
							htmlFor={`${instanceId}-right`}
						>
							<input
								type='checkbox'
								checked={getValue('right') === 'auto'}
								onChange={e => {
									const newValue = e.target.checked
										? 'auto'
										: '';
									onChangeValue(+newValue, 'right');
								}}
								id={`${instanceId}-right`}
							/>
							{__('auto', 'maxi-blocks')}
						</label>
					)}
				</div>
				<div className='maxi-axis-control__content__item maxi-axis-control__content__item__bottom'>
					<p className='maxi-axis-control__content__item__label'>
						{__('Bottom', 'maxi-blocks')}
					</p>
					<input
						className='maxi-axis-control__content__item__input'
						type='number'
						placeholder={
							getValue('bottom') === 'auto' ? 'auto' : ''
						}
						value={getDisplayValue('bottom')}
						onChange={e => onChangeValue(+e.target.value, 'bottom')}
						aria-label={sprintf(
							__('%s Bottom', 'maxi-blocks'),
							label
						)}
						min={minMaxSettings[currentUnit].min}
						max={minMaxSettings[currentUnit].max}
					/>
					{!disableAuto && (
						<label
							className='maxi-axis-control__content__item__checkbox'
							htmlFor={`${instanceId}-bottom`}
						>
							<input
								type='checkbox'
								checked={getValue('bottom') === 'auto'}
								onChange={e => {
									const newValue = e.target.checked
										? 'auto'
										: '';
									onChangeValue(+newValue, 'bottom');
								}}
								id={`${instanceId}-bottom`}
							/>
							{__('auto', 'maxi-blocks')}
						</label>
					)}
				</div>
				<div className='maxi-axis-control__content__item maxi-axis-control__content__item__left'>
					<p className='maxi-axis-control__content__item__label'>
						{__('Left', 'maxi-blocks')}
					</p>
					<input
						className='maxi-axis-control__content__item__input'
						type='number'
						placeholder={getValue('left') === 'auto' ? 'auto' : ''}
						value={getDisplayValue('left')}
						onChange={e => onChangeValue(+e.target.value, 'left')}
						aria-label={sprintf(
							__('%s Left', 'maxi-blocks'),
							label
						)}
						min={minMaxSettings[currentUnit].min}
						max={minMaxSettings[currentUnit].max}
					/>
					{!disableAuto && (
						<label
							className='maxi-axis-control__content__item__checkbox'
							htmlFor={`${instanceId}-left`}
						>
							<input
								type='checkbox'
								checked={getValue('left') === 'auto'}
								onChange={e => {
									const newValue = e.target.checked
										? 'auto'
										: '';
									onChangeValue(+newValue, 'left');
								}}
								id={`${instanceId}-left`}
							/>
							{__('auto', 'maxi-blocks')}
						</label>
					)}
				</div>
				<div className='maxi-axis-control__content__item maxi-axis-control__content__item__sync'>
					<Tooltip
						text={
							getLastBreakpointAttribute(
								getKey('sync'),
								breakpoint,
								props
							)
								? __('Unsync', 'maxi-blocks')
								: __('Sync', 'maxi-blocks')
						}
					>
						<Button
							aria-label={__('Sync Units', 'maxi-blocks')}
							isPrimary={getLastBreakpointAttribute(
								getKey('sync'),
								breakpoint,
								props
							)}
							aria-pressed={getLastBreakpointAttribute(
								getKey('sync'),
								breakpoint,
								props
							)}
							onClick={onChangeSync}
							isSmall
						>
							{sync}
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default AxisControlTest;
