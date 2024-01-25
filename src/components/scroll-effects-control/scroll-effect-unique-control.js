/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import AdvancedNumberControl from '../advanced-number-control';
import Icon from '../icon';
import { applyEffect } from './scroll-effect-preview';

/**
 * External dependencies
 */
import ReactSlider from 'react-slider';
import classnames from 'classnames';

/**
 * Icons
 */
import { promptDelete } from '../../icons';

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

	const getSpecialLabels = type => {
		const response = {};
		switch (type) {
			case 'vertical':
				response.label = 'Position (px)';
				response.attr = 'offset';
				response.min = -4000;
				response.max = 4000;
				break;
			case 'horizontal':
				response.label = 'Position (px)';
				response.attr = 'offset';
				response.min = -4000;
				response.max = 4000;
				break;
			case 'rotate':
				response.label = 'Angle (degrees)';
				response.attr = 'rotate';
				response.min = -360;
				response.max = 360;
				break;
			case 'scale':
				response.label = 'Scale (%)';
				response.attr = 'scale';
				response.min = 0;
				response.max = 1000;
				break;
			case 'fade':
				response.label = 'Opacity (%)';
				response.attr = 'opacity';
				response.min = 0;
				response.max = 100;
				break;
			case 'blur':
				response.label = 'Blur (px)';
				response.attr = 'blur';
				response.min = 0;
				response.max = 20;
				break;

			default:
				break;
		}
		return response;
	};

	const specialLabels = getSpecialLabels(type);

	const zonesAttribute = getLastBreakpointAttribute({
		target: `scroll-${type}-zones`,
		breakpoint,
		attributes: values,
	});

	const [zones, setZones] = useState(Object.keys(zonesAttribute).map(Number));
	const [activeThumbIndex, setActiveThumbIndex] = useState(0);
	const [showAddButton, setShowAddButton] = useState(false);
	const [mouseY, setMouseY] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const ref = useRef(null);

	const handleSliderChange = values => {
		setZones(values);
	};

	const handleThumbClick = index => {
		setActiveThumbIndex(index);
	};

	const handleAddZoneClick = e => {
		const timelineRect = ref.current.getBoundingClientRect();
		const newZoneValue = Math.round(
			((e.clientY - timelineRect.top) / timelineRect.height) * 100
		);
		const newZones = [...zones, newZoneValue];
		newZones.sort((a, b) => a - b);

		setZones(newZones);
		onChange({
			[`scroll-${type}-zones-${breakpoint}`]: {
				...zonesAttribute,
				[newZoneValue]: 0,
			},
		});
		setActiveThumbIndex(newZones.length - 1);
	};

	const handleMouseMove = e => {
		if (!ref.current) return;

		if (isDragging) {
			setShowAddButton(false);
			return;
		}

		const timelineRect = ref.current.getBoundingClientRect();
		const mouseY = e.clientY - timelineRect.top;

		const proximity = zones.some(zone => {
			const zonePosition = (zone / 100) * timelineRect.height;
			return Math.abs(mouseY - zonePosition) < 40;
		});

		setMouseY(mouseY);

		setShowAddButton(!proximity);
	};

	const handleMouseLeave = () => {
		setShowAddButton(false);
	};

	const handleThumbInteractionStart = (_values, index) => {
		setActiveThumbIndex(index);
		setIsDragging(true);
	};

	const handleThumbInteractionEnd = values => {
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

	const classes = classnames(
		'maxi-advanced-number-control maxi-scroll-unique-control',
		className
	);

	return (
		<div className={classes}>
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
									{specialLabels?.label}:{' '}
									{
										zonesAttribute[
											Object.keys(zonesAttribute)[
												state.index
											]
										]
									}
								</span>
								{state.index !== 0 &&
									state.index !== zones.length - 1 && (
										<div className='maxi-scroll-unique-control-slider__thumb-label-delete'>
											<Icon
												icon={promptDelete}
												onClick={() =>
													handleThumbDelete(
														state.index
													)
												}
											/>
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
				label={__(specialLabels?.label, 'maxi-blocks')}
				value={zonesAttribute[getActiveThumbPercentage()]}
				onChangeValue={val => {
					onChange({
						[`scroll-${type}-zones-${breakpoint}`]: {
							...zonesAttribute,
							[getActiveThumbPercentage()]:
								val !== undefined && val !== '' ? val : '',
						},
					});
					isPreviewEnabled && applyEffect(type, uniqueID, val);
				}}
				min={specialLabels?.min}
				step={1}
				max={specialLabels?.max}
				onReset={() => {
					const resetKey = getActiveThumbPercentage();
					const resetValue =
						activeThumbIndex === 0
							? Object.values(
									getDefaultAttribute(
										`scroll-${type}-zones-general`
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
