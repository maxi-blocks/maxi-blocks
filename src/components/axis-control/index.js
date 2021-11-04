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
	getIsValid,
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
		label,
		getValue,
		getLastBreakpointValue,
		breakpoint,
		disableAuto,
		onChangeValue,
		isGeneral,
		minMaxSettings,
		currentUnit,
		type,
	} = props;

	const value = getValue(label, breakpoint);
	const lastValue = getLastBreakpointValue(label);
	const instanceId = useInstanceId(AxisInput);

	const getNewValueFromEmpty = e => {
		const {
			nativeEvent: { data, detail, inputType },
			target: { value: newValue },
		} = e;

		if (value !== '') return newValue;

		const typeofEvent =
			inputType === 'insertText' &&
			getIsValid(data, true) &&
			getIsValid(detail, true)
				? 'type'
				: 'click';

		switch (typeofEvent) {
			case 'click':
				return lastValue + (+newValue ? 1 : -1);
			case 'type':
			default:
				return newValue;
		}
	};

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
				placeholder={getLastBreakpointValue(label)}
				value={value}
				onChange={e => {
					const newValue = getNewValueFromEmpty(e);

					onChangeValue(newValue, label, isGeneral, breakpoint);
				}}
				aria-label={sprintf(
					__(`%s ${capitalize(label)}`, 'maxi-blocks'),
					type
				)}
				min={minMaxSettings[currentUnit]?.min}
				max={minMaxSettings[currentUnit]?.max}
			/>
			{!disableAuto && (
				<label
					className='maxi-axis-control__content__item__checkbox'
					htmlFor={`${instanceId}-${label.toLowerCase()}`}
				>
					<input
						type='checkbox'
						checked={getLastBreakpointValue(label) === 'auto'}
						onChange={e =>
							onChangeValue(
								e.target.checked ? 'auto' : '',
								label,
								isGeneral,
								breakpoint
							)
						}
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
		label: type,
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
				label={__(type, 'maxi-blocks')}
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
					onClick={() => onReset(isGeneral, breakpoint)}
					aria-label={sprintf(
						__('Reset %s settings', 'maxi-blocks'),
						type.toLowerCase()
					)}
					action='reset'
					type='reset'
				>
					{reset}
				</Button>
			</BaseControl>
			<div className='maxi-axis-control__content maxi-axis-control__top-part'>
				<AxisInput
					label={inputsArray[0]}
					getValue={getValue}
					getLastBreakpointValue={getLastBreakpointValue}
					breakpoint={breakpoint}
					disableAuto={disableAuto}
					onChangeValue={onChangeValue}
					isGeneral={isGeneral}
					minMaxSettings={minMaxSettings}
					currentUnit={currentUnit}
					type={type}
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
							onChangeSync('sync-vertical', isGeneral, breakpoint)
						}
					/>
				)}
				<AxisInput
					label={inputsArray[2]}
					getValue={getValue}
					getLastBreakpointValue={getLastBreakpointValue}
					breakpoint={breakpoint}
					disableAuto={disableAuto}
					onChangeValue={onChangeValue}
					isGeneral={isGeneral}
					minMaxSettings={minMaxSettings}
					currentUnit={currentUnit}
					type={type}
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
					onClick={() => onChangeSync('sync', isGeneral, breakpoint)}
				/>
			</div>
			<div className='maxi-axis-control__content maxi-axis-control__bottom-part'>
				<AxisInput
					label={inputsArray[3]}
					getValue={getValue}
					getLastBreakpointValue={getLastBreakpointValue}
					breakpoint={breakpoint}
					disableAuto={disableAuto}
					onChangeValue={onChangeValue}
					isGeneral={isGeneral}
					minMaxSettings={minMaxSettings}
					currentUnit={currentUnit}
					type={type}
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
						onClick={() =>
							onChangeSync(
								'sync-horizontal',
								isGeneral,
								breakpoint
							)
						}
					/>
				)}
				<AxisInput
					label={inputsArray[1]}
					getValue={getValue}
					getLastBreakpointValue={getLastBreakpointValue}
					breakpoint={breakpoint}
					disableAuto={disableAuto}
					onChangeValue={onChangeValue}
					isGeneral={isGeneral}
					minMaxSettings={minMaxSettings}
					currentUnit={currentUnit}
					type={type}
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
		target && `maxi-axis-control__${target}`,
		disableAuto && 'maxi-axis-control__disable-auto',
		className
	);

	const useResponsiveTabs = ['margin', 'padding'].includes(target);

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

	const onReset = (isGeneral, customBreakpoint) => {
		const response = {};

		inputsArray.forEach(key => {
			response[
				getAttributeKey(
					getKey(key),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			] = getDefaultAttribute(
				getAttributeKey(
					getKey(key),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			);

			if (isGeneral)
				response[
					getAttributeKey(getKey(key), isHover, false, 'general')
				] = getDefaultAttribute(
					getAttributeKey(getKey(key), isHover, false, 'general')
				);
		});

		onChange(response);
	};

	const onChangeSync = (key, isGeneral = false, customBreakpoint) => {
		const response = {
			[getAttributeKey(
				getKey(key),
				isHover,
				false,
				customBreakpoint ?? breakpoint
			)]: !getLastBreakpointAttribute(
				getKey(key),
				customBreakpoint ?? breakpoint,
				props,
				isHover
			),
			...(isGeneral && {
				[getAttributeKey(getKey(key), isHover, false, 'general')]:
					!getLastBreakpointAttribute(
						getKey(key),
						customBreakpoint ?? breakpoint,
						props,
						isHover
					),
			}),
		};

		const syncArray = ['sync-horizontal', 'sync-vertical'];
		const breakpointsArray = [
			customBreakpoint ?? breakpoint,
			...(isGeneral && ['general']),
		];

		if (syncArray.includes(key)) {
			breakpointsArray.forEach(bp => {
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
				breakpointsArray.forEach(bp => {
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
				[getAttributeKey(
					getKey(singleTarget),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)]: newValue,
				...(isGeneral && {
					[getAttributeKey(
						getKey(singleTarget),
						isHover,
						false,
						'general'
					)]: newValue,
				}),
			});
		}
	};

	return (
		<div className={classes}>
			{useResponsiveTabs && (
				<ResponsiveTabsControl breakpoint={breakpoint}>
					<AxisControlContent
						{...props}
						key='AxisControlContent__1'
						label={label}
						getOptions={getOptions}
						currentUnit={currentUnit}
						target={target}
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
			)}
			{!useResponsiveTabs && (
				<AxisControlContent
					{...props}
					key='AxisControlContent__2'
					label={label}
					getOptions={getOptions}
					currentUnit={currentUnit}
					target={target}
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
			)}
		</div>
	);
};

export default AxisControl;
