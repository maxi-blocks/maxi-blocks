/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useEffect, useState } = wp.element;

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

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNumber, isString } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const TransformControl = props => {
	const { className, onChange, breakpoint = 'general', uniqueID } = props;

	const [transformOptions, changeTransformOptions] = useState(
		getGroupAttributes(props, 'transform')
	);

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
			let transformString = '';
			let transformOriginString = '';

			const scaleX = getLastBreakpointAttribute(
				'transform-scale-x',
				breakpoint,
				transformOptions
			);
			const scaleY = getLastBreakpointAttribute(
				'transform-scale-y',
				breakpoint,
				transformOptions
			);
			const translateX = getLastBreakpointAttribute(
				'transform-translate-x',
				breakpoint,
				transformOptions
			);
			const translateXUnit = getLastBreakpointAttribute(
				'transform-translate-x-unit',
				breakpoint,
				transformOptions
			);
			const translateY = getLastBreakpointAttribute(
				'transform-translate-y',
				breakpoint,
				transformOptions
			);
			const translateYUnit = getLastBreakpointAttribute(
				'transform-translate-y-unit',
				breakpoint,
				transformOptions
			);
			const rotateX = getLastBreakpointAttribute(
				'transform-rotate-x',
				breakpoint,
				transformOptions
			);
			const rotateY = getLastBreakpointAttribute(
				'transform-rotate-y',
				breakpoint,
				transformOptions
			);
			const rotateZ = getLastBreakpointAttribute(
				'transform-rotate-z',
				breakpoint,
				transformOptions
			);
			const originX = getLastBreakpointAttribute(
				'transform-origin-x',
				breakpoint,
				transformOptions
			);
			const originY = getLastBreakpointAttribute(
				'transform-origin-y',
				breakpoint,
				transformOptions
			);

			if (isNumber(scaleX)) transformString += `scaleX(${scaleX / 100}) `;
			if (isNumber(scaleY)) transformString += `scaleY(${scaleY / 100}) `;
			if (isNumber(translateX) && translateX > 0)
				transformString += `translateX(${translateX}${translateXUnit}) `;
			if (isNumber(translateY) && translateY > 0)
				transformString += `translateY(${translateY}${translateYUnit}) `;
			if (isNumber(rotateX)) transformString += `rotateX(${rotateX}deg) `;
			if (isNumber(rotateY)) transformString += `rotateY(${rotateY}deg) `;
			if (isNumber(rotateZ)) transformString += `rotateZ(${rotateZ}deg) `;
			if (isString(originX)) transformOriginString += `${originX}% `;
			if (isString(originY)) transformOriginString += `${originY}% `;

			node.style.transform = transformString;
			node.style.transformOrigin = transformOriginString;
		}
	};

	useEffect(forceStyles);

	return (
		<div className={classes}>
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Scale', 'maxi-blocks'),
						content: (
							<SquareControl
								x={getLastBreakpointAttribute(
									'transform-scale-x',
									breakpoint,
									props
								)}
								defaultX={getDefaultAttribute(
									'transform-scale-x'
								)}
								y={getLastBreakpointAttribute(
									'transform-scale-y',
									breakpoint,
									props
								)}
								defaultY={getDefaultAttribute(
									'transform-scale-y'
								)}
								onChange={(x, y) => {
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
						),
					},
					{
						label: __('Translate', 'maxi-blocks'),
						content: (
							<SquareControl
								type='drag'
								x={getLastBreakpointAttribute(
									'transform-translate-x',
									breakpoint,
									props
								)}
								defaultX={getDefaultAttribute(
									'transform-translate-x'
								)}
								y={getLastBreakpointAttribute(
									'transform-translate-y',
									breakpoint,
									props
								)}
								defaultY={getDefaultAttribute(
									'transform-translate-y'
								)}
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
									onChange({
										[`transform-translate-x-${breakpoint}`]: x,
										[`transform-translate-x-unit-${breakpoint}`]: xUnit,
										[`transform-translate-y-${breakpoint}`]: y,
										[`transform-translate-y-unit-${breakpoint}`]: yUnit,
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
						),
					},
					{
						label: __('Rotate', 'maxi-blocks'),
						content: (
							<RotateControl
								x={getLastBreakpointAttribute(
									'transform-rotate-x',
									breakpoint,
									props
								)}
								defaultX={getDefaultAttribute(
									'transform-rotate-x'
								)}
								y={getLastBreakpointAttribute(
									'transform-rotate-y',
									breakpoint,
									props
								)}
								defaultY={getDefaultAttribute(
									'transform-rotate-y'
								)}
								z={getLastBreakpointAttribute(
									'transform-rotate-z',
									breakpoint,
									props
								)}
								defaultZ={getDefaultAttribute(
									'transform-rotate-z'
								)}
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
						),
					},
					{
						label: __('Origin', 'maxi-blocks'),
						content: (
							<SquareControl
								type='origin'
								x={getLastBreakpointAttribute(
									'transform-origin-x',
									breakpoint,
									props
								)}
								defaultX={getDefaultAttribute(
									'transform-origin-x'
								)}
								y={getLastBreakpointAttribute(
									'transform-origin-y',
									breakpoint,
									props
								)}
								defaultY={getDefaultAttribute(
									'transform-origin-y'
								)}
								onChange={(x, y) => {
									onChange({
										[`transform-origin-x-${breakpoint}`]: x,
										[`transform-origin-y-${breakpoint}`]: y,
									});
									forceStyles();
								}}
							/>
						),
					},
				]}
			/>
		</div>
	);
};

export default TransformControl;
