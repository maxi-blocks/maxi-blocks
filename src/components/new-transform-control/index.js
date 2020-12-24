/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useEffect } = wp.element;

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import SquareControl from './square-control';
import RotateControl from './rotate-control';

import getLastBreakpointValue from '../../extensions/styles/getLastBreakpointValue';

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

	const classes = classnames('maxi-transform-control', className);

	const forceStyles = () => {
		let transformStr = '';
		let originStr = '';

		if (
			isNumber(
				getLastBreakpointValue('transform-scale-x', breakpoint, props)
			)
		)
			transformStr += `scaleX(${
				getLastBreakpointValue('transform-scale-x', breakpoint, props) /
				100
			}) `;
		if (
			isNumber(
				getLastBreakpointValue('transform-scale-y', breakpoint, props)
			)
		)
			transformStr += `scaleY(${
				getLastBreakpointValue('transform-scale-y', breakpoint, props) /
				100
			}) `;
		if (
			isNumber(
				getLastBreakpointValue(
					'transform-translate-x',
					breakpoint,
					props
				)
			)
		)
			transformStr += `translateX(${getLastBreakpointValue(
				'transform-translate-x',
				breakpoint,
				props
			)}${getLastBreakpointValue(
				'transform-translate-x-unit',
				breakpoint,
				props
			)}) `;
		if (
			isNumber(
				getLastBreakpointValue(
					'transform-translate-y',
					breakpoint,
					props
				)
			)
		)
			transformStr += `translateY(${getLastBreakpointValue(
				'transform-translate-y',
				breakpoint,
				props
			)}${getLastBreakpointValue(
				'transform-translate-y-unit',
				breakpoint,
				props
			)}) `;
		if (
			isNumber(
				getLastBreakpointValue('transform-rotate-x', breakpoint, props)
			)
		)
			transformStr += `rotateX(${getLastBreakpointValue(
				'transform-rotate-x',
				breakpoint,
				props
			)}deg) `;
		if (
			isNumber(
				getLastBreakpointValue('transform-rotate-y', breakpoint, props)
			)
		)
			transformStr += `rotateY(${getLastBreakpointValue(
				'transform-rotate-y',
				breakpoint,
				props
			)}deg) `;
		if (
			isNumber(
				getLastBreakpointValue('transform-rotate-z', breakpoint, props)
			)
		)
			transformStr += `rotateZ(${getLastBreakpointValue(
				'transform-rotate-z',
				breakpoint,
				props
			)}deg) `;
		if (
			isNumber(
				getLastBreakpointValue('transform-origin-x', breakpoint, props)
			)
		)
			originStr += `${getLastBreakpointValue(
				'transform-origin-x',
				breakpoint,
				props
			)}% `;
		if (
			isNumber(
				getLastBreakpointValue('transform-origin-y', breakpoint, props)
			)
		)
			originStr += `${getLastBreakpointValue(
				'transform-origin-y',
				breakpoint,
				props
			)}% `;
		if (
			isString(
				getLastBreakpointValue('transform-origin-x', breakpoint, props)
			)
		)
			originStr += `${getLastBreakpointValue(
				'transform-origin-x',
				breakpoint,
				props
			)} `;
		if (
			isString(
				getLastBreakpointValue('transform-origin-y', breakpoint, props)
			)
		)
			originStr += `${getLastBreakpointValue(
				'transform-origin-y',
				breakpoint,
				props
			)} `;

		const node = document.querySelector(
			`.maxi-block[uniqueid="${uniqueID}"]`
		);
		if (node) {
			node.style.transform = transformStr;
			node.style.transformOrigin = originStr;
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
									'transform-scaleX',
									breakpoint,
									props
								)}
								y={getLastBreakpointValue(
									'transform-scaleY',
									breakpoint,
									props
								)}
								onChange={(x, y) => {
									transform[breakpoint].scaleX = x;
									transform[breakpoint].scaleY = y;
									forceStyles();
								}}
								onSave={(x, y) => {
									transform[breakpoint].scaleX = x;
									transform[breakpoint].scaleY = y;
									onChange(transform);
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
									'transform-translateX',
									breakpoint,
									props
								)}
								y={getLastBreakpointValue(
									'transform-translateY',
									breakpoint,
									props
								)}
								xUnit={getLastBreakpointValue(
									'transform-translateXUnit',
									breakpoint,
									props
								)}
								yUnit={getLastBreakpointValue(
									'transform-translateYUnit',
									breakpoint,
									props
								)}
								onChange={(x, y, xUnit, yUnit) => {
									transform[breakpoint].translateX = x;
									transform[breakpoint].translateY = y;
									transform[
										breakpoint
									].translateXUnit = xUnit;
									transform[
										breakpoint
									].translateYUnit = yUnit;
									forceStyles();
								}}
								onSave={(x, y, xUnit, yUnit) => {
									transform[breakpoint].translateX = x;
									transform[breakpoint].translateY = y;
									transform[
										breakpoint
									].translateXUnit = xUnit;
									transform[
										breakpoint
									].translateYUnit = yUnit;
									onChange(transform);
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
									'transform-rotateX',
									breakpoint,
									props
								)}
								y={getLastBreakpointValue(
									'transform-rotateY',
									breakpoint,
									props
								)}
								z={getLastBreakpointValue(
									'transform-rotateZ',
									breakpoint,
									props
								)}
								onChange={(x, y, z) => {
									transform[breakpoint].rotateX = x;
									transform[breakpoint].rotateY = y;
									transform[breakpoint].rotateZ = z;
									onChange(transform);
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
									'transform-originX',
									breakpoint,
									props
								)}
								y={getLastBreakpointValue(
									'transform-originY',
									breakpoint,
									props
								)}
								onChange={(x, y) => {
									transform[breakpoint].originX = x;
									transform[breakpoint].originY = y;
									onChange(transform);
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
