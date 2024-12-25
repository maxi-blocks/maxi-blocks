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
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import SquareControl from './square-control';
import ToggleSwitch from '@components/toggle-switch';
import InfoBox from '@components/info-box';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '@extensions/styles';
import { getTransformStyles } from '@extensions/styles/helpers';
import { getActiveTabName } from '@extensions/inspector';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { capitalize, isBoolean, isEmpty, isNil, toLower } from 'lodash';

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
		breakpoint,
		depth,
		categories,
		selectors,
		'transform-target': transformTarget,
		disableHover = false,
		disabledCategories = [],
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
		Object.values(transformOptions).some(val => !isNil(val));

	const [transformStatus, setTransformStatus] = useState('scale');

	const getLastBreakpointTransformAttribute = ({
		target,
		key,
		keys,
		attributes = props,
	}) => {
		const getLastBreakpointAttributeWrapper = isHover =>
			getLastBreakpointAttribute({
				target,
				breakpoint,
				attributes,
				keys: keys ?? [
					transformTarget,
					isHover ? 'hover' : 'normal',
					key,
				],
			});

		if (hoverSelected !== 'hover')
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
			if (breakpoint === 'general') {
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
			keys: ['transform-origin'],
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

	const disabledTransformTarget =
		transformTarget &&
		disabledCategories.find(({ category }) => category === transformTarget);

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
				hasBorder
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
			/>
			<SelectControl
				__nextHasNoMarginBottom
				className='maxi-transform-control__target-select'
				newStyle
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
			{disabledTransformTarget && (
				<InfoBox message={disabledTransformTarget.message} />
			)}
			{transformTarget &&
				transformTarget !== 'none' &&
				!disabledTransformTarget && (
					<>
						{!disableHover && (
							<SettingTabsControl
								label=''
								type='buttons'
								selected={hoverSelected}
								fullWidthMode
								items={[
									{
										label: __(
											'Normal state',
											'maxi-blocks'
										),
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
								selected={getLastBreakpointTransformAttribute({
									target: `transform-${transformStatus}`,
									keys: [transformTarget, 'hover-status'],
								})}
								newStyle
								onChange={val => {
									const transformTargetOptions =
										transformOptions[
											`transform-${transformStatus}-${breakpoint}`
										]?.[transformTarget];
									onChangeTransform({
										[`transform-${transformStatus}`]: {
											[`${latestTarget.current.transformTarget}`]:
												{
													'hover-status': val,
													...(transformTargetOptions &&
													isEmpty(
														transformTargetOptions.hover
													) &&
													!isEmpty(
														transformTargetOptions.normal
													)
														? {
																hover: {
																	...transformTargetOptions.normal,
																},
														  }
														: {}),
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
							getLastBreakpointTransformAttribute({
								target: `transform-${transformStatus}`,
								keys: [transformTarget, 'hover-status'],
							})) && (
							<>
								{breakpoint === 'general' &&
									selectors?.[transformTarget]?.[
										'canvas hover'
									] && (
										<ToggleSwitch
											label={__(
												'Switch hover target to canvas',
												'maxi-blocks'
											)}
											selected={
												!getLastBreakpointTransformAttribute(
													{
														target: `transform-${transformStatus}`,
														keys: [
															transformTarget,
															'hover-target',
														],
													}
												)
											}
											newStyle
											onChange={val => {
												onChangeTransform({
													[`transform-${transformStatus}`]:
														{
															[`${latestTarget.current.transformTarget}`]:
																{
																	'hover-target':
																		!val,
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
														latestTarget.current
															.targetSelector
													)
												);
											}}
										/>
									)}
								{transformStatus === 'scale' && (
									<SquareControl
										x={getLastBreakpointTransformAttribute({
											target: 'transform-scale',
											key: 'x',
										})}
										y={getLastBreakpointTransformAttribute({
											target: 'transform-scale',
											key: 'y',
										})}
										breakpoint={breakpoint}
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
												{
													target: 'transform-translate',
													key: 'x',
												}
											) ?? 0
										}
										y={
											getLastBreakpointTransformAttribute(
												{
													target: 'transform-translate',
													key: 'y',
												}
											) ?? 0
										}
										xUnit={
											getLastBreakpointTransformAttribute(
												{
													target: 'transform-translate',
													key: 'x-unit',
												}
											) ?? '%'
										}
										yUnit={
											getLastBreakpointTransformAttribute(
												{
													target: 'transform-translate',
													key: 'y-unit',
												}
											) ?? '%'
										}
										breakpoint={breakpoint}
										onChange={(x, y, xUnit, yUnit) => {
											onChangeTransform({
												'transform-translate': {
													[`${latestTarget.current.transformTarget}`]:
														{
															[`${latestTarget.current.hoverSelected}`]:
																{
																	x,
																	y,
																	'x-unit':
																		xUnit,
																	'y-unit':
																		yUnit,
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
																	'x-unit':
																		xUnit,
																	'y-unit':
																		yUnit,
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
										x={getLastBreakpointTransformAttribute({
											target: 'transform-rotate',
											key: 'x',
										})}
										y={getLastBreakpointTransformAttribute({
											target: 'transform-rotate',
											key: 'y',
										})}
										z={getLastBreakpointTransformAttribute({
											target: 'transform-rotate',
											key: 'z',
										})}
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
												{
													target: 'transform-origin',
													key: 'x',
												}
											) || 'middle'
										}
										y={
											getLastBreakpointTransformAttribute(
												{
													target: 'transform-origin',
													key: 'y',
												}
											) || 'center'
										}
										xUnit={
											getLastBreakpointTransformAttribute(
												{
													target: 'transform-origin',
													key: 'x-unit',
												}
											) ?? '%'
										}
										yUnit={
											getLastBreakpointTransformAttribute(
												{
													target: 'transform-origin',
													key: 'y-unit',
												}
											) ?? '%'
										}
										breakpoint={breakpoint}
										onChange={(x, y, xUnit, yUnit) => {
											onChangeTransform({
												'transform-origin': {
													[`${latestTarget.current.transformTarget}`]:
														{
															[`${latestTarget.current.hoverSelected}`]:
																{
																	x,
																	y,
																	'x-unit':
																		xUnit,
																	'y-unit':
																		yUnit,
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
																	'x-unit':
																		xUnit,
																	'y-unit':
																		yUnit,
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

export default withRTC(TransformControl);
