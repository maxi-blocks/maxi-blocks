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

import getLastBreakpointValue from '../../extensions/styles/getLastBreakpointValue';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

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
			let transformStr = '';
			let originStr = '';

			if (
				isNumber(
					getLastBreakpointValue(
						'transform-scale-x',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `scaleX(${
					getLastBreakpointValue(
						'transform-scale-x',
						breakpoint,
						transformOptions
					) / 100
				}) `;
			if (
				isNumber(
					getLastBreakpointValue(
						'transform-scale-y',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `scaleY(${
					getLastBreakpointValue(
						'transform-scale-y',
						breakpoint,
						transformOptions
					) / 100
				}) `;
			if (
				isNumber(
					getLastBreakpointValue(
						'transform-translate-x',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `translateX(${getLastBreakpointValue(
					'transform-translate-x',
					breakpoint,
					transformOptions
				)}${getLastBreakpointValue(
					'transform-translate-x-unit',
					breakpoint,
					transformOptions
				)}) `;
			if (
				isNumber(
					getLastBreakpointValue(
						'transform-translate-y',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `translateY(${getLastBreakpointValue(
					'transform-translate-y',
					breakpoint,
					transformOptions
				)}${getLastBreakpointValue(
					'transform-translate-y-unit',
					breakpoint,
					transformOptions
				)}) `;
			if (
				isNumber(
					getLastBreakpointValue(
						'transform-rotate-x',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `rotateX(${getLastBreakpointValue(
					'transform-rotate-x',
					breakpoint,
					transformOptions
				)}deg) `;
			if (
				isNumber(
					getLastBreakpointValue(
						'transform-rotate-y',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `rotateY(${getLastBreakpointValue(
					'transform-rotate-y',
					breakpoint,
					transformOptions
				)}deg) `;
			if (
				isNumber(
					getLastBreakpointValue(
						'transform-rotate-z',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `rotateZ(${getLastBreakpointValue(
					'transform-rotate-z',
					breakpoint,
					transformOptions
				)}deg) `;
			if (
				isNumber(
					getLastBreakpointValue(
						'transform-origin-x',
						breakpoint,
						transformOptions
					)
				)
			)
				originStr += `${getLastBreakpointValue(
					'transform-origin-x',
					breakpoint,
					transformOptions
				)}% `;
			if (
				isNumber(
					getLastBreakpointValue(
						'transform-origin-y',
						breakpoint,
						transformOptions
					)
				)
			)
				originStr += `${getLastBreakpointValue(
					'transform-origin-y',
					breakpoint,
					transformOptions
				)}% `;
			if (
				isString(
					getLastBreakpointValue(
						'transform-origin-x',
						breakpoint,
						transformOptions
					)
				)
			)
				originStr += `${getLastBreakpointValue(
					'transform-origin-x',
					breakpoint,
					transformOptions
				)} `;
			if (
				isString(
					getLastBreakpointValue(
						'transform-origin-y',
						breakpoint,
						transformOptions
					)
				)
			)
				originStr += `${getLastBreakpointValue(
					'transform-origin-y',
					breakpoint,
					transformOptions
				)} `;

			node.style = `transform: ${transformStr}; transform-origin: ${originStr}`;
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
								x={getLastBreakpointValue(
									'transform-scale-x',
									breakpoint,
									props
								)}
								y={getLastBreakpointValue(
									'transform-scale-y',
									breakpoint,
									props
								)}
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
						),
					},
					{
						label: __('Translate', 'maxi-blocks'),
						content: (
							<SquareControl
								type='drag'
								x={getLastBreakpointValue(
									'transform-translate-x',
									breakpoint,
									props
								)}
								y={getLastBreakpointValue(
									'transform-translate-y',
									breakpoint,
									props
								)}
								xUnit={getLastBreakpointValue(
									'transform-translate-x-unit',
									breakpoint,
									props
								)}
								yUnit={getLastBreakpointValue(
									'transform-translate-y-unit',
									breakpoint,
									props
								)}
								onChange={(x, y, xUnit, yUnit) => {
									onChangeTransform({
										'transform-translate-x': x,
										'transform-translate-x-unit': x,
										'transform-translate-y': y,
										'transform-translate-y-unit': y,
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
								x={getLastBreakpointValue(
									'transform-rotate-x',
									breakpoint,
									props
								)}
								y={getLastBreakpointValue(
									'transform-rotate-y',
									breakpoint,
									props
								)}
								z={getLastBreakpointValue(
									'transform-rotate-z',
									breakpoint,
									props
								)}
								onChange={(x, y, z) => {
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
								x={getLastBreakpointValue(
									'transform-origin-x',
									breakpoint,
									props
								)}
								y={getLastBreakpointValue(
									'transform-origin-y',
									breakpoint,
									props
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
