/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import Button from '../button';
import SelectControl from '../select-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getAttributeKey,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, capitalize, isNumber } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { reset, sync } from '../../icons';

/**
 * Component
 */
const AxisSync = props => {
	const { text, ariaLabel, isPrimary, ariaPressed, onClick } = props;

	return (
		<div className='maxi-axis-control__content__item__sync'>
			<Tooltip text={text}>
				<Button
					aria-label={ariaLabel}
					isPrimary={isPrimary}
					aria-pressed={ariaPressed}
					onClick={onClick}
					isSmall
				>
					{sync}
				</Button>
			</Tooltip>
		</div>
	);
};

const AxisInput = props => {
	const {
		placeholder,
		value,
		onChange,
		label,
		ariaLabel,
		min,
		max,
		disableAuto,
		checked,
		onChangeCheckbox,
	} = props;

	const instanceId = useInstanceId(AxisInput);

	return (
		<div
			className={`maxi-axis-control__content__item maxi-axis-control__content__item__${label}`}
		>
			<p className='maxi-axis-control__content__item__label'>
				{__(capitalize(label), 'maxi-blocks')}
			</p>
			<input
				className='maxi-axis-control__content__item__input'
				type={disableAuto || value !== 'auto' ? 'number' : null}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				aria-label={ariaLabel}
				min={min}
				max={max}
			/>
			{!disableAuto && (
				<label
					className='maxi-axis-control__content__item__checkbox'
					htmlFor={`${instanceId}-${label.toLowerCase()}`}
				>
					<input
						type='checkbox'
						checked={checked}
						onChange={onChangeCheckbox}
						id={`${instanceId}-${label.toLowerCase()}`}
					/>
					{__('auto', 'maxi-blocks')}
				</label>
			)}
		</div>
	);
};

const AxisControlContent = props => {
	const {
		label,
		getOptions,
		currentUnit,
		target,
		breakpoint,
		isHover,
		onChange,
		onReset,
		inputsArray,
		getLastBreakpointValue,
		getValue,
		onChangeValue,
		minMaxSettings,
		disableAuto,
		getKey,
		onChangeSync,
		isGeneral,
	} = props;

	return (
		<>
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
							[getAttributeKey(
								getKey('unit'),
								isHover,
								false,
								breakpoint
							)]: val,
							...(isGeneral && {
								[getAttributeKey(
									getKey('unit'),
									isHover,
									false,
									'general'
								)]: val,
							}),
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
			<div className='maxi-axis-control__content maxi-axis-control__top-part'>
				<AxisInput
					label='top'
					placeholder={getLastBreakpointValue(inputsArray[0])}
					value={getValue(inputsArray[0], breakpoint)}
					onChange={e =>
						onChangeValue(
							e.target.value,
							inputsArray[0],
							isGeneral,
							breakpoint
						)
					}
					ariaLabel={sprintf(__('%s Top', 'maxi-blocks'), label)}
					min={minMaxSettings[currentUnit]?.min}
					max={minMaxSettings[currentUnit]?.max}
					disableAuto={disableAuto}
					checked={getLastBreakpointValue(inputsArray[0]) === 'auto'}
					onChangeCheckbox={e =>
						onChangeValue(
							e.target.checked ? 'auto' : '',
							inputsArray[0],
							isGeneral,
							breakpoint
						)
					}
				/>
				{(target === 'padding' || target === 'margin') && (
					<AxisSync
						text={
							getLastBreakpointAttribute(
								getKey('sync-horizontal'),
								breakpoint,
								props,
								isHover
							)
								? __('Unsync top and bottom', 'maxi-blocks')
								: __('Sync top and bottom', 'maxi-blocks')
						}
						ariaLabel={__(
							'Sync top and bottom Units',
							'maxi-blocks'
						)}
						isPrimary={getLastBreakpointAttribute(
							getKey('sync-vertical'),
							breakpoint,
							props,
							isHover
						)}
						ariaPressed={getLastBreakpointAttribute(
							getKey('sync-vertical'),
							breakpoint,
							props,
							isHover
						)}
						onClick={() =>
							onChangeSync('sync-vertical', breakpoint)
						}
					/>
				)}
				<AxisInput
					label='bottom'
					placeholder={getLastBreakpointValue(inputsArray[2])}
					value={getValue(inputsArray[2], breakpoint)}
					onChange={e =>
						onChangeValue(
							e.target.value,
							inputsArray[2],
							isGeneral,
							breakpoint
						)
					}
					ariaLabel={sprintf(__('%s Bottom', 'maxi-blocks'), label)}
					min={minMaxSettings[currentUnit]?.min}
					max={minMaxSettings[currentUnit]?.max}
					disableAuto={disableAuto}
					checked={getLastBreakpointValue(inputsArray[2]) === 'auto'}
					onChangeCheckbox={e =>
						onChangeValue(
							e.target.checked ? 'auto' : '',
							inputsArray[2],
							isGeneral,
							breakpoint
						)
					}
				/>
			</div>
			<div className='maxi-axis-control__middle-part'>
				<AxisSync
					text={
						getLastBreakpointAttribute(
							getKey('sync'),
							breakpoint,
							props,
							isHover
						)
							? __('Unsync all 4', 'maxi-blocks')
							: __('Sync all 4', 'maxi-blocks')
					}
					ariaLabel={__('Sync all 4 Units', 'maxi-blocks')}
					isPrimary={getLastBreakpointAttribute(
						getKey('sync'),
						breakpoint,
						props,
						isHover
					)}
					ariaPressed={getLastBreakpointAttribute(
						getKey('sync'),
						breakpoint,
						props,
						isHover
					)}
					onClick={() => onChangeSync('sync')}
				/>
			</div>
			<div className='maxi-axis-control__content maxi-axis-control__bottom-part'>
				<AxisInput
					label='left'
					placeholder={getLastBreakpointValue(inputsArray[3])}
					value={getValue(inputsArray[3], breakpoint)}
					onChange={e =>
						onChangeValue(
							e.target.value,
							inputsArray[3],
							isGeneral,
							breakpoint
						)
					}
					ariaLabel={sprintf(__('%s Left', 'maxi-blocks'), label)}
					min={minMaxSettings[currentUnit]?.min}
					max={minMaxSettings[currentUnit]?.max}
					disableAuto={disableAuto}
					checked={getLastBreakpointValue(inputsArray[3]) === 'auto'}
					onChangeCheckbox={e =>
						onChangeValue(
							e.target.checked ? 'auto' : '',
							inputsArray[3],
							isGeneral,
							breakpoint
						)
					}
				/>
				{(target === 'padding' || target === 'margin') && (
					<AxisSync
						text={
							getLastBreakpointAttribute(
								getKey('sync-horizontal'),
								breakpoint,
								props,
								isHover
							)
								? __('Unsync left and right', 'maxi-blocks')
								: __('Sync left and right', 'maxi-blocks')
						}
						ariaLabel={__(
							'Sync Left and Right Units',
							'maxi-blocks'
						)}
						isPrimary={getLastBreakpointAttribute(
							getKey('sync-horizontal'),
							breakpoint,
							props,
							isHover
						)}
						ariaPressed={getLastBreakpointAttribute(
							getKey('sync-horizontal'),
							breakpoint,
							props,
							isHover
						)}
						onClick={() => onChangeSync('sync-horizontal')}
					/>
				)}
				<AxisInput
					label='right'
					placeholder={getLastBreakpointValue(inputsArray[1])}
					value={getValue(inputsArray[1], breakpoint)}
					onChange={e =>
						onChangeValue(
							e.target.value,
							inputsArray[1],
							isGeneral,
							breakpoint
						)
					}
					ariaLabel={sprintf(__('%s Right', 'maxi-blocks'), label)}
					min={minMaxSettings[currentUnit]?.min}
					max={minMaxSettings[currentUnit]?.max}
					disableAuto={disableAuto}
					checked={getLastBreakpointValue(inputsArray[1]) === 'auto'}
					onChangeCheckbox={e =>
						onChangeValue(
							e.target.checked ? 'auto' : '',
							inputsArray[1],
							isGeneral,
							breakpoint
						)
					}
				/>
			</div>
		</>
	);
};

