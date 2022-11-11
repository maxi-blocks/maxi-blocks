/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef } from '@wordpress/element';

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
import { getTransformStyles } from '../../extensions/styles/helpers';
import { getActiveTabName } from '../../extensions/inspector';
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, toLower, capitalize, isEmpty } from 'lodash';

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
		onChangeInline = null,
		onChange,
		breakpoint = 'general',
		depth,
		categories,
		selectors,
		'transform-target': transformTarget,
		disableHover = false,
	} = props;

	const [transformOptions, changeTransformOptions] = useState(
		getGroupAttributes(props, 'transform')
	);
	const [hoverSelected, setHoverSelected] = useState('normal');
	const latestTarget = useRef();

	useEffect(() => {
		const targetSelector =
			selectors[transformTarget]?.[hoverSelected]?.target;
		latestTarget.current = {
			transformTarget,
			hoverSelected,
			targetSelector,
		};
	}, [transformTarget, hoverSelected]);

	const isTransformed = () =>
		Object.entries(transformOptions).some(([key, val]) => {
			if (!isNil(val)) return true;
			return false;
		});

	const [transformStatus, setTransformStatus] = useState('scale');

	const updateTransformOptions = obj => {
		Object.entries(obj).forEach(([type, diffTypeObj]) => {
			const typeObj = { ...transformOptions[`${type}-${breakpoint}`] };
			Object.entries(diffTypeObj).forEach(([target, targetObj]) => {
				// save both hover and normal state
				typeObj[target] = { ...typeObj?.[target], ...targetObj };
			});
			// save each type of transform(scale, translate, etc...)
			transformOptions[`${type}-${breakpoint}`] = {
				...transformOptions[`${type}-${breakpoint}`],
				...typeObj,
			};
		});

		changeTransformOptions(transformOptions);
	};

	const getInlineTargetAndPseudoElement = target => target.split('::');

	const getCurrentAndHigherBreakpoints = () => {
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		return breakpoints
			.slice(0, breakpoints.indexOf(breakpoint) + 1)
			.reverse();
	};

	const insertInlineStyles = () => {
		if (!onChangeInline) return;

		const { targetSelector } = latestTarget.current;

		const transformObj = getTransformStyles(transformOptions, selectors);

		if (
			isEmpty(transformObj[targetSelector]) ||
			isNil(targetSelector) ||
			targetSelector.includes(':hover')
		)
			return;

		const targetTransformObj = transformObj[targetSelector].transform;

		const breakpointToUse = getCurrentAndHigherBreakpoints().find(
			currentBreakpoint =>
				currentBreakpoint in targetTransformObj &&
				!isEmpty(targetTransformObj[currentBreakpoint])
		);
		const {
			[breakpointToUse]: {
				transform,
				'transform-origin': transformOrigin,
			},
		} = targetTransformObj;

		const [inlineTarget, pseudoElement] =
			getInlineTargetAndPseudoElement(targetSelector);

		onChangeInline(
			{
				transform: transform ?? '',
				'transform-origin': transformOrigin ?? '',
			},
			inlineTarget,
			pseudoElement
		);
	};

	const onChangeTransform = obj => {
		updateTransformOptions(obj);
		insertInlineStyles(obj);
	};

	const getLastBreakpointTransformAttribute = prop =>
		getCurrentAndHigherBreakpoints().reduce((acc, currentBreakpoint) => {
			const attribute =
				props?.[`${prop}-${currentBreakpoint}`]?.[transformTarget]?.[
					hoverSelected
				];
			if (
				isEmpty(acc) &&
				!isEmpty(attribute) &&
				Object.values(attribute).some(value => !isNil(value))
			)
				return attribute;
			return acc;
		}, {});

	const getOptions = () => {
		const options = [
			{
				label: 'Choose',
				value: 'none',
			},
		];

		const isUsed = category => {
			const typeObj =
				transformOptions[`transform-${transformStatus}-${breakpoint}`];

			const isCategoryEmpty = () => {
				return Object.values(typeObj[category] ?? {}).every(val => {
					return Object.values(val).every(axis => isNil(axis));
				});
			};

			return !isNil(typeObj) && !isCategoryEmpty();
		};

		categories?.forEach(category => {
			const optionClass = isUsed(category)
				? 'maxi-option__in-use'
				: 'maxi-option__not-in-use';

			const selector = selectors[category]?.[hoverSelected];
			if (selector)
				options.push({
					label: capitalize(selector.label),
					value: category,
					className: optionClass,
				});
		});
		return options;
	};

	const classes = classnames('maxi-transform-control', className);

	useEffect(() => {
		const activeStatusName = getActiveTabName(depth);
		if (activeStatusName) {
			setTransformStatus(toLower(activeStatusName));
		}
	});

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
						extraIndicatorsResponsive: ['transform-scale'],
					},
					{
						label: __('Translate', 'maxi-blocks'),
						value: 'translate',
						extraIndicatorsResponsive: ['transform-translate'],
					},
					{
						label: __('Rotate', 'maxi-blocks'),
						value: 'rotate',
						extraIndicatorsResponsive: ['transform-rotate'],
					},
					{
						label: __('Origin', 'maxi-blocks'),
						value: 'origin',
						hidden: !isTransformed(),
						extraIndicatorsResponsive: ['transform-origin'],
					},
				]}
				onChange={val => setTransformStatus(val)}
				depth={depth}
				hasBorder
			/>
			<SelectControl
				className='maxi-transform-control__target-select'
				label={__(
					`${capitalize(transformStatus)} target`,
					'maxi-blocks'
				)}
				value={transformTarget ?? 'none'}
				onChange={val => {
					onChange({ 'transform-target': val });
				}}
				options={getOptions()}
			/>
			{transformTarget && transformTarget !== 'none' && (
				<>
					{!disableHover && (
						<SettingTabsControl
							label=''
							type='buttons'
							selected={hoverSelected}
							fullWidthMode
							items={[
								{
									label: __('Normal state', 'maxi-blocks'),
									value: 'normal',
								},
								{
									label: __('Hover state', 'maxi-blocks'),
									value: 'hover',
								},
							]}
							onChange={val => setHoverSelected(val)}
							hasBorder
						/>
					)}
					{!disableHover && hoverSelected === 'hover' && (
						<ToggleSwitch
							label={__('Enable hover', 'maxi-blocks')}
							selected={
								getLastBreakpointAttribute({
									target: `transform-${transformStatus}`,
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.['hover-status']
							}
							onChange={val => {
								onChangeTransform({
									[`transform-${transformStatus}`]: {
										[`${latestTarget.current.transformTarget}`]:
											{
												'hover-status': val,
											},
									},
								});
								onChange(
									{
										[`transform-${transformStatus}-${breakpoint}`]:
											{
												...transformOptions[
													`transform-${transformStatus}-${breakpoint}`
												],
											},
									},
									...getInlineTargetAndPseudoElement(
										latestTarget.current.targetSelector
									)
								);
							}}
						/>
					)}
					{(hoverSelected === 'normal' ||
						getLastBreakpointAttribute({
							target: `transform-${transformStatus}`,
							breakpoint,
							attributes: props,
						})?.[transformTarget]?.['hover-status']) && (
						<>
							{transformStatus === 'scale' && (
								<SquareControl
									x={
										getLastBreakpointTransformAttribute(
											'transform-scale'
										)?.x
									}
									y={
										getLastBreakpointTransformAttribute(
											'transform-scale'
										)?.y
									}
									onChange={(x, y) => {
										onChangeTransform({
											'transform-scale': {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
															},
													},
											},
										});
									}}
									onSave={(x, y) => {
										onChangeTransform({
											'transform-scale': {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
															},
													},
											},
										});
										onChange(
											{
												[`transform-scale-${breakpoint}`]:
													{
														...transformOptions[
															`transform-scale-${breakpoint}`
														],
													},
											},
											...getInlineTargetAndPseudoElement(
												latestTarget.current
													.targetSelector
											)
										);
									}}
								/>
							)}
							{transformStatus === 'translate' && (
								<SquareControl
									type='drag'
									x={
										getLastBreakpointTransformAttribute(
											'transform-translate'
										)?.x
									}
									y={
										getLastBreakpointTransformAttribute(
											'transform-translate'
										)?.y
									}
									xUnit={
										getLastBreakpointTransformAttribute(
											'transform-translate'
										)?.['x-unit'] ?? '%'
									}
									yUnit={
										getLastBreakpointTransformAttribute(
											'transform-translate'
										)?.['y-unit'] ?? '%'
									}
									onChange={(x, y, xUnit, yUnit) => {
										onChangeTransform({
											'transform-translate': {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																'x-unit': xUnit,
																'y-unit': yUnit,
															},
													},
											},
										});
									}}
									onSave={(x, y, xUnit, yUnit) => {
										onChangeTransform({
											'transform-translate': {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																'x-unit': xUnit,
																'y-unit': yUnit,
															},
													},
											},
										});
										onChange(
											{
												[`transform-translate-${breakpoint}`]:
													{
														...transformOptions[
															`transform-translate-${breakpoint}`
														],
													},
											},
											...getInlineTargetAndPseudoElement(
												latestTarget.current
													.targetSelector
											)
										);
									}}
								/>
							)}
							{transformStatus === 'rotate' && (
								<RotateControl
									x={
										getLastBreakpointTransformAttribute(
											'transform-rotate'
										)?.x
									}
									y={
										getLastBreakpointTransformAttribute(
											'transform-rotate'
										)?.y
									}
									z={
										getLastBreakpointTransformAttribute(
											'transform-rotate'
										)?.z
									}
									onChange={(x, y, z) => {
										onChangeTransform({
											'transform-rotate': {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																z,
															},
													},
											},
										});
										onChange(
											{
												[`transform-rotate-${breakpoint}`]:
													{
														...transformOptions[
															`transform-rotate-${breakpoint}`
														],
													},
											},
											...getInlineTargetAndPseudoElement(
												latestTarget.current
													.targetSelector
											)
										);
									}}
								/>
							)}
							{transformStatus === 'origin' && (
								<SquareControl
									type='origin'
									x={
										getLastBreakpointTransformAttribute(
											'transform-origin'
										)?.x || 'middle'
									}
									y={
										getLastBreakpointTransformAttribute(
											'transform-origin'
										)?.y || 'center'
									}
									xUnit={
										getLastBreakpointTransformAttribute(
											'transform-origin'
										)?.['x-unit'] ?? '%'
									}
									yUnit={
										getLastBreakpointTransformAttribute(
											'transform-origin'
										)?.['y-unit'] ?? '%'
									}
									onChange={(x, y, xUnit, yUnit) => {
										onChangeTransform({
											'transform-origin': {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																'x-unit': xUnit,
																'y-unit': yUnit,
															},
													},
											},
										});
									}}
									onSave={(x, y, xUnit, yUnit) => {
										onChangeTransform({
											'transform-origin': {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																'x-unit': xUnit,
																'y-unit': yUnit,
															},
													},
											},
										});
										onChange(
											{
												[`transform-origin-${breakpoint}`]:
													{
														...transformOptions[
															`transform-origin-${breakpoint}`
														],
													},
											},
											...getInlineTargetAndPseudoElement(
												latestTarget.current
													.targetSelector
											)
										);
									}}
								/>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default TransformControl;
