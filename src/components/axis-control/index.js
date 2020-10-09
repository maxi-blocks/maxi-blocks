/**
 * WordPress dependencies
 */
const { useInstanceId } = wp.compose;
const { __, sprintf } = wp.i18n;
const { BaseControl, SelectControl, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { reset, sync } from '../../icons';

/**
 * Component
 */
const AxisControl = props => {
	const {
		values,
		defaultValues,
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
	} = props;

	const instanceId = useInstanceId(AxisControl);

	const value = !isObject(values) ? JSON.parse(values) : values;

	const defaultValue = !isObject(defaultValues)
		? JSON.parse(defaultValues)
		: defaultValues;

	const classes = classnames('maxi-axis-control', className);

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

	const getKey = (obj, target) => {
		return Object.keys(obj)[target];
	};

	const getValue = key => {
		const inputValue = getLastBreakpointValue(
			value,
			[getKey(value[breakpoint], key)],
			breakpoint
		);

		if (!!Number(inputValue) || parseInt(inputValue, 10) === 0)
			return Number(inputValue);
		return inputValue;
	};

	const onReset = () => {
		for (const key of Object.keys(defaultValue[breakpoint])) {
			value[breakpoint][key] = defaultValue[breakpoint][key];
		}

		onChange(JSON.stringify(value));
	};

	const onChangeSync = () => {
		value[breakpoint].sync = !value[breakpoint].sync;
		onChange(JSON.stringify(value));
	};

	const getDisplayValue = key => {
		const inputValue = getValue(key);

		if (!!Number(inputValue) || parseInt(inputValue) === 0)
			return Number(inputValue);

		return inputValue;
	};

	const currentUnit = getLastBreakpointValue(value, 'unit', breakpoint);

	const onChangeValue = (newValue, target) => {
		const finalValue = newValue;

		if (value[breakpoint].sync === true) {
			for (const key of Object.keys(value[breakpoint])) {
				if (key !== 'sync' && key !== 'unit')
					value[breakpoint][key] =
						!!Number(finalValue) || parseInt(finalValue) === 0
							? Number(finalValue)
							: finalValue;
			}
		} else {
			value[breakpoint][getKey(value[breakpoint], target)] =
				!!Number(finalValue) || parseInt(finalValue) === 0
					? Number(finalValue)
					: finalValue;
		}

		onChange(JSON.stringify(value));
	};

	return (
		<div className={classes}>
			<BaseControl
				label={__(value.label, 'maxi-blocks')}
				className='maxi-axis-control__header'
			>
				<SelectControl
					className='maxi-axis-control__units'
					options={getOptions()}
					value={currentUnit}
					onChange={val => {
						value[breakpoint].unit = val;
						onChange(JSON.stringify(value));
					}}
				/>
				<Button
					className='components-maxi-control__reset-button'
					onClick={onReset}
					aria-label={sprintf(
						__('Reset %s settings', 'maxi-blocks'),
						value.label.toLowerCase()
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
						placeholder={getValue(0) === 'auto' ? 'auto' : ''}
						value={getDisplayValue(0)}
						onChange={e => onChangeValue(e.target.value, 0)}
						aria-label={sprintf(
							__('%s Top', 'maxi-blocks'),
							value.label
						)}
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
								checked={getValue(0) === 'auto'}
								onChange={e => {
									const newValue = e.target.checked
										? 'auto'
										: '';
									onChangeValue(newValue, 0);
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
						placeholder={getValue(1) === 'auto' ? 'auto' : ''}
						value={getDisplayValue(1)}
						onChange={e => onChangeValue(e.target.value, 1)}
						aria-label={sprintf(
							__('%s Right', 'maxi-blocks'),
							value.label
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
								checked={getValue(1) === 'auto'}
								onChange={e => {
									const newValue = e.target.checked
										? 'auto'
										: '';
									onChangeValue(newValue, 1);
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
						placeholder={getValue(2) === 'auto' ? 'auto' : ''}
						value={getDisplayValue(2)}
						onChange={e => onChangeValue(e.target.value, 2)}
						aria-label={sprintf(
							__('%s Bottom', 'maxi-blocks'),
							value.label
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
								checked={getValue(2) === 'auto'}
								onChange={e => {
									const newValue = e.target.checked
										? 'auto'
										: '';
									onChangeValue(newValue, 2);
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
						placeholder={getValue(3) === 'auto' ? 'auto' : ''}
						value={getDisplayValue(3)}
						onChange={e => onChangeValue(e.target.value, 3)}
						aria-label={sprintf(
							__('%s Left', 'maxi-blocks'),
							value.label
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
								checked={getValue(3) === 'auto'}
								onChange={e => {
									const newValue = e.target.checked
										? 'auto'
										: '';
									onChangeValue(newValue, 3);
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
							getLastBreakpointValue(value, 'sync', breakpoint)
								? __('Unsync', 'maxi-blocks')
								: __('Sync', 'maxi-blocks')
						}
					>
						<Button
							aria-label={__('Sync Units', 'maxi-blocks')}
							isPrimary={getLastBreakpointValue(
								value,
								'sync',
								breakpoint
							)}
							aria-pressed={getLastBreakpointValue(
								value,
								'sync',
								breakpoint
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

export default AxisControl;
