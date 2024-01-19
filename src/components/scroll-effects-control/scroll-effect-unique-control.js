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

	const getSpecialLabels = (type, label) => {
		const response = {};
		switch (type) {
			case 'vertical':
				response.label = `${label} position (px)`;
				response.attr = 'offset';
				response.min = -4000;
				response.max = 4000;
				break;
			case 'horizontal':
				response.label = `${label} position (px)`;
				response.attr = 'offset';
				response.min = -4000;
				response.max = 4000;
				break;
			case 'rotate':
				response.label = `${label} angle (degrees)`;
				response.attr = 'rotate';
				response.min = -360;
				response.max = 360;
				break;
			case 'scale':
				response.label = `${label} scale (%)`;
				response.attr = 'scale';
				response.min = 0;
				response.max = 1000;
				break;
			case 'fade':
				response.label = `${label} opacity (%)`;
				response.attr = 'opacity';
				response.min = 0;
				response.max = 100;
				break;
			case 'blur':
				response.label = `${label} blur (px)`;
				response.attr = 'blur';
				response.min = 0;
				response.max = 20;
				break;

			default:
				break;
		}
		return response;
	};

	const specialLabels = getSpecialLabels(type, '');

	/**
	 * Zones structure example:
	 * {
	  "0": 90,
	  "50": 0,
	  "100": 0
	  }
	 */
	const [zones, setZones] = useState(
		Object.keys(
			getLastBreakpointAttribute({
				target: `scroll-${type}-zones`,
				breakpoint,
				attributes: values,
			})
		)
	);
	const [activeThumbIndex, setActiveThumbIndex] = useState(null);
	const [showAddButton, setShowAddButton] = useState(false);
	const [mouseY, setMouseY] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const ref = useRef(null);

	const zonesAttribute = getLastBreakpointAttribute({
		target: `scroll-${type}-zones`,
		breakpoint,
		attributes: values,
	});

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

		// Check for proximity to each thumb
		const proximity = zones.some(zone => {
			const zonePosition = (zone / 100) * timelineRect.height;
			return Math.abs(mouseY - zonePosition) < 20; // 20px as threshold for overlap
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

	const classes = classnames(
		'maxi-advanced-number-control maxi-scroll-unique-control',
		className
	);

	console.log(
		props,
		getLastBreakpointAttribute({
			target: `scroll-${type}-zones`,
			breakpoint,
			attributes: values,
		})
	);

	return (
		<div className={classes}>
			<div
				ref={ref}
				className='maxi-scroll-unique-control__slider-wrapper'
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				{/* <SettingTabsControl
				items={labels.map(label => {
					const special = getSpecialLabels(type, label);
					console.log(special);
					return {
						label: __(`${label} zone`, 'maxi-blocks'),
						content: (
							<AdvancedNumberControl
								label={__(special?.label, 'maxi-blocks')}
								value={getLastBreakpointAttribute({
									target: `scroll-${type}-${special?.attr}`,
									breakpoint,
									attributes: values,
								})}
								onChangeValue={val => {
									onChange({
										[`scroll-${type}-${special?.attr}-${breakpoint}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
									isPreviewEnabled &&
										applyEffect(type, uniqueID, val);
								}}
								min={special?.min}
								step={1}
								max={special?.max}
								onReset={() => {
									onChange({
										[`scroll-${type}-${special?.attr}-${breakpoint}`]:
											getDefaultAttribute(
												`scroll-${type}-${special?.attr}-general`
											),
										isReset: true,
									});
									isPreviewEnabled &&
										applyEffect(
											type,
											uniqueID,
											getDefaultAttribute(
												`scroll-${type}-${special?.attr}-general`
											)
										);
								}}
								initialPosition={getDefaultAttribute(
									`scroll-${type}-${special?.attr}-general`
								)}
							/>
						),
					};
				})}
			/> */}
				<ReactSlider
					className='horizontal-slider'
					thumbClassName='example-thumb'
					trackClassName='example-track'
					value={Object.keys(
						getLastBreakpointAttribute({
							target: `scroll-${type}-zones`,
							breakpoint,
							attributes: values,
						})
					)}
					onChange={handleSliderChange}
					onBeforeChange={handleThumbInteractionStart}
					onAfterChange={handleThumbInteractionEnd}
					renderThumb={(props, state) => (
						<div
							{...props}
							className={`${props.className} ${
								state.index === activeThumbIndex
									? 'selected'
									: ''
							}`}
							onClick={() => handleThumbClick(state.index)}
						>
							<div className='thumb-label'>
								<span>
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
										<Icon
											icon={promptDelete}
											onClick={() =>
												handleThumbDelete(state.index)
											}
										/>
									)}
							</div>

							<div className='thumb-value'>{state.valueNow}%</div>
						</div>
					)}
					orientation='vertical'
					pearling
					minDistance={1}
				/>
				{showAddButton && (
					<>
						<div
							className='divider'
							style={{ top: `${mouseY}px` }}
						/>
						<div
							className='plus-text'
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
				value={
					zonesAttribute[
						Object.keys(zonesAttribute)[activeThumbIndex]
					]
				}
				onChangeValue={val => {
					onChange({
						[`scroll-${type}-zones-${breakpoint}`]: {
							...zonesAttribute,
							[Object.keys(zonesAttribute)[activeThumbIndex]]:
								val !== undefined && val !== '' ? val : '',
						},
					});
					isPreviewEnabled && applyEffect(type, uniqueID, val);
				}}
				min={specialLabels?.min}
				step={1}
				max={specialLabels?.max}
				onReset={() => {
					onChange({
						// todo: fix this
						[`scroll-${type}-zones-${breakpoint}`]: {
							...zonesAttribute,
							[Object.keys(zonesAttribute)[activeThumbIndex]]:
								Object.values(
									getDefaultAttribute(
										`scroll-${type}-general`
									)
								)[activeThumbIndex],
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
