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
	} = props;

	const classes = classnames('maxi-position-control', className);

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

	const normalizePlacementSync = value => {
		if (value === true) return 'all';
		if (value === false) return 'none';

		return value;
	};

	const getPositionDefault = target => {
		const key = getPositionKey(target);
		const value = defaultAttributes?.[key] ?? getDefaultAttribute(key);

		if (target === 'position-sync') return normalizePlacementSync(value);

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

	// Helper to ensure FocalPointPicker receives valid 0-1 coordinates.
	// Uses the explicit unit to decide whether the value can be mapped.
	const normalizeCoordinate = (raw, unit) => {
		if (raw === null || raw === undefined || raw === '') return 0.5;

		const numericValue = typeof raw === 'number' ? raw : parseFloat(raw);

		if (!Number.isFinite(numericValue)) return 0.5;

		// Non-percentage units (px, em, vw) can't meaningfully map to 0-1
		if (unit && unit !== '%') return 0.5;

		// Values are stored as 0-100 percentages; convert to 0-1 for the picker
		return Math.max(0, Math.min(1, numericValue / 100));
	};

	const hasPlacementValue = value =>
		value !== null && value !== undefined && value !== '';

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
		leftUnit: getPlacementAttribute('position-left-unit'),
		sync: normalizePlacementSync(getPlacementAttribute('position-sync')),
	};

	const hasAdvancedPlacement =
		hasPlacementValue(rawPlacement.right) ||
		hasPlacementValue(rawPlacement.bottom) ||
		(hasPlacementValue(rawPlacement.top) &&
			rawPlacement.topUnit &&
			rawPlacement.topUnit !== '%') ||
		(hasPlacementValue(rawPlacement.left) &&
			rawPlacement.leftUnit &&
			rawPlacement.leftUnit !== '%') ||
		(rawPlacement.sync && rawPlacement.sync !== 'all');

	const [showAdvanced, setShowAdvanced] = useState(hasAdvancedPlacement);

	useEffect(() => {
		if (hasAdvancedPlacement) setShowAdvanced(true);
	}, [hasAdvancedPlacement]);

	const layerPlacementPoint = useMemo(
		() => ({
			x: normalizeCoordinate(rawPlacement.left, rawPlacement.leftUnit),
			y: normalizeCoordinate(rawPlacement.top, rawPlacement.topUnit),
		}),
		[
			rawPlacement.left,
			rawPlacement.leftUnit,
			rawPlacement.top,
			rawPlacement.topUnit,
		]
	);

	const getPlacementChangeObject = focalPoint => ({
		[getPositionKey('position-top')]: Math.round(focalPoint.y * 100),
		[getPositionKey('position-top-unit')]: '%',
		[getPositionKey('position-left')]: Math.round(focalPoint.x * 100),
		[getPositionKey('position-left-unit')]: '%',
		[getPositionKey('position-right')]: '',
		[getPositionKey('position-bottom')]: '',
	});

	const handlePlacementChange = focalPoint =>
		onChange(getPlacementChangeObject(focalPoint));

	const handlePlacementReset = () =>
		onChange({ ...getCleanOptions(), isReset: true });

	const handlePlacementResetX = () =>
		onChange({
			[getPositionKey('position-left')]:
				getPositionDefault('position-left'),
			[getPositionKey('position-left-unit')]:
				getPositionDefault('position-left-unit'),
			isReset: true,
		});

	const handlePlacementResetY = () =>
		onChange({
			[getPositionKey('position-top')]:
				getPositionDefault('position-top'),
			[getPositionKey('position-top-unit')]:
				getPositionDefault('position-top-unit'),
			isReset: true,
		});

	const getAdvancedPlacementProps = () => {
		const hasTop = hasPlacementValue(rawPlacement.top);
		const hasLeft = hasPlacementValue(rawPlacement.left);

		return {
			...props,
			[getPositionKey('position-top')]: hasTop
				? rawPlacement.top
				: Math.round(layerPlacementPoint.y * 100),
			[getPositionKey('position-top-unit')]: hasTop
				? rawPlacement.topUnit ||
				  getPositionDefault('position-top-unit')
				: '%',
			[getPositionKey('position-left')]: hasLeft
				? rawPlacement.left
				: Math.round(layerPlacementPoint.x * 100),
			[getPositionKey('position-left-unit')]: hasLeft
				? rawPlacement.leftUnit ||
				  getPositionDefault('position-left-unit')
				: '%',
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
			{!hasAdvancedPlacement && (
				<div className='maxi-position-control__advanced-toggle'>
					<Button onClick={() => setShowAdvanced(!showAdvanced)}>
						{showAdvanced
							? __('Use focal placement', 'maxi-blocks')
							: __(
									'More layer placement settings',
									'maxi-blocks'
							  )}
						<span
							className={`maxi-position-control__toggle-arrow${
								showAdvanced ? '--expanded' : ''
							}`}
						>
							{arrowIcon}
						</span>
					</Button>
				</div>
			)}
			{showAdvanced && (
				<div className='maxi-position-control__advanced-options'>
					<AxisControl
						{...getAdvancedPlacementProps()}
						target='position'
						prefix={prefix}
						onChange={obj => onChange(obj)}
						breakpoint={breakpoint}
						minMaxSettings={minMaxSettings}
						optionType='string'
						enableAxisUnits
						allowedUnits={['px', 'em', 'vw', '%', '-']}
						isHover={isHover}
						defaultAttributes={defaultAttributes}
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
