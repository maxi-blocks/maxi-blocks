/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import SelectControl from '@components/select-control';
import Icon from '@components/icon';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import { applyEffect } from './scroll-effect-preview';
import { scrollTypesWithUnits } from '@extensions/styles/defaults/scroll';
import EFFECT_PROPERTIES from './effect-properties';

/**
 * External dependencies
 */
import ReactSlider from 'react-slider';
import classnames from 'classnames';
import { isArray } from 'lodash';

/**
 * Icons
 */
import { promptDelete } from '@maxi-icons';

/**
 * Component
 */
const ScrollEffectsUniqueControl = props => {
	const {
		type,
		className,
		values,
		onChange,
		breakpoint = 'general',
		uniqueID,
		isPreviewEnabled,
	} = props;

	const effectProperties = EFFECT_PROPERTIES[type];
	const isTypeWithUnit = scrollTypesWithUnits.includes(type);

	const zonesAttribute = getLastBreakpointAttribute({
		target: `scroll-${type}-zones`,
		breakpoint,
		attributes: values,
	});

	const unitAttribute =
		isTypeWithUnit &&
		getLastBreakpointAttribute({
			target: `scroll-${type}-unit`,
			breakpoint,
			attributes: values,
		});

	const [zones, setZones] = useState(Object.keys(zonesAttribute).map(Number));
	const [activeThumbIndex, setActiveThumbIndex] = useState(0);
	const [showAddButton, setShowAddButton] = useState(false);
	const [mouseY, setMouseY] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		setZones(Object.keys(zonesAttribute).map(Number));
	}, [zonesAttribute]);

	const handleSliderChange = rawValues => {
		const values = isArray(rawValues) ? rawValues : [rawValues];
		setZones(values);
	};

	const handleThumbClick = index => {
		setActiveThumbIndex(index);
	};

	const handleAddZoneClick = e => {
		const timelineRect = ref.current.getBoundingClientRect();
		const newZonePercentage = Math.round(
			((e.clientY - timelineRect.top) / timelineRect.height) * 100
		);
		const newZones = [...zones, newZonePercentage];
		newZones.sort((a, b) => a - b);

		const newZoneIndex = newZones.indexOf(newZonePercentage);
		const newZoneValue =
			newZoneIndex === 0 ? 0 : zonesAttribute[newZones[newZoneIndex - 1]];

		setZones(newZones);
		onChange({
			[`scroll-${type}-zones-${breakpoint}`]: {
				...zonesAttribute,
				[newZonePercentage]: newZoneValue,
			},
		});
		setActiveThumbIndex(newZoneIndex);
	};

	const handleMouseMove = e => {
		if (!ref.current) return;

		if (isDragging) {
			setShowAddButton(false);
			return;
		}

		const timelineRect = ref.current.getBoundingClientRect();
		const mouseY = e.clientY - timelineRect.top;

		setMouseY(mouseY);

		const isInsideSlider =
			e.clientX >= timelineRect.left &&
			e.clientX <= timelineRect.right &&
			e.clientY >= timelineRect.top &&
			e.clientY <= timelineRect.bottom;

		const isOverThumb = Array.from(
			ref.current.querySelectorAll(
				'.maxi-scroll-unique-control-slider__thumb'
			)
		).some(thumb => {
			const thumbRect = thumb.getBoundingClientRect();
			return e.clientY >= thumbRect.top && e.clientY <= thumbRect.bottom;
		});

		setShowAddButton(isInsideSlider && !isOverThumb);
	};

	const handleMouseLeave = () => {
		setShowAddButton(false);
	};

	const handleThumbInteractionStart = (_values, index) => {
		setActiveThumbIndex(index);
		setIsDragging(true);
	};

	const handleThumbInteractionEnd = rawValues => {
		const values = isArray(rawValues) ? rawValues : [rawValues];

		setIsDragging(false);

		const previousZonesValues = Object.values(zonesAttribute);

		const newZonesAttribute = values.reduce((acc, zone, i) => {
			acc[zone] = previousZonesValues[i];
			return acc;
		}, {});

		onChange({
			[`scroll-${type}-zones-${breakpoint}`]: newZonesAttribute,
		});
	};

	const handleThumbDelete = index => {
		const newZones = [...zones];
		newZones.splice(index, 1);
		setZones(newZones);
		if (index === activeThumbIndex) {
			setActiveThumbIndex(index === 0 ? 0 : index - 1);
		} else if (activeThumbIndex > index) {
			setActiveThumbIndex(activeThumbIndex - 1);
		}
		onChange({
			[`scroll-${type}-zones-${breakpoint}`]: newZones.reduce(
				(acc, zone) => {
					acc[zone] = zonesAttribute[zone];
					return acc;
				},
				{}
			),
		});
	};

	const getActiveThumbPercentage = () =>
		Object.keys(zonesAttribute)[activeThumbIndex];

	const getMinMaxValue = (value = unitAttribute, key) => {
		if (isTypeWithUnit) {
			return effectProperties.minMaxSettings[value][key];
		}

		return effectProperties[key];
	};

	const getMinValue = value => getMinMaxValue(value, 'min');

	const getMaxValue = value => getMinMaxValue(value, 'max');

	const getZonesUnderMinMaxLimits = (zones, unit) => {
		const min = getMinValue(unit);
		const max = getMaxValue(unit);

		return zones.reduce((acc, zone) => {
			acc[zone] = Math.min(Math.max(zonesAttribute[zone], min), max);
			return acc;
		}, {});
	};

	const classes = classnames(
		'maxi-advanced-number-control maxi-scroll-unique-control',
		className
	);

	return (
		<div className={classes}>
			{isTypeWithUnit && (
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Units', 'maxi-blocks')}
					value={unitAttribute}
					options={effectProperties.allowedUnits.map(unit => ({
						label: unit,
						value: unit,
					}))}
					onChange={val =>
						onChange({
							[`scroll-${type}-unit-${breakpoint}`]: val,
							[`scroll-${type}-zones-${breakpoint}`]:
								getZonesUnderMinMaxLimits(zones, val),
						})
					}
					onReset={() => {
						const newUnit = getDefaultAttribute(
							`scroll-${type}-unit-${breakpoint}`
						);
						onChange({
							[`scroll-${type}-unit-${breakpoint}`]: newUnit,
							[`scroll-${type}-zones-${breakpoint}`]:
								getZonesUnderMinMaxLimits(zones, newUnit),
							isReset: true,
						});
					}}
				/>
			)}
			<div
				ref={ref}
				className='maxi-scroll-unique-control__slider-wrapper'
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				<ReactSlider
					className='maxi-scroll-unique-control-slider'
					thumbClassName='maxi-scroll-unique-control-slider__thumb'
					trackClassName='maxi-scroll-unique-control-slider__track'
					value={zones}
					onChange={handleSliderChange}
					onBeforeChange={handleThumbInteractionStart}
					onAfterChange={handleThumbInteractionEnd}
					renderThumb={(props, state) => (
						<div
							{...props}
							className={`${props.className} ${
								state.index === activeThumbIndex
									? 'maxi-scroll-unique-control-slider__thumb--selected'
									: ''
							}`}
							onClick={() => handleThumbClick(state.index)}
						>
							<div className='maxi-scroll-unique-control-slider__thumb-label-wrapper'>
								<span className='maxi-scroll-unique-control-slider__thumb-label'>
									{effectProperties?.label}:{' '}
									{
										zonesAttribute[
											Object.keys(zonesAttribute)[
												state.index
											]
										]
									}
									{isTypeWithUnit
										? unitAttribute
										: effectProperties?.unitLabel}
								</span>
								{zones.length > 1 && (
									<div
										className='maxi-scroll-unique-control-slider__thumb-label-delete'
										onClick={e => {
											e.stopPropagation();
											handleThumbDelete(state.index);
										}}
									>
										<Icon icon={promptDelete} />
									</div>
								)}
							</div>
							<div className='maxi-scroll-unique-control-slider__thumb-value'>
								{state.valueNow}%
							</div>
						</div>
					)}
					orientation='vertical'
					pearling
					minDistance={1}
				/>
				{showAddButton && (
					<>
						<div
							className='maxi-scroll-unique-control-slider__divider'
							style={{ top: `${mouseY}px` }}
						/>
						<div
							className='maxi-scroll-unique-control-slider__add-button'
							style={{ top: `${mouseY}px` }}
							onClick={handleAddZoneClick}
						>
							+
						</div>
					</>
				)}
			</div>
			<AdvancedNumberControl
				label={__(effectProperties?.label, 'maxi-blocks')}
				value={zonesAttribute[getActiveThumbPercentage()]}
				onChangeValue={(val, meta) => {
					onChange({
						[`scroll-${type}-zones-${breakpoint}`]: {
							...zonesAttribute,
							[getActiveThumbPercentage()]:
								val !== undefined && val !== '' ? val : '',
						},
						meta,
					});
					isPreviewEnabled && applyEffect(type, uniqueID, val);
				}}
				min={getMinValue()}
				step={1}
				max={getMaxValue()}
				onReset={() => {
					const resetKey = getActiveThumbPercentage();
					const resetValue =
						activeThumbIndex === 0
							? Object.values(
									getDefaultAttribute(
										`scroll-${type}-zones-${breakpoint}`
									)
							  )[activeThumbIndex]
							: zonesAttribute[
									Object.keys(zonesAttribute)[
										activeThumbIndex - 1
									]
							  ];

					onChange({
						[`scroll-${type}-zones-${breakpoint}`]: {
							...zonesAttribute,
							[resetKey]: resetValue,
						},
						isReset: true,
					});

					isPreviewEnabled &&
						applyEffect(
							type,
							uniqueID,
							getDefaultAttribute(`scroll-${type}-general`)
						);
				}}
				initialPosition={getDefaultAttribute(`scroll-${type}-general`)}
			/>
		</div>
	);
};

export default ScrollEffectsUniqueControl;