const AxisControl = props => {
	const {
		label = '',
		className,
		onChange,
		breakpoint = 'general',
		disableAuto = false,
		allowedUnits = ['px', 'em', 'vw', '%'],
		target,
		prefix = '',
		minMaxSettings = {
			px: {
				min: target === 'padding' ? 0 : -999,
				max: 999,
			},
			em: {
				min: target === 'padding' ? 0 : -999,
				max: 999,
			},
			vw: {
				min: target === 'padding' ? 0 : -999,
				max: 999,
			},
			'%': {
				min: 0,
				max: 999,
			},
		},
		auxTarget = false,
		isHover = false,
		inputsArray = [
			'top',
			'right',
			'bottom',
			'left',
			'unit',
			'sync',
			'sync-horizontal',
			'sync-vertical',
		],
		optionType = 'number',
	} = props;

	const classes = classnames(
		'maxi-axis-control',
		disableAuto && 'maxi-axis-control__disable-auto',
		className
	);

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
		return `${prefix}${target}-${key}${auxTarget ? `-${auxTarget}` : ''}`;
	};

	const getLastBreakpointValue = key => {
		const inputValue = getLastBreakpointAttribute(
			getKey(key),
			breakpoint,
			props,
			isHover,
			false,
			true
		);

		return inputValue;
	};

	const getValue = (key, customBreakpoint) => {
		const value =
			props[
				getAttributeKey(
					getKey(key),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			];

		if (isNumber(value) || value) return value;

		return '';
	};

	const onReset = () => {
		const response = {};

		inputsArray.forEach(key => {
			response[`${getKey(key)}-${breakpoint}${isHover ? '-hover' : ''}`] =
				getDefaultAttribute(
					`${getKey(key)}-${breakpoint}${isHover ? '-hover' : ''}`
				);
		});

		onChange(response);
	};

	const onChangeSync = (key, customBreakpoint) => {
		const response = {
			[`${getKey(key)}-${breakpoint}${isHover ? '-hover' : ''}`]:
				!getLastBreakpointAttribute(
					getKey(key),
					breakpoint,
					props,
					isHover
				),
		};

		const syncArray = ['sync-horizontal', 'sync-vertical'];
		if (syncArray.includes(key)) {
			[breakpoint, customBreakpoint].forEach(bp => {
				const syncKey = getAttributeKey(
					getKey('sync'),
					isHover,
					false,
					bp
				);
				const newSyncValue =
					bp === 'general' ? getDefaultAttribute(syncKey) : false;

				response[syncKey] = newSyncValue;
			});
		} else if (target === 'padding' || target === 'margin')
			syncArray.forEach(key => {
				[breakpoint, customBreakpoint].forEach(bp => {
					const newKey = getAttributeKey(
						getKey(key),
						isHover,
						false,
						bp
					);
					const newValue = getDefaultAttribute(newKey);

					response[newKey] = !!newValue;
				});
			});

		onChange(response);
	};

	const currentUnit =
		getLastBreakpointAttribute(
			getKey('unit'),
			breakpoint,
			props,
			isHover
		) || 'px';

	const onChangeValue = (
		val,
		singleTarget,
		isGeneral = false,
		customBreakpoint
	) => {
		let newValue = '';

		if (optionType === 'number') {
			if (isEmpty(val)) {
				newValue = val;
			} else {
				newValue = +val;
			}
		} else if (isEmpty(val)) {
			newValue = '';
		} else if (val === 'auto') {
			newValue = 'auto';
		} else {
			newValue = val;
		}

		if (target === 'padding' && newValue < 0) newValue = 0;

		const isSync = getLastBreakpointAttribute(
			getKey('sync'),
			customBreakpoint ?? breakpoint,
			props,
			isHover
		);
		const isSyncHor = getLastBreakpointAttribute(
			getKey('sync-horizontal'),
			customBreakpoint ?? breakpoint,
			props,
			isHover
		);
		const isSyncVer = getLastBreakpointAttribute(
			getKey('sync-vertical'),
			customBreakpoint ?? breakpoint,
			props,
			isHover
		);

		if (isSync) {
			const response = {};

			inputsArray.forEach(key => {
				if (
					key.includes('top') ||
					key.includes('left') ||
					key.includes('bottom') ||
					key.includes('right')
				) {
					response[
						`${prefix}${target}-${key}${
							auxTarget ? `-${auxTarget}` : ''
						}-${breakpoint}${isHover ? '-hover' : ''}`
					] = newValue;

					if (isGeneral)
						response[
							`${prefix}${target}-${key}${
								auxTarget ? `-${auxTarget}` : ''
							}-general${isHover ? '-hover' : ''}`
						] = newValue;
				}
			});

			onChange(response);
		} else if (
			(singleTarget === 'left' || singleTarget === 'right') &&
			isSyncHor
		) {
			const response = {};

			inputsArray.forEach(key => {
				if (key === 'left' || key === 'right') {
					response[
						getAttributeKey(
							getKey(key),
							isHover,
							false,
							customBreakpoint ?? breakpoint
						)
					] = newValue;

					if (isGeneral)
						response[
							getAttributeKey(
								getKey(key),
								isHover,
								false,
								'general'
							)
						] = newValue;
				}
			});

			onChange(response);
		} else if (
			(singleTarget === 'top' || singleTarget === 'bottom') &&
			isSyncVer
		) {
			const response = {};

			inputsArray.forEach(key => {
				if (key === 'top' || key === 'bottom') {
					response[
						getAttributeKey(
							getKey(key),
							isHover,
							false,
							customBreakpoint ?? breakpoint
						)
					] = newValue;

					if (isGeneral)
						response[
							getAttributeKey(
								getKey(key),
								isHover,
								false,
								'general'
							)
						] = newValue;
				}
			});

			onChange(response);
		} else {
			onChange({
				[`${prefix}${target}-${singleTarget}${
					auxTarget ? `-${auxTarget}` : ''
				}-${customBreakpoint ?? breakpoint}${isHover ? '-hover' : ''}`]:
					newValue,
				...(isGeneral && {
					[`${prefix}${target}-${singleTarget}${
						auxTarget ? `-${auxTarget}` : ''
					}-general${isHover ? '-hover' : ''}`]: newValue,
				}),
			});
		}
	};

	return (
		<div className={classes}>
			<ResponsiveTabsControl breakpoint={breakpoint}>
				<AxisControlContent
					label={label}
					getOptions={getOptions}
					currentUnit={currentUnit}
					target={target}
					breakpoint={breakpoint}
					isHover={isHover}
					onChange={onChange}
					onReset={onReset}
					inputsArray={inputsArray}
					getLastBreakpointValue={getLastBreakpointValue}
					getValue={getValue}
					onChangeValue={onChangeValue}
					minMaxSettings={minMaxSettings}
					disableAuto={disableAuto}
					getKey={getKey}
					onChangeSync={onChangeSync}
				/>
			</ResponsiveTabsControl>
		</div>
	);
};

export default AxisControl;
