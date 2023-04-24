/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import BaseControl from '../base-control';
import SettingTabsControl from '../setting-tabs-control';
import SelectControl from '../select-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getAttributeKey,
	getAttributesValue,
} from '../../extensions/attributes';
import ResetButton from '../reset-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	isArray,
	isEmpty,
	isNaN,
	capitalize,
	isNumber,
	round,
	isNil,
	kebabCase,
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	marginSeparate as marginSeparateIcon,
	marginSyncAll as marginSyncAllIcon,
	marginSyncDirection as marginSyncDirectionIcon,
	paddingSeparate as paddingSeparateIcon,
	paddingSyncAll as paddingSyncAllIcon,
	paddingSyncDirection as paddingSyncDirectionIcon,
} from '../../icons';
import {
	axisDictionary,
	radiusAxisDictionary,
} from '../../extensions/attributes/constants';
import getCleanKey from '../../extensions/attributes/getCleanKey';

/**
 * Component
 */
const AxisInput = props => {
	const {
		label,
		target,
		singleTarget = null,
		getValue,
		getLastBreakpointValue,
		breakpoint,
		disableAuto,
		onChangeValue,
		minMaxSettings,
		currentUnit,
		enableAxisUnits,
		onChangeUnit,
		onReset,
	} = props;

	const value = getValue(target, breakpoint);
	const lastValue = getLastBreakpointValue(target);

	const unit = getLastBreakpointValue(`${target}.u`, breakpoint);

	return (
		<AdvancedNumberControl
			label={__(capitalize(label), 'maxi-blocks')}
			className={classnames(
				'maxi-axis-control__content__item',
				`maxi-axis-control__content__item__${kebabCase(label)}`
			)}
			placeholder={lastValue}
			value={value}
			onChangeValue={val => onChangeValue(val, singleTarget, breakpoint)}
			minMaxSettings={minMaxSettings}
			enableAuto={!disableAuto}
			autoLabel={__(`Auto ${label.toLowerCase()}`, 'maxi-blocks')}
			classNameAutoInput='maxi-axis-control__item-auto'
			enableUnit={enableAxisUnits}
			min={minMaxSettings[currentUnit].min || 0}
			max={minMaxSettings[currentUnit].max || 999}
			step={minMaxSettings[currentUnit].step || 1}
			onChangeUnit={val =>
				onChangeUnit(val, singleTarget, breakpoint, '', true)
			}
			unit={unit}
			onReset={onReset}
		/>
	);
};

