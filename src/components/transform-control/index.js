/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import RotateControl from './rotate-control';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import SquareControl from './square-control';
import ToggleSwitch from '../toggle-switch';
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '../../extensions/attributes';
import { getTransformStyles } from '../../extensions/styles/helpers';
import { getActiveTabName } from '../../extensions/inspector';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { capitalize, isBoolean, isEmpty, isNil, toLower } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { getSelectorKeyLongLabel } from '../../extensions/attributes/dictionary/objectKeyParsers';
import { selectorKeys } from '../../extensions/attributes/dictionary/attributesDictionary';

/**
 * Component
 */
const TransformControl = props => {
	const {
		className,
		onChangeInline = null,
		onChange,
		breakpoint,
		depth,
		categories,
		selectors,
		tr_tar: transformTarget,
		disableHover = false,
	} = props;

	const [transformOptions, changeTransformOptions] = useState(
		getGroupAttributes(props, 'transform')
	);
	const [hoverSelected, setHoverSelected] = useState('n');
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
		Object.values(transformOptions).some(val => !isNil(val));

	const [transformStatus, setTransformStatus] = useState('sc');

	const getLastBreakpointTransformAttribute = ({
		target,
		key,
		keys,
		attributes = props,
	}) => {
		const getLastBreakpointAttributeWrapper = isHover =>
			target === ''
				? getLastBreakpointAttribute({
						target: breakpoint,
						attributes,
						keys: keys ?? [
							transformTarget,
							isHover ? 'h' : 'n',
							key,
						],
				  })
				: getLastBreakpointAttribute({
						target,
						breakpoint,
						attributes,
						keys: keys ?? [
							transformTarget,
							isHover ? 'h' : 'n',
							key,
						],
				  });

		if (hoverSelected !== 'h')
			return getLastBreakpointAttributeWrapper(false);

		/**
		 * If no hover attribute is defined and if the attribute isn't switch(boolean),
		 * inherit normal state attribute
		 */
		const hoverAttribute = getLastBreakpointAttributeWrapper(true);
		if (!isNil(hoverAttribute) || isBoolean(hoverAttribute))
			return hoverAttribute;

		return getLastBreakpointAttributeWrapper(false);
	};

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
			if (breakpoint === 'g') {
				const baseBreakpoint =
					select('maxiBlocks').receiveBaseBreakpoint();
				transformOptions[`${type}-${baseBreakpoint}`] = {
					...transformOptions[`${type}-${baseBreakpoint}`],
					...typeObj,
				};
			}
		});

		changeTransformOptions(transformOptions);
	};

	const getInlineTargetAndPseudoElement = target => target.split('::');

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
		const transform = getLastBreakpointTransformAttribute({
			target: '',
			keys: ['transform'],
			attributes: targetTransformObj,
		});
		const transformOrigin = getLastBreakpointTransformAttribute({
			target: '',
			keys: ['tr_ori'],
			attributes: targetTransformObj,
		});

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

	const getOptions = () => {
		const options = [
			{
				label: 'Choose',
				value: 'none',
			},
		];

		const isUsed = category => {
			const typeObj =
				transformOptions[`tr_${transformStatus}-${breakpoint}`];

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
			const transformStatus = selectorKeys[
				toLower(activeStatusName)
			]?.replace('_', '');
			setTransformStatus(toLower(transformStatus));
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
						value: 'sc',
						extraIndicatorsResponsive: ['transform-scale'],
					},
					{
						label: __('Translate', 'maxi-blocks'),
						value: 'tr',
						extraIndicatorsResponsive: ['transform-translate'],
					},
					{
						label: __('Rotate', 'maxi-blocks'),
						value: 'rot',
						extraIndicatorsResponsive: ['transform-rotate'],
					},
					{
						label: __('Origin', 'maxi-blocks'),
						value: 'ori',
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
					`${capitalize(
						getSelectorKeyLongLabel(`_${transformStatus}`)
					)} target`,
					'maxi-blocks'
				)}
				value={transformTarget ?? 'none'}
				onChange={val => {
					onChange({ tr_tar: val });
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
									value: 'n',
								},
								{
									label: __('Hover state', 'maxi-blocks'),
									value: 'h',
								},
							]}
							onChange={val => setHoverSelected(val)}
							hasBorder
						/>
					)}
					{!disableHover && hoverSelected === 'h' && (
						<ToggleSwitch
							label={__('Enable hover', 'maxi-blocks')}
							selected={getLastBreakpointTransformAttribute({
								target: `tr_${transformStatus}`,
								keys: [transformTarget, 'hs'],
							})}
							onChange={val => {
								const transformTargetOptions =
									transformOptions[
										`tr_${transformStatus}-${breakpoint}`
									]?.[transformTarget];
								onChangeTransform({
									[`tr_${transformStatus}`]: {
										[`${latestTarget.current.transformTarget}`]:
											{
												hs: val,
												...(transformTargetOptions &&
												isEmpty(
													transformTargetOptions.h
												) &&
												!isEmpty(
													transformTargetOptions.n
												)
													? {
															h: {
																...transformTargetOptions.n,
															},
													  }
													: {}),
											},
									},
								});
								onChange(
									{
										[`tr_${transformStatus}-${breakpoint}`]:
											{
												...transformOptions[
													`tr_${transformStatus}-${breakpoint}`
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
					{(hoverSelected === 'n' ||
						getLastBreakpointTransformAttribute({
							target: `tr_${transformStatus}`,
							keys: [transformTarget, 'hs'],
						})) && (
						<>
							{transformStatus === 'sc' && (
								<SquareControl
									x={getLastBreakpointTransformAttribute({
										target: 'tr_sc',
										key: 'x',
									})}
									y={getLastBreakpointTransformAttribute({
										target: 'tr_sc',
										key: 'y',
									})}
									breakpoint={breakpoint}
									onChange={(x, y) => {
										onChangeTransform({
											tr_sc: {
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
											tr_sc: {
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
												[`tr_sc-${breakpoint}`]: {
													...transformOptions[
														`tr_sc-${breakpoint}`
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
							{transformStatus === 'tr' && (
								<SquareControl
									type='drag'
									x={
										getLastBreakpointTransformAttribute({
											target: 'tr_tr',
											key: 'x',
										}) ?? 0
									}
									y={
										getLastBreakpointTransformAttribute({
											target: 'tr_tr',
											key: 'y',
										}) ?? 0
									}
									xUnit={
										getLastBreakpointTransformAttribute({
											target: 'tr_tr',
											key: 'x.u',
										}) ?? '%'
									}
									yUnit={
										getLastBreakpointTransformAttribute({
											target: 'tr_tr',
											key: 'y.u',
										}) ?? '%'
									}
									breakpoint={breakpoint}
									onChange={(x, y, xUnit, yUnit) => {
										onChangeTransform({
											tr_tr: {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																'x.u': xUnit,
																'y.u': yUnit,
															},
													},
											},
										});
									}}
									onSave={(x, y, xUnit, yUnit) => {
										onChangeTransform({
											tr_tr: {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																'x.u': xUnit,
																'y.u': yUnit,
															},
													},
											},
										});
										onChange(
											{
												[`tr_tr-${breakpoint}`]: {
													...transformOptions[
														`tr_tr-${breakpoint}`
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
							{transformStatus === 'rot' && (
								<RotateControl
									x={getLastBreakpointTransformAttribute({
										target: 'tr_rot',
										key: 'x',
									})}
									y={getLastBreakpointTransformAttribute({
										target: 'tr_rot',
										key: 'y',
									})}
									z={getLastBreakpointTransformAttribute({
										target: 'tr_rot',
										key: 'z',
									})}
									onChange={(x, y, z) => {
										onChangeTransform({
											tr_rot: {
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
												[`tr_rot-${breakpoint}`]: {
													...transformOptions[
														`tr_rot-${breakpoint}`
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
							{transformStatus === 'ori' && (
								<SquareControl
									type='origin'
									x={
										getLastBreakpointTransformAttribute({
											target: 'tr_ori',
											key: 'x',
										}) || 'middle'
									}
									y={
										getLastBreakpointTransformAttribute({
											target: 'tr_ori',
											key: 'y',
										}) || 'center'
									}
									xUnit={
										getLastBreakpointTransformAttribute({
											target: 'tr_ori',
											key: 'x.u',
										}) ?? '%'
									}
									yUnit={
										getLastBreakpointTransformAttribute({
											target: 'tr_ori',
											key: 'y.u',
										}) ?? '%'
									}
									breakpoint={breakpoint}
									onChange={(x, y, xUnit, yUnit) => {
										onChangeTransform({
											tr_ori: {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																'x.u': xUnit,
																'y.u': yUnit,
															},
													},
											},
										});
									}}
									onSave={(x, y, xUnit, yUnit) => {
										onChangeTransform({
											tr_ori: {
												[`${latestTarget.current.transformTarget}`]:
													{
														[`${latestTarget.current.hoverSelected}`]:
															{
																x,
																y,
																'x.u': xUnit,
																'y.u': yUnit,
															},
													},
											},
										});
										onChange(
											{
												[`tr_ori-${breakpoint}`]: {
													...transformOptions[
														`tr_ori-${breakpoint}`
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

export default withRTC(TransformControl);
