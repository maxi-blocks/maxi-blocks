/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import SquareControl from './square-control';
import RotateControl from './rotate-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getTransformStyles } from '../../extensions/styles/helpers';
import { getActiveTabName } from '../../extensions/inspector-path';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, toLower } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const TransformControl = props => {
	const {
		className,
		onChange,
		breakpoint = 'general',
		uniqueID,
		depth,
	} = props;

	const [transformOptions, changeTransformOptions] = useState(
		getGroupAttributes(props, 'transform')
	);

	const activeTabName = getActiveTabName(depth);

	const isTransformed = () =>
		Object.entries(transformOptions).some(([key, val]) => {
			if (
				!key.includes('unit') &&
				!key.includes('translate') &&
				!isNil(val)
			)
				return true;
			return false;
		});

	const [transformStatus, setTransformStatus] = useState('scale');

	const onChangeTransform = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			transformOptions[`${key}-${breakpoint}`] = val;
		});

		changeTransformOptions(transformOptions);
	};

	const classes = classnames('maxi-transform-control', className);

	const forceStyles = () => {
		const node = document.querySelector(
			`.maxi-block[uniqueid="${uniqueID}"]`
		);

		if (node) {
			const transformObj = getTransformStyles(
				getGroupAttributes(transformOptions, 'transform')
			);

			if (!transformObj || !transformObj[breakpoint]) {
				node.style.transform = null;
				node.style.transformOrigin = null;

				return;
			}

			const {
				[breakpoint]: {
					transform,
					'transform-origin': transformOrigin,
				},
			} = transformObj;

			if (transform) node.style.transform = transform;
			if (transformOrigin) node.style.transformOrigin = transformOrigin;
		}
	};

	useEffect(() => {
		if (activeTabName) {
			setTransformStatus(toLower(activeTabName));
		}
	});

	useEffect(forceStyles);

	return (
		<div className={classes}>
			<SettingTabsControl
				label=''
				type='buttons'
				selected={transformStatus}
				fullWidthMode
				items={[
					{
						label: __('Scale', 'maxi-blocks'),
						value: 'scale',
						extraIndicatorsResponsive: [
							'transform-scale-x',
							'transform-scale-y',
						],
					},
					{
						label: __('Translate', 'maxi-blocks'),
						value: 'translate',
						extraIndicatorsResponsive: [
							'transform-translate-x',
							'transform-translate-y',
						],
					},
					{
						label: __('Rotate', 'maxi-blocks'),
						value: 'rotate',
						extraIndicatorsResponsive: [
							'transform-rotate-x',
							'transform-rotate-y',
							'transform-rotate-z',
						],
					},
					{
						label: __('Origin', 'maxi-blocks'),
						value: 'origin',
						hidden: !isTransformed(),
						extraIndicatorsResponsive: [
							'transform-origin-x',
							'transform-origin-y',
						],
					},
				]}
				onChange={val => setTransformStatus(val)}
				depth={2}
				hasBorder
			/>
			{transformStatus === 'scale' && (
				<SquareControl
					x={getLastBreakpointAttribute(
						'transform-scale-x',
						breakpoint,
						props
					)}
					defaultX={getDefaultAttribute('transform-scale-x')}
					y={getLastBreakpointAttribute(
						'transform-scale-y',
						breakpoint,
						props
					)}
					defaultY={getDefaultAttribute('transform-scale-y')}
					onChange={(x, y) => {
						onChangeTransform({
							'transform-scale-x': x,
							'transform-scale-y': y,
						});
						forceStyles();
					}}
					onSave={(x, y) => {
						onChangeTransform({
							'transform-scale-x': x,
							'transform-scale-y': y,
						});
						onChange({
							[`transform-scale-x-${breakpoint}`]: x,
							[`transform-scale-y-${breakpoint}`]: y,
						});
						forceStyles();
					}}
				/>
			)}
			{transformStatus === 'translate' && (
				<SquareControl
					type='drag'
					x={getLastBreakpointAttribute(
						'transform-translate-x',
						breakpoint,
						props
					)}
					defaultX={getDefaultAttribute('transform-translate-x')}
					y={getLastBreakpointAttribute(
						'transform-translate-y',
						breakpoint,
						props
					)}
					defaultY={getDefaultAttribute('transform-translate-y')}
					xUnit={getLastBreakpointAttribute(
						'transform-translate-x-unit',
						breakpoint,
						props
					)}
					yUnit={getLastBreakpointAttribute(
						'transform-translate-y-unit',
						breakpoint,
						props
					)}
					onChange={(x, y, xUnit, yUnit) => {
						onChangeTransform({
							'transform-translate-x': x,
							'transform-translate-x-unit': xUnit,
							'transform-translate-y': y,
							'transform-translate-y-unit': yUnit,
						});
						forceStyles();
					}}
					onSave={(x, y, xUnit, yUnit) => {
						onChangeTransform({
							'transform-translate-x': x,
							'transform-translate-x-unit': xUnit,
							'transform-translate-y': y,
							'transform-translate-y-unit': yUnit,
						});
						onChange({
							[`transform-translate-x-${breakpoint}`]: x,
							[`transform-translate-x-unit-${breakpoint}`]: xUnit,
							[`transform-translate-y-${breakpoint}`]: y,
							[`transform-translate-y-unit-${breakpoint}`]: yUnit,
						});
						forceStyles();
					}}
				/>
			)}
			{transformStatus === 'rotate' && (
				<RotateControl
					x={getLastBreakpointAttribute(
						'transform-rotate-x',
						breakpoint,
						props
					)}
					defaultX={getDefaultAttribute('transform-rotate-x')}
					y={getLastBreakpointAttribute(
						'transform-rotate-y',
						breakpoint,
						props
					)}
					defaultY={getDefaultAttribute('transform-rotate-y')}
					z={getLastBreakpointAttribute(
						'transform-rotate-z',
						breakpoint,
						props
					)}
					defaultZ={getDefaultAttribute('transform-rotate-z')}
					onChange={(x, y, z) => {
						onChangeTransform({
							'transform-rotate-x': x,
							'transform-rotate-y': y,
							'transform-rotate-z': z,
						});
						onChange({
							[`transform-rotate-x-${breakpoint}`]: x,
							[`transform-rotate-y-${breakpoint}`]: y,
							[`transform-rotate-z-${breakpoint}`]: z,
						});
						forceStyles();
					}}
				/>
			)}
			{transformStatus === 'origin' && (
				<SquareControl
					type='origin'
					x={
						getLastBreakpointAttribute(
							'transform-origin-x',
							breakpoint,
							props
						) || 'center'
					}
					defaultX={getDefaultAttribute('transform-origin-x')}
					y={
						getLastBreakpointAttribute(
							'transform-origin-y',
							breakpoint,
							props
						) || 'middle'
					}
					defaultY={getDefaultAttribute('transform-origin-y')}
					xUnit={getLastBreakpointAttribute(
						'transform-origin-x-unit',
						breakpoint,
						props
					)}
					yUnit={getLastBreakpointAttribute(
						'transform-origin-y-unit',
						breakpoint,
						props
					)}
					onChange={(x, y, xUnit, yUnit) => {
						onChangeTransform({
							'transform-origin-x': x,
							'transform-origin-x-unit': xUnit,
							'transform-origin-y': y,
							'transform-origin-y-unit': yUnit,
						});
						forceStyles();
					}}
					onSave={(x, y, xUnit, yUnit) => {
						onChangeTransform({
							'transform-origin-x': x,
							'transform-origin-x-unit': xUnit,
							'transform-origin-y': y,
							'transform-origin-y-unit': yUnit,
						});
						onChange({
							[`transform-origin-x-${breakpoint}`]: x,
							[`transform-origin-x-unit-${breakpoint}`]: xUnit,
							[`transform-origin-y-${breakpoint}`]: y,
							[`transform-origin-y-unit-${breakpoint}`]: yUnit,
						});
						forceStyles();
					}}
				/>
			)}
		</div>
	);
};

export default TransformControl;