const AxisContent = props => {
	const {
		getKey,
		breakpoint,
		isHover,
		inputsArray,
		getValue,
		getLastBreakpointValue,
		disableAuto,
		onChangeValue,
		minMaxSettings,
		currentUnit,
		disableSync = false,
		label: type,
		onReset,
		disableLeftRightMargin,
		onChangeUnit,
		enableAxisUnits,
	} = props;

	const sync = getLastBreakpointAttribute({
		target: getKey('.sy'),
		breakpoint,
		attributes: props,
		isHover,
	});

	const getLabel = type => {
		const dictionary = { ...axisDictionary, ...radiusAxisDictionary };
		return dictionary[type] || type;
	};

	return (
		<div>
			{(sync === 'all' || disableSync) && (
				<AxisInput
					label={type}
					target={inputsArray[0]}
					getValue={getValue}
					getLastBreakpointValue={getLastBreakpointValue}
					breakpoint={breakpoint}
					disableAuto={disableAuto}
					onChangeValue={onChangeValue}
					minMaxSettings={minMaxSettings}
					currentUnit={currentUnit}
					type={type}
					enableAxisUnits={enableAxisUnits}
					onChangeUnit={onChangeUnit}
					onReset={() => onReset({ reset: 'all' })}
				/>
			)}
			{sync === 'axis' && !disableSync && (
				<>
					<AxisInput
						label={`${getLabel(inputsArray[0])} / ${getLabel(
							inputsArray[2]
						)}`}
						target={inputsArray[0]}
						singleTarget='vertical'
						getValue={getValue}
						getLastBreakpointValue={getLastBreakpointValue}
						breakpoint={breakpoint}
						disableAuto={disableAuto}
						onChangeValue={onChangeValue}
						minMaxSettings={minMaxSettings}
						currentUnit={currentUnit}
						type={type}
						enableAxisUnits={enableAxisUnits}
						onChangeUnit={onChangeUnit}
						onReset={() => onReset({ reset: 'vertical' })}
					/>
					{!disableLeftRightMargin && (
						<AxisInput
							label={`${getLabel(inputsArray[3])} / ${getLabel(
								inputsArray[1]
							)}`}
							target={inputsArray[1]}
							singleTarget='horizontal'
							getValue={getValue}
							getLastBreakpointValue={getLastBreakpointValue}
							breakpoint={breakpoint}
							disableAuto={disableAuto}
							onChangeValue={onChangeValue}
							minMaxSettings={minMaxSettings}
							currentUnit={currentUnit}
							type={type}
							enableAxisUnits={enableAxisUnits}
							onChangeUnit={onChangeUnit}
							onReset={() => onReset({ reset: 'horizontal' })}
						/>
					)}
				</>
			)}
			{sync === 'none' && !disableSync && (
				<>
					<AxisInput
						label={getLabel(inputsArray[0])}
						target={inputsArray[0]}
						singleTarget={inputsArray[0]}
						getValue={getValue}
						getLastBreakpointValue={getLastBreakpointValue}
						breakpoint={breakpoint}
						disableAuto={disableAuto}
						onChangeValue={onChangeValue}
						minMaxSettings={minMaxSettings}
						currentUnit={currentUnit}
						type={type}
						enableAxisUnits={enableAxisUnits}
						onChangeUnit={onChangeUnit}
						onReset={() => onReset({ reset: 'top' })}
					/>
					{!disableLeftRightMargin && (
						<AxisInput
							label={getLabel(inputsArray[1])}
							target={inputsArray[1]}
							singleTarget={inputsArray[1]}
							getValue={getValue}
							getLastBreakpointValue={getLastBreakpointValue}
							breakpoint={breakpoint}
							disableAuto={disableAuto}
							onChangeValue={onChangeValue}
							minMaxSettings={minMaxSettings}
							currentUnit={currentUnit}
							type={type}
							enableAxisUnits={enableAxisUnits}
							onChangeUnit={onChangeUnit}
							onReset={() => onReset({ reset: 'right' })}
						/>
					)}
					<AxisInput
						label={getLabel(inputsArray[2])}
						target={inputsArray[2]}
						singleTarget={inputsArray[2]}
						getValue={getValue}
						getLastBreakpointValue={getLastBreakpointValue}
						breakpoint={breakpoint}
						disableAuto={disableAuto}
						onChangeValue={onChangeValue}
						minMaxSettings={minMaxSettings}
						currentUnit={currentUnit}
						type={type}
						enableAxisUnits={enableAxisUnits}
						onChangeUnit={onChangeUnit}
						onReset={() => onReset({ reset: 'bottom' })}
					/>
					{!disableLeftRightMargin && (
						<AxisInput
							label={getLabel(inputsArray[3])}
							target={inputsArray[3]}
							singleTarget={inputsArray[3]}
							getValue={getValue}
							getLastBreakpointValue={getLastBreakpointValue}
							breakpoint={breakpoint}
							disableAuto={disableAuto}
							onChangeValue={onChangeValue}
							minMaxSettings={minMaxSettings}
							currentUnit={currentUnit}
							type={type}
							enableAxisUnits={enableAxisUnits}
							onChangeUnit={onChangeUnit}
							onReset={() => onReset({ reset: 'left' })}
						/>
					)}
				</>
			)}
			{disableSync && (
				<BaseControl className='maxi-axis-control__unit-header'>
					<ResetButton
						onReset={() =>
							onReset({ customBreakpoint: breakpoint })
						}
					/>
				</BaseControl>
			)}
		</div>
	);
};

