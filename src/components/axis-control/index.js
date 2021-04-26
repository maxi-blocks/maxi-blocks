/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';
import {
	BaseControl,
	SelectControl,
	Button,
	Tooltip,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

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
		label = '',
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
		isHover = false,
		inputsArray = ['top', 'right', 'bottom', 'left', 'unit', 'sync'],
		optionType = 'number',
	} = props;

	const instanceId = useInstanceId(AxisControl);

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

	const getKey = key => {
		return `${target}-${key}${auxTarget ? `-${auxTarget}` : ''}`;
	};

	const getValue = key => {
		const inputValue = getLastBreakpointAttribute(
			getKey(key),
			breakpoint,
			props,
			isHover
		);

		return inputValue;
	};

	const onReset = () => {
		const response = {};

		inputsArray.forEach(key => {
			response[
				`${getKey(key)}-${breakpoint}${isHover ? '-hover' : ''}`
			] = getDefaultAttribute(
				`${getKey(key)}-${breakpoint}${isHover ? '-hover' : ''}`
			);
		});

		onChange(response);
	};

	const onChangeSync = () => {
		onChange({
			[`${getKey('sync')}-${breakpoint}${
				isHover ? '-hover' : ''
			}`]: !getLastBreakpointAttribute(
				getKey('sync'),
				breakpoint,
				props,
				isHover
			),
		});
	};

	const getDisplayValue = key => {
		return isNil(getValue(key)) ? '' : getValue(key);
	};

	const currentUnit =
		getLastBreakpointAttribute(
			getKey('unit'),
			breakpoint,
			props,
			isHover
		) || 'px';

	const onChangeValue = (val, singleTarget) => {
		let newValue = '';

		if (optionType === 'number') {
			if (isEmpty(val)) {
				newValue = val;
			} else {
				newValue = +val;
			}
		} else {
			if (isEmpty(val)) {
				newValue = '';
			} else if (val === 'auto') {
				newValue = 'auto';
			} else {
				newValue = val;
			}
		}

		if (
			getLastBreakpointAttribute(
				getKey('sync'),
				breakpoint,
				props,
				isHover
			)
		) {
			const response = {};

			inputsArray.forEach(key => {
				if (key !== 'sync' && key !== 'unit')
					response[
						`${target}-${key}${
							auxTarget ? `-${auxTarget}` : ''
						}-${breakpoint}${isHover ? '-hover' : ''}`
					] = newValue;
			});

			onChange(response);
		} else {
			onChange({
				[`${target}-${singleTarget}${
					auxTarget ? `-${auxTarget}` : ''
				}-${breakpoint}${isHover ? '-hover' : ''}`]: newValue,
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
							}-${breakpoint}${isHover ? '-hover' : ''}`]: val,
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
						placeholder={
							getValue(inputsArray[0]) === 'auto' ? 'auto' : ''
						}
						value={getDisplayValue(inputsArray[0])}
						onChange={e =>
							onChangeValue(e.target.value, inputsArray[0])
						}
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
								checked={getValue(inputsArray[0]) === 'auto'}
								onChange={e =>
									onChangeValue(
										e.target.checked ? 'auto' : '',
										inputsArray[0]
									)
								}
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
						placeholder={
							getValue(inputsArray[1]) === 'auto' ? 'auto' : ''
						}
						value={getDisplayValue(inputsArray[1])}
						onChange={e =>
							onChangeValue(e.target.value, inputsArray[1])
						}
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
								checked={getValue(inputsArray[1]) === 'auto'}
								onChange={e =>
									onChangeValue(
										e.target.checked ? 'auto' : '',
										inputsArray[1]
									)
								}
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
							getValue(inputsArray[2]) === 'auto' ? 'auto' : ''
						}
						value={getDisplayValue(inputsArray[2])}
						onChange={e =>
							onChangeValue(e.target.value, inputsArray[2])
						}
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
								checked={getValue(inputsArray[2]) === 'auto'}
								onChange={e =>
									onChangeValue(
										e.target.checked ? 'auto' : '',
										inputsArray[2]
									)
								}
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
						placeholder={
							getValue(inputsArray[3]) === 'auto' ? 'auto' : ''
						}
						value={getDisplayValue(inputsArray[3])}
						onChange={e =>
							onChangeValue(e.target.value, inputsArray[3])
						}
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
								checked={getValue(inputsArray[3]) === 'auto'}
								onChange={e =>
									onChangeValue(
										e.target.checked ? 'auto' : '',
										inputsArray[3]
									)
								}
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
								props,
								isHover
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
								props,
								isHover
							)}
							aria-pressed={getLastBreakpointAttribute(
								getKey('sync'),
								breakpoint,
								props,
								isHover
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
