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
		onChangeInline,
		onChange,
		breakpoint = 'general',
		depth,
		categories,
		selectors,
		'transform-target': transformTarget,
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

	const onChangeTransform = obj => {
		Object.entries(obj).forEach(([type, diffTypeObj]) => {
			const typeObj = { ...transformOptions[`${type}-${breakpoint}`] };
			Object.entries(diffTypeObj).forEach(([target, targetObj]) => {
				typeObj[target] = { ...typeObj?.[target], ...targetObj };
			});
			transformOptions[`${type}-${breakpoint}`] = {
				...transformOptions[`${type}-${breakpoint}`],
				...typeObj,
			};
		});

		changeTransformOptions(transformOptions);

		const { targetSelector } = latestTarget.current;

		const transformObj = getTransformStyles(transformOptions, selectors);

		if (isEmpty(transformObj)) return;

		if (isNil(targetSelector) || targetSelector.includes(':')) return;

		const targetTransformObj = transformObj[targetSelector].transform;

		const {
			[breakpoint]: { transform, 'transform-origin': transformOrigin },
		} = targetTransformObj;

		onChangeInline(
			{
				transform: transform ?? '',
				'transform-origin': transformOrigin ?? '',
			},
			targetSelector
		);
	};

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

			if (isNil(typeObj)) return false;
			return category in typeObj;
		};

		categories?.forEach(category => {
			const optionClass = isUsed(category)
				? 'maxi-option__in-use'
				: 'maxi-option__not-in-use';

			options.push({
				label: capitalize(category),
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
					{transformStatus === 'scale' && (
						<SquareControl
							x={
								getLastBreakpointAttribute({
									target: 'transform-scale',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.x
							}
							defaultX={100}
							y={
								getLastBreakpointAttribute({
									target: 'transform-scale',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.y
							}
							defaultY={100}
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
										[`transform-scale-${breakpoint}`]: {
											...transformOptions[
												`transform-scale-${breakpoint}`
											],
										},
									},
									latestTarget.current.targetSelector
								);
							}}
						/>
					)}
					{transformStatus === 'translate' && (
						<SquareControl
							type='drag'
							x={
								getLastBreakpointAttribute({
									target: 'transform-translate',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.x
							}
							defaultX={0}
							y={
								getLastBreakpointAttribute({
									target: 'transform-translate',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.y
							}
							defaultY={0}
							xUnit={
								getLastBreakpointAttribute({
									target: 'transform-translate',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.[
									'x-unit'
								] ?? '%'
							}
							yUnit={
								getLastBreakpointAttribute({
									target: 'transform-translate',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.[
									'y-unit'
								] ?? '%'
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
										[`transform-translate-${breakpoint}`]: {
											...transformOptions[
												`transform-translate-${breakpoint}`
											],
										},
									},
									latestTarget.current.targetSelector
								);
							}}
						/>
					)}
					{transformStatus === 'rotate' && (
						<RotateControl
							x={
								getLastBreakpointAttribute({
									target: 'transform-rotate',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.x
							}
							defaultX={0}
							y={
								getLastBreakpointAttribute({
									target: 'transform-rotate',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.y
							}
							defaultY={0}
							z={
								getLastBreakpointAttribute({
									target: 'transform-rotate',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.z
							}
							defaultZ={0}
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
										[`transform-rotate-${breakpoint}`]: {
											...transformOptions[
												`transform-rotate-${breakpoint}`
											],
										},
									},
									latestTarget.current.targetSelector
								);
							}}
						/>
					)}
					{transformStatus === 'origin' && (
						<SquareControl
							type='origin'
							x={
								getLastBreakpointAttribute({
									target: 'transform-origin',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]
									?.x || 'center'
							}
							defaultX={0}
							y={
								getLastBreakpointAttribute({
									target: 'transform-origin',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]
									?.y || 'middle'
							}
							defaultY={0}
							xUnit={
								getLastBreakpointAttribute({
									target: 'transform-origin',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.[
									'x-unit'
								] ?? '%'
							}
							yUnit={
								getLastBreakpointAttribute({
									target: 'transform-origin',
									breakpoint,
									attributes: props,
								})?.[transformTarget]?.[`${hoverSelected}`]?.[
									'y-unit'
								] ?? '%'
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
										[`transform-origin-${breakpoint}`]: {
											...transformOptions[
												`transform-origin-${breakpoint}`
											],
										},
									},
									latestTarget.current.targetSelector
								);
							}}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default TransformControl;