const AxisControlContent = props => {
	const {
		label: type,
		getOptions,
		currentUnit,
		breakpoint,
		isHover,
		onChange,
		onReset,
		getKey,
		onChangeSync,
		minMaxSettings,
		inputsArray,
		disableSync = false,
		enableAxisUnits,
	} = props;

	const sync = getLastBreakpointAttribute({
		target: getKey('.sy'),
		breakpoint,
		attributes: props,
		isHover,
	});

	const getSyncLabel = () => {
		const label =
			type.toLowerCase() === 'border radius'
				? 'border radii'
				: type.toLowerCase();
		const textSeparate =
			label === 'border radius' ? 'separate' : 'separately';
		switch (sync) {
			case 'all':
				return type
					? __(`Set ${label} equal`, 'maxi-blocks')
					: __('Set equal', 'maxi-blocks');
			case 'axis':
				return type
					? __(`Set ${label} together`, 'maxi-blocks')
					: __('Set together', 'maxi-blocks');
			case 'none':
			default:
				return type
					? __(`Set ${label} ${textSeparate}`, 'maxi-blocks')
					: __('Set separate', 'maxi-blocks');
		}
	};

	const onChangeUnit = val => {
		const response = {};

		inputsArray.forEach(input => {
			if (
				input.includes('.t') ||
				input.includes('.l') ||
				input.includes('.b') ||
				input.includes('.r')
			) {
				const key = getAttributeKey(
					getKey(input),
					isHover,
					false,
					breakpoint
				);
				const value = getLastBreakpointAttribute({
					target: getKey(input),
					breakpoint,
					attributes: props,
					isHover,
				});

				if (!isNil(value) && isNumber(value))
					response[key] = round(
						value,
						minMaxSettings[currentUnit].step / 0.5
					);
			}
		});

		onChange({
			[getAttributeKey(getKey('.u'), isHover, false, breakpoint)]: val,
			...response,
		});
	};

	return (
		<>
			{!disableSync && (
				<>
					{!enableAxisUnits && (
						<BaseControl
							label={__(type, 'maxi-blocks')}
							className='maxi-axis-control__unit-header'
						>
							<SelectControl
								className='maxi-axis-control__units'
								hideLabelFromVision
								label={__('Unit', 'maxi-blocks')}
								options={getOptions()}
								value={currentUnit}
								onChange={onChangeUnit}
							/>
							<ResetButton
								onReset={() =>
									onReset({
										reset: 'unit',
										customBreakpoint: breakpoint,
									})
								}
							/>
						</BaseControl>
					)}
					<SettingTabsControl
						label={getSyncLabel()}
						type='buttons'
						className='maxi-axis-control__header'
						selected={sync}
						items={[
							{
								value: 'all',
								className: 'maxi-axis-control__sync-all',
								icon:
									type === 'Margin'
										? marginSyncAllIcon
										: paddingSyncAllIcon,
							},
							{
								value: 'axis',
								className: 'maxi-axis-control__sync-axis',
								icon:
									type === 'Margin'
										? marginSyncDirectionIcon
										: paddingSyncDirectionIcon,
							},
							{
								value: 'none',
								className: 'maxi-axis-control__sync-none',
								icon:
									type === 'Margin'
										? marginSeparateIcon
										: paddingSeparateIcon,
							},
						]}
						onChange={val => onChangeSync(val, breakpoint)}
					/>
					<AxisContent {...props} />
				</>
			)}
			{disableSync && <AxisContent {...props} />}
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
		noResponsiveTabs,
		prefix = '',
		minMaxSettings = {
			px: {
				min: target === '_p' ? 0 : -999,
				max: 999,
				step: 1,
			},
			em: {
				min: target === '_p' ? 0 : -999,
				max: 999,
				step: 0.1,
			},
			vw: {
				min: target === '_p' ? 0 : -999,
				max: 999,
				step: 0.1,
			},
			'%': {
				min: 0,
				max: 999,
				step: 0.1,
			},
		},
		isHover = false,
		inputsArray = [
			'.t',
			'.r',
			'.b',
			'.l',
			'.t.u',
			'.r.u',
			'.b.u',
			'.l.u',
			'.u',
		],
		optionType = 'number',
		disableSync = false,
		fullWidth,
		enableAxisUnits,
		defaultAttributes = null,
	} = props;

	const classes = classnames(
		'maxi-axis-control',
		target && `maxi-axis-control__${target}`,
		disableAuto && 'maxi-axis-control__disable-auto',
		className
	);

	const useResponsiveTabs =
		!noResponsiveTabs && ['_m', '_p'].includes(target);

	const disableLeftRightMargin = target === '_m' && fullWidth === 'full';

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

	const getKey = key => getCleanKey(`${prefix}${target}${key}`);

	const getLastBreakpointValue = key => {
		const inputValue = getLastBreakpointAttribute({
			target: getKey(key),
			breakpoint,
			attributes: props,
			isHover,
			forceSingle: false,
			avoidXXL: true,
		});

		return inputValue;
	};

	const getValue = (key, customBreakpoint) => {
		let value;

		if (breakpoint === 'general' || customBreakpoint === 'general') {
			const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

			value = getAttributesValue({
				target: getKey(key),
				props,
				isHover,
				breakpoint: baseBreakpoint,
			});
		}
		if (isNil(value)) {
			value = getAttributesValue({
				target: getKey(key),
				props,
				isHover,
				breakpoint: customBreakpoint ?? breakpoint,
			});
		}

		if (isNumber(value) || value) return value;

		return '';
	};

	const onReset = ({ customBreakpoint, reset }) => {
		const response = {
			isReset: true,
		};

		const attributesKeysFilter = rawKeys => {
			const keys = isArray(rawKeys) ? rawKeys : [rawKeys];

			const filteredResult = inputsArray.filter(input =>
				keys.some(
					key =>
						input === key ||
						(input.includes(key) && input.includes('.u'))
				)
			);

			return filteredResult;
		};

		const getValueByBreakpoint = (key, breakpoint) => {
			const attrLabel = getAttributeKey(
				getKey(key),
				isHover,
				false,
				breakpoint
			);

			const value =
				defaultAttributes && attrLabel in defaultAttributes
					? defaultAttributes[attrLabel]
					: getDefaultAttribute(attrLabel);

			return value;
		};

		const getDefaultValue = key => {
			let value;

			if (breakpoint === 'general' || customBreakpoint === 'general') {
				const baseBreakpoint =
					select('maxiBlocks').receiveBaseBreakpoint();
				value = getValueByBreakpoint(key, baseBreakpoint);
			}
			if (isNil(value))
				value = getValueByBreakpoint(
					key,
					customBreakpoint ?? breakpoint
				);

			return value;
		};

		const top = inputsArray[0];
		const right = inputsArray[1];
		const bottom = inputsArray[2];
		const left = inputsArray[3];

		const cases = {
			all: [top, bottom, left, right],
			vertical: [top, bottom],
			horizontal: [left, right],
			top,
			right,
			bottom,
			left,
			unit: ['.u'],
		};

		const attributesKeys = cases[reset]
			? attributesKeysFilter(cases[reset])
			: [...inputsArray];

		attributesKeys.forEach(key => {
			response[
				getAttributeKey(
					getKey(key),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			] = getDefaultValue(key);
		});

		onChange(response);
	};

	const onChangeSync = (value, customBreakpoint) => {
		const response = {
			[getAttributeKey(
				getKey('.sy'),
				isHover,
				false,
				customBreakpoint ?? breakpoint
			)]: value,
		};

		onChange(response);
	};

	const currentUnit =
		getLastBreakpointAttribute({
			target: getKey('.u'),
			breakpoint,
			attributes: props,
			isHover,
		}) || 'px';

	const onChangeValue = (
		val,
		singleTarget,
		customBreakpoint,
		prefix,
		isUnit = false
	) => {
		let newValue = '';
		if (optionType === 'number' && isNaN(val))
			if (isEmpty(val)) newValue = val;
			else newValue = +val;
		else if (isEmpty(val) && !isNumber(val)) newValue = '';
		else if (val === 'auto') newValue = 'auto';
		else if (optionType === 'string') newValue = val.toString();
		else newValue = val;

		if (target === '_p' && newValue < 0) newValue = 0;

		const sync = getLastBreakpointAttribute({
			target: getKey('.sy'),
			breakpoint,
			attributes: props,
			isHover,
		});

		let response = {};

		const isAllChange = keyStr => {
			let key = keyStr;
			if (isUnit && !key.includes('.u')) return false;
			if (isUnit) key = key.replace('.u', '');
			if (prefix) {
				return (
					key.includes(`${prefix}.t`) ||
					key.includes(`${prefix}.l`) ||
					key.includes(`${prefix}.b`) ||
					key.includes(`${prefix}.r`)
				);
			}
			return (
				(key.includes('.t') ||
					key.includes('.l') ||
					key.includes('.b') ||
					key.includes('.r')) &&
				!key.includes('.u')
			);
		};

		const isHorizontalChange = keyStr => {
			let key = keyStr;
			if (isUnit && !key.includes('.u')) return false;
			if (isUnit) key = key.replace('.u', '');
			if (prefix) {
				return [`${prefix}.l`, `${prefix}.r`, '.bl', '.tr'].includes(
					key
				);
			}
			return (
				['.l', '.r', '.bl', '.tr'].includes(key) && !key.includes('.u')
			);
		};

		const isVerticalChange = keyStr => {
			let key = keyStr;
			if (isUnit && !key.includes('.u')) return false;
			if (isUnit) key = key.replace('.u', '');
			if (prefix) {
				return [`${prefix}.t`, `${prefix}.b`, '.tl', '.br'].includes(
					key
				);
			}
			return (
				['.t', '.b', '.tl', '.br'].includes(key) && !key.includes('.u')
			);
		};

		switch (disableSync ? 'all' : sync) {
			case 'all': {
				inputsArray.forEach(key => {
					if (isAllChange(key)) {
						response[
							getAttributeKey(
								getKey(key),
								isHover,
								false,
								customBreakpoint ?? breakpoint
							)
						] = newValue;
					}
				});

				break;
			}
			case 'axis': {
				if (singleTarget === 'horizontal') {
					inputsArray.forEach(key => {
						if (isHorizontalChange(key)) {
							response[
								getAttributeKey(
									getKey(key),
									isHover,
									false,
									customBreakpoint ?? breakpoint
								)
							] = newValue;
						}
					});
				} else if (singleTarget === 'vertical') {
					inputsArray.forEach(key => {
						if (isVerticalChange(key)) {
							response[
								getAttributeKey(
									getKey(key),
									isHover,
									false,
									customBreakpoint ?? breakpoint
								)
							] = newValue;
						}
					});
				}

				break;
			}
			case 'none':
			default: {
				response = {
					...(prefix
						? {
								[getAttributeKey(
									getKey(`${singleTarget}${prefix}`),
									isHover,
									false,
									customBreakpoint ?? breakpoint
								)]: newValue,
						  }
						: {
								[getAttributeKey(
									getKey(`${singleTarget}`),
									isHover,
									false,
									customBreakpoint ?? breakpoint
								)]: newValue,
						  }),
				};

				break;
			}
		}

		onChange(response);
	};

	return (
		<div className={classes}>
			{useResponsiveTabs && (
				<ResponsiveTabsControl breakpoint={breakpoint} target={target}>
					<AxisControlContent
						{...props}
						key='AxisControlContent__responsive'
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
						disableLeftRightMargin={disableLeftRightMargin}
						getKey={getKey}
						onChangeSync={onChangeSync}
						onChangeUnit={onChangeValue}
						enableAxisUnits={enableAxisUnits}
					/>
				</ResponsiveTabsControl>
			)}
			{!useResponsiveTabs && (
				<AxisControlContent
					{...props}
					key='AxisControlContent__non-responsive'
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
					onChangeUnit={onChangeValue}
					enableAxisUnits={enableAxisUnits}
				/>
			)}
		</div>
	);
};

export default AxisControl;
