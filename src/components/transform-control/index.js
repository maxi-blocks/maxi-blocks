/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useEffect } = wp.element;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import SettingTabsControl from '../setting-tabs-control';
import SquareControl from './square-control';
import RotateControl from './rotate-control';

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

	const transform = { ...props.transform };

	const classes = classnames('maxi-transform-control', className);

	const forceStyles = () => {
		let transformStr = '';
		let originStr = '';

		if (isNumber(getLastBreakpointValue(transform, 'scaleX', breakpoint)))
			transformStr += `scaleX(${
				getLastBreakpointValue(transform, 'scaleX', breakpoint) / 100
			}) `;
		if (isNumber(getLastBreakpointValue(transform, 'scaleY', breakpoint)))
			transformStr += `scaleY(${
				getLastBreakpointValue(transform, 'scaleY', breakpoint) / 100
			}) `;
		if (
			isNumber(
				getLastBreakpointValue(transform, 'translateX', breakpoint)
			)
		)
			transformStr += `translateX(${getLastBreakpointValue(
				transform,
				'translateX',
				breakpoint
			)}${getLastBreakpointValue(
				transform,
				'translateXUnit',
				breakpoint
			)}) `;
		if (
			isNumber(
				getLastBreakpointValue(transform, 'translateY', breakpoint)
			)
		)
			transformStr += `translateY(${getLastBreakpointValue(
				transform,
				'translateY',
				breakpoint
			)}${getLastBreakpointValue(
				transform,
				'translateYUnit',
				breakpoint
			)}) `;
		if (isNumber(getLastBreakpointValue(transform, 'rotateX', breakpoint)))
			transformStr += `rotateX(${getLastBreakpointValue(
				transform,
				'rotateX',
				breakpoint
			)}deg) `;
		if (isNumber(getLastBreakpointValue(transform, 'rotateY', breakpoint)))
			transformStr += `rotateY(${getLastBreakpointValue(
				transform,
				'rotateY',
				breakpoint
			)}deg) `;
		if (isNumber(getLastBreakpointValue(transform, 'rotateZ', breakpoint)))
			transformStr += `rotateZ(${getLastBreakpointValue(
				transform,
				'rotateZ',
				breakpoint
			)}deg) `;
		if (isNumber(getLastBreakpointValue(transform, 'originX', breakpoint)))
			originStr += `${getLastBreakpointValue(
				transform,
				'originX',
				breakpoint
			)}% `;
		if (isNumber(getLastBreakpointValue(transform, 'originY', breakpoint)))
			originStr += `${getLastBreakpointValue(
				transform,
				'originY',
				breakpoint
			)}% `;
		if (isString(getLastBreakpointValue(transform, 'originX', breakpoint)))
			originStr += `${getLastBreakpointValue(
				transform,
				'originX',
				breakpoint
			)} `;
		if (isString(getLastBreakpointValue(transform, 'originY', breakpoint)))
			originStr += `${getLastBreakpointValue(
				transform,
				'originY',
				breakpoint
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
									transform,
									'scaleX',
									breakpoint
								)}
								y={getLastBreakpointValue(
									transform,
									'scaleY',
									breakpoint
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
									transform,
									'translateX',
									breakpoint
								)}
								y={getLastBreakpointValue(
									transform,
									'translateY',
									breakpoint
								)}
								xUnit={getLastBreakpointValue(
									transform,
									'translateXUnit',
									breakpoint
								)}
								yUnit={getLastBreakpointValue(
									transform,
									'translateYUnit',
									breakpoint
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
									transform,
									'rotateX',
									breakpoint
								)}
								y={getLastBreakpointValue(
									transform,
									'rotateY',
									breakpoint
								)}
								z={getLastBreakpointValue(
									transform,
									'rotateZ',
									breakpoint
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
									transform,
									'originX',
									breakpoint
								)}
								y={getLastBreakpointValue(
									transform,
									'originY',
									breakpoint
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
