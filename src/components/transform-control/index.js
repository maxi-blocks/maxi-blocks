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
			let transformStr = '';
			let originStr = '';

			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-scale-x',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `scaleX(${
					getLastBreakpointAttribute(
						'transform-scale-x',
						breakpoint,
						transformOptions
					) / 100
				}) `;
			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-scale-y',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `scaleY(${
					getLastBreakpointAttribute(
						'transform-scale-y',
						breakpoint,
						transformOptions
					) / 100
				}) `;
			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-translate-x',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `translateX(${getLastBreakpointAttribute(
					'transform-translate-x',
					breakpoint,
					transformOptions
				)}${getLastBreakpointAttribute(
					'transform-translate-x-unit',
					breakpoint,
					transformOptions
				)}) `;
			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-translate-y',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `translateY(${getLastBreakpointAttribute(
					'transform-translate-y',
					breakpoint,
					transformOptions
				)}${getLastBreakpointAttribute(
					'transform-translate-y-unit',
					breakpoint,
					transformOptions
				)}) `;
			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-rotate-x',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `rotateX(${getLastBreakpointAttribute(
					'transform-rotate-x',
					breakpoint,
					transformOptions
				)}deg) `;
			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-rotate-y',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `rotateY(${getLastBreakpointAttribute(
					'transform-rotate-y',
					breakpoint,
					transformOptions
				)}deg) `;
			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-rotate-z',
						breakpoint,
						transformOptions
					)
				)
			)
				transformStr += `rotateZ(${getLastBreakpointAttribute(
					'transform-rotate-z',
					breakpoint,
					transformOptions
				)}deg) `;
			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-origin-x',
						breakpoint,
						transformOptions
					)
				)
			)
				originStr += `${getLastBreakpointAttribute(
					'transform-origin-x',
					breakpoint,
					transformOptions
				)}% `;
			if (
				isNumber(
					getLastBreakpointAttribute(
						'transform-origin-y',
						breakpoint,
						transformOptions
					)
				)
			)
				originStr += `${getLastBreakpointAttribute(
					'transform-origin-y',
					breakpoint,
					transformOptions
				)}% `;
			if (
				isString(
					getLastBreakpointAttribute(
						'transform-origin-x',
						breakpoint,
						transformOptions
					)
				)
			)
				originStr += `${getLastBreakpointAttribute(
					'transform-origin-x',
					breakpoint,
					transformOptions
				)} `;
			if (
				isString(
					getLastBreakpointAttribute(
						'transform-origin-y',
						breakpoint,
						transformOptions
					)
				)
			)
				originStr += `${getLastBreakpointAttribute(
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
								x={getLastBreakpointAttribute(
									'transform-scale-x',
									breakpoint,
									props
								)}
								y={getLastBreakpointAttribute(
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
								x={getLastBreakpointAttribute(
									'transform-translate-x',
									breakpoint,
									props
								)}
								y={getLastBreakpointAttribute(
									'transform-translate-y',
									breakpoint,
									props
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
								x={getLastBreakpointAttribute(
									'transform-rotate-x',
									breakpoint,
									props
								)}
								y={getLastBreakpointAttribute(
									'transform-rotate-y',
									breakpoint,
									props
								)}
								z={getLastBreakpointAttribute(
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
								x={getLastBreakpointAttribute(
									'transform-origin-x',
									breakpoint,
									props
								)}
								y={getLastBreakpointAttribute(
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
