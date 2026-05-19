/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import FocalPointControl from '@components/focal-point-control';
import SelectControl from '@components/select-control';
import AxisControl from '@components/axis-control';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	getLayerPlacementAllowedUnits,
	getLayerPlacementResetValue,
	hasPlacementValue,
	normalizePlacementSync,
} from './utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import { arrowIcon } from '@maxi-icons';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const PositionControl = props => {
	const {
		className,
		onChange,
		disablePosition = false,
		breakpoint = 'general',
		prefix = '',
		isHover = false,
		defaultAttributes,
		normalAttributes,
		label = __('Position', 'maxi-blocks'),
	} = props;

	const classes = classnames(
		'maxi-position-control',
		disablePosition && 'maxi-position-control--layer-placement',
		className
	);

	const minMaxSettings = {
		px: {
			min: -3000,
			max: 3000,
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
			min: -999,
			max: 999,
		},
	};

	const getPositionKey = target =>
		getAttributeKey(target, isHover, prefix, breakpoint);

	const getPositionDefault = target => {
		const key = getPositionKey(target);
		const value = defaultAttributes?.[key] ?? getDefaultAttribute(key);

		if (target === 'position-sync') return normalizePlacementSync(value);

		if (disablePosition && target.includes('-unit')) return '%';

		if (disablePosition && !hasPlacementValue(value)) {
			if (target === 'position-top' || target === 'position-left')
				return 0;
			if (target === 'position-right' || target === 'position-bottom')
				return '';
		}

		return value;
	};

	const getCleanOptions = () =>
		[
			'position-top',
			'position-right',
			'position-bottom',
			'position-left',
			'position-sync',
			'position-top-unit',
			'position-right-unit',
			'position-bottom-unit',
			'position-left-unit',
		].reduce(
			(acc, target) => ({
				...acc,
				[getPositionKey(target)]: getPositionDefault(target),
			}),
			{}
		);

	const getNormalPlacementAttribute = target =>
		normalAttributes
			? getLastBreakpointAttribute({
					target: `${prefix}${target}`,
					breakpoint,
					attributes: normalAttributes,
					isHover: false,
			  })
			: undefined;

	const getPositionResetValue = target =>
		getLayerPlacementResetValue({
			target,
			disablePosition,
			isHover,
			normalValue: getNormalPlacementAttribute(target),
			defaultValue: getPositionDefault(target),
		});

	const getResetOptions = () =>
		[
			'position-top',
			'position-right',
			'position-bottom',
			'position-left',
			'position-sync',
			'position-top-unit',
			'position-right-unit',
			'position-bottom-unit',
			'position-left-unit',
		].reduce(
			(acc, target) => ({
				...acc,
				[getPositionKey(target)]: getPositionResetValue(target),
			}),
			{}
		);

	// Helper to ensure FocalPointPicker receives valid 0-1 coordinates.
	// Uses the explicit unit to decide whether the value can be mapped.
	const normalizeCoordinate = (raw, unit) => {
		if (!hasPlacementValue(raw)) return 0;

		const numericValue = typeof raw === 'number' ? raw : parseFloat(raw);

		if (!Number.isFinite(numericValue)) return 0;

		// Non-percentage units (px, em, vw) can't meaningfully map to 0-1
		if (unit && unit !== '%') return 0;

		// Values are stored as 0-100 percentages; convert to 0-1 for the picker
		return Math.max(0, Math.min(1, numericValue / 100));
	};

	const canUseFocalCoordinate = (raw, unit) => {
		if (!hasPlacementValue(raw)) return true;
		if (unit && unit !== '%') return false;

		const numericValue = typeof raw === 'number' ? raw : parseFloat(raw);

		return (
			Number.isFinite(numericValue) &&
			numericValue >= 0 &&
			numericValue <= 100
		);
	};

	const getPlacementAttribute = target =>
		getLastBreakpointAttribute({
			target: `${prefix}${target}`,
			breakpoint,
			attributes: props,
			isHover,
		});

	const rawPlacement = {
		top: getPlacementAttribute('position-top'),
		right: getPlacementAttribute('position-right'),
		bottom: getPlacementAttribute('position-bottom'),
		left: getPlacementAttribute('position-left'),
		topUnit: getPlacementAttribute('position-top-unit'),
		rightUnit: getPlacementAttribute('position-right-unit'),
		bottomUnit: getPlacementAttribute('position-bottom-unit'),
		leftUnit: getPlacementAttribute('position-left-unit'),
		sync: normalizePlacementSync(getPlacementAttribute('position-sync')),
	};

	const topUnit = disablePosition
		? '%'
		: rawPlacement.topUnit || getPositionDefault('position-top-unit');
	const leftUnit = disablePosition
		? '%'
		: rawPlacement.leftUnit || getPositionDefault('position-left-unit');

	const hasAdvancedPlacement =
		hasPlacementValue(rawPlacement.right) ||
		hasPlacementValue(rawPlacement.bottom) ||
		!canUseFocalCoordinate(rawPlacement.top, topUnit) ||
		!canUseFocalCoordinate(rawPlacement.left, leftUnit) ||
		(rawPlacement.sync && rawPlacement.sync !== 'all');

	const [showAdvanced, setShowAdvanced] = useState(hasAdvancedPlacement);
	const [useFocalRequested, setUseFocalRequested] = useState(false);

	useEffect(() => {
		if (hasAdvancedPlacement && !useFocalRequested) setShowAdvanced(true);
		if (!hasAdvancedPlacement) setUseFocalRequested(false);
	}, [hasAdvancedPlacement, useFocalRequested]);

	const layerPlacementPoint = useMemo(
		() => ({
			x: normalizeCoordinate(rawPlacement.left, leftUnit),
			y: normalizeCoordinate(rawPlacement.top, topUnit),
		}),
		[rawPlacement.left, rawPlacement.top, leftUnit, topUnit]
	);

	const getPlacementChangeObject = focalPoint => ({
		[getPositionKey('position-top')]: Math.round(focalPoint.y * 100),
		[getPositionKey('position-top-unit')]: '%',
		[getPositionKey('position-left')]: Math.round(focalPoint.x * 100),
		[getPositionKey('position-left-unit')]: '%',
		[getPositionKey('position-right')]: '',
		[getPositionKey('position-right-unit')]: '%',
		[getPositionKey('position-bottom')]: '',
		[getPositionKey('position-bottom-unit')]: '%',
		[getPositionKey('position-sync')]: 'all',
	});

	const handlePlacementChange = focalPoint =>
		onChange(getPlacementChangeObject(focalPoint));

	const handleToggleAdvanced = () => {
		if (showAdvanced) {
			setUseFocalRequested(true);
			setShowAdvanced(false);
			onChange(getPlacementChangeObject(layerPlacementPoint));

			return;
		}

		setUseFocalRequested(false);
		setShowAdvanced(true);
	};

	const placementSides = ['top', 'right', 'bottom', 'left'];

	const getAdvancedPlacementUnit = side => {
		if (disablePosition) return '%';

		const value = rawPlacement[side];
		const unit = rawPlacement[`${side}Unit`];

		if (!hasPlacementValue(value)) return '%';

		return unit || getPositionDefault(`position-${side}-unit`);
	};

	const handleAdvancedPlacementChange = obj => {
		const response = { ...obj };

		placementSides.forEach(side => {
			const valueKey = getPositionKey(`position-${side}`);
			const unitKey = getPositionKey(`position-${side}-unit`);

			if (disablePosition) response[unitKey] = '%';

			if (
				Object.prototype.hasOwnProperty.call(response, valueKey) &&
				!Object.prototype.hasOwnProperty.call(response, unitKey)
			)
				response[unitKey] = getAdvancedPlacementUnit(side);
		});

		onChange(response);
	};

	const handlePlacementReset = () =>
		onChange({ ...getResetOptions(), isReset: true });

	const handlePlacementResetX = () =>
		onChange({
			[getPositionKey('position-left')]:
				getPositionResetValue('position-left'),
			[getPositionKey('position-left-unit')]:
				getPositionResetValue('position-left-unit'),
			isReset: true,
		});

	const handlePlacementResetY = () =>
		onChange({
			[getPositionKey('position-top')]:
				getPositionResetValue('position-top'),
			[getPositionKey('position-top-unit')]:
				getPositionResetValue('position-top-unit'),
			isReset: true,
		});

	const getAdvancedPlacementProps = () => {
		const hasTop = hasPlacementValue(rawPlacement.top);
		const hasRight = hasPlacementValue(rawPlacement.right);
		const hasBottom = hasPlacementValue(rawPlacement.bottom);
		const hasLeft = hasPlacementValue(rawPlacement.left);

		return {
			...props,
			[getPositionKey('position-top')]: hasTop
				? rawPlacement.top
				: Math.round(layerPlacementPoint.y * 100),
			[getPositionKey('position-top-unit')]:
				getAdvancedPlacementUnit('top'),
			[getPositionKey('position-right')]: hasRight
				? rawPlacement.right
				: '',
			[getPositionKey('position-right-unit')]:
				getAdvancedPlacementUnit('right'),
			[getPositionKey('position-bottom')]: hasBottom
				? rawPlacement.bottom
				: '',
			[getPositionKey('position-bottom-unit')]:
				getAdvancedPlacementUnit('bottom'),
			[getPositionKey('position-left')]: hasLeft
				? rawPlacement.left
				: Math.round(layerPlacementPoint.x * 100),
			[getPositionKey('position-left-unit')]:
				getAdvancedPlacementUnit('left'),
			[getPositionKey('position-sync')]:
				rawPlacement.sync || getPositionDefault('position-sync'),
		};
	};

	// Reusable component for the position picker and advanced settings
	const PositionPickerSection = (
		<>
			{!showAdvanced && (
				<div
					className='maxi-position-control__focal-picker'
					style={{ position: 'relative' }}
				>
					<FocalPointControl
						label={__('Layer placement', 'maxi-blocks')}
						value={layerPlacementPoint}
						onChange={handlePlacementChange}
						onReset={handlePlacementReset}
						onResetX={handlePlacementResetX}
						onResetY={handlePlacementResetY}
					/>
				</div>
			)}
			<div className='maxi-position-control__advanced-toggle'>
				<Button onClick={handleToggleAdvanced}>
					{showAdvanced
						? __('Use focal placement', 'maxi-blocks')
						: __('More layer placement settings', 'maxi-blocks')}
					<span
						className={`maxi-position-control__toggle-arrow${
							showAdvanced ? '--expanded' : ''
						}`}
					>
						{arrowIcon}
					</span>
				</Button>
			</div>
			{showAdvanced && (
				<div className='maxi-position-control__advanced-options'>
					<AxisControl
						{...getAdvancedPlacementProps()}
						target='position'
						prefix={prefix}
						label={label}
						onChange={handleAdvancedPlacementChange}
						breakpoint={breakpoint}
						minMaxSettings={minMaxSettings}
						optionType='string'
						enableAxisUnits
						allowedUnits={getLayerPlacementAllowedUnits(
							disablePosition
						)}
						isHover={isHover}
						defaultAttributes={defaultAttributes}
						showAllSides
					/>
				</div>
			)}
		</>
	);

	return (
		<div className={classes}>
			{!disablePosition ? (
				<>
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Position', 'maxi-blocks')}
						options={[
							{ label: 'Default', value: 'inherit' },
							{ label: 'Relative', value: 'relative' },
							{ label: 'Absolute', value: 'absolute' },
							{ label: 'Fixed', value: 'fixed' },
							{ label: 'Static', value: 'static' },
							{ label: 'Sticky', value: 'sticky' },
						]}
						value={
							getLastBreakpointAttribute({
								target: `${prefix}position`,
								breakpoint,
								attributes: props,
							}) || ''
						}
						defaultValue={getDefaultAttribute(
							getAttributeKey(
								'position',
								isHover,
								prefix,
								breakpoint
							)
						)}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'position',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'position',
										isHover,
										prefix,
										breakpoint
									)
								),
								isReset: true,
							})
						}
						newStyle
						onChange={val =>
							onChange({
								[`${prefix}position-${breakpoint}`]: val,
								...(isEmpty(val) && getCleanOptions()),
							})
						}
					/>
					{getLastBreakpointAttribute({
						target: `${prefix}position`,
						breakpoint,
						attributes: props,
					}) !== 'inherit' && PositionPickerSection}
				</>
			) : (
				PositionPickerSection
			)}
		</div>
	);
};

export default withRTC(PositionControl);
