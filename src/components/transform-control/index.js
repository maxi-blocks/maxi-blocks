/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Icon from '@components/icon';
import InputGroupControl from './input-group-control';
import RotateControl from './rotate-control';
import {
	TRANSLATE3D_UNIT_RANGES,
	PERSPECTIVE_UNIT_RANGES,
} from './constants';
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

const createTransformIcon = (children, viewBox = '0 0 24 24') => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox={viewBox}
		aria-hidden='true'
		focusable='false'
	>
		{children}
	</svg>
);

const transformScaleIcon = createTransformIcon(
	<>
		<path d='M4 9V4h5' fill='none' stroke='currentColor' strokeWidth='2' />
		<path
			d='M20 15v5h-5'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
		/>
		<path d='M8 8l8 8' fill='none' stroke='currentColor' strokeWidth='2' />
		<path
			d='M4 20h8V12H4z'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.7'
		/>
	</>
);

const transformTranslateIcon = createTransformIcon(
	<>
		<path
			d='M12 3v18M3 12h18'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
		/>
		<path
			d='M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
		/>
	</>
);

const transformRotateIcon = createTransformIcon(
	<>
		<path
			d='M6.5 8A7 7 0 1 1 5 13'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
		/>
		<path
			d='M6.5 8H3V4.5'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</>
);

const transformOriginIcon = createTransformIcon(
	<>
		<path
			d='M5 5h14v14H5z'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.7'
		/>
		<path
			d='M12 3v18M3 12h18'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.4'
			strokeDasharray='2 2'
		/>
		<circle
			cx='12'
			cy='12'
			r='2.5'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
		/>
	</>
);

const transformSkewIcon = createTransformIcon(
	<>
		<path
			d='M7 6h12l-2 12H5z'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
			strokeLinejoin='round'
		/>
		<path
			d='M4 20h16'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
			strokeLinecap='round'
		/>
	</>
);

const transform3dIcon = createTransformIcon(
	<>
		<path
			d='M6 8l6-4 6 4v8l-6 4-6-4z'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
			strokeLinejoin='round'
		/>
		<path
			d='M6 8l6 4 6-4M12 12v8'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
			strokeLinejoin='round'
		/>
	</>
);

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

	const getTransformStatusLabel = () => {
		switch (transformStatus) {
			case 'transform3d':
				return '3D';
			default:
				return capitalize(transformStatus);
		}
	};

	const getTransformControlValues = (target, keys) =>
		keys.reduce(
			(acc, key) => ({
				...acc,
				[key]: getLastBreakpointTransformAttribute({
					target,
					key,
				}),
			}),
			{}
		);

	const onChangeTransformControlValues = (target, values) => {
		onChangeTransform({
			[target]: {
				[`${latestTarget.current.transformTarget}`]: {
					[`${latestTarget.current.hoverSelected}`]: values,
				},
			},
		});
		onChange(
			{
				[`${target}-${breakpoint}`]: {
					...transformOptions[`${target}-${breakpoint}`],
				},
			},
			...getInlineTargetAndPseudoElement(
				latestTarget.current.targetSelector
			)
		);
	};

	const renderInputGroupControl = (target, fields, label) => (
		<InputGroupControl
			label={label}
			fields={fields}
			values={getTransformControlValues(
				target,
				fields.flatMap(({ key, unitKey }) =>
					unitKey ? [key, unitKey] : [key]
				)
			)}
			onChange={values => onChangeTransformControlValues(target, values)}
		/>
	);

	const getCurrentTransformTargets = () =>
		transformStatus === 'transform3d'
			? [
					'transform-perspective',
					'transform-translate3d',
					'transform-scale3d',
					'transform-rotate3d',
			  ]
			: [`transform-${transformStatus}`];

	const getCurrentTransformHoverStatus = () =>
		getCurrentTransformTargets().some(target =>
			getLastBreakpointTransformAttribute({
				target,
				keys: [transformTarget, 'hover-status'],
			})
		);

	const getCurrentTransformHoverTargetUsesCanvas = () =>
		getCurrentTransformTargets().every(
			target =>
				!getLastBreakpointTransformAttribute({
					target,
					keys: [transformTarget, 'hover-target'],
				})
		);

	const getCurrentBreakpointTransformOptions = () =>
		getCurrentTransformTargets().reduce(
			(acc, target) => ({
				...acc,
				[`${target}-${breakpoint}`]: {
					...transformOptions[`${target}-${breakpoint}`],
				},
			}),
			{}
		);

	const getCurrentTransformHoverUpdate = values =>
		getCurrentTransformTargets().reduce((acc, target) => {
			const transformTargetOptions =
				transformOptions[`${target}-${breakpoint}`]?.[transformTarget];

			return {
				...acc,
				[target]: {
					[`${latestTarget.current.transformTarget}`]: {
						...values,
						...(transformTargetOptions &&
						isEmpty(transformTargetOptions.hover) &&
						!isEmpty(transformTargetOptions.normal)
							? {
									hover: {
										...transformTargetOptions.normal,
									},
							  }
							: {}),
					},
				},
			};
		}, {});

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
			return getCurrentTransformTargets().some(target => {
				const typeObj = transformOptions[`${target}-${breakpoint}`];

				const isCategoryEmpty = () => {
					return Object.values(typeObj[category] ?? {}).every(val => {
						return Object.values(val).every(axis => isNil(axis));
					});
				};

				return !isNil(typeObj) && !isCategoryEmpty();
			});
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
				className='maxi-transform-control__mode-tabs'
				selected={transformStatus}
				fullWidthMode
				showTooltip
				hasBorder
				items={[
					{
						icon: <Icon icon={transformScaleIcon} />,
						tooltip: __('Scale', 'maxi-blocks'),
						value: 'scale',
						extraIndicatorsResponsive: ['transform-scale'],
					},
					{
						icon: <Icon icon={transformTranslateIcon} />,
						tooltip: __('Translate', 'maxi-blocks'),
						value: 'translate',
						extraIndicatorsResponsive: ['transform-translate'],
					},
					{
						icon: <Icon icon={transformRotateIcon} />,
						tooltip: __('Rotate', 'maxi-blocks'),
						value: 'rotate',
						extraIndicatorsResponsive: ['transform-rotate'],
					},
					{
						icon: <Icon icon={transformOriginIcon} />,
						tooltip: __('Origin', 'maxi-blocks'),
						value: 'origin',
						hidden: !isTransformed(),
						extraIndicatorsResponsive: ['transform-origin'],
					},
					{
						icon: <Icon icon={transformSkewIcon} />,
						tooltip: __('Skew', 'maxi-blocks'),
						value: 'skew',
						extraIndicatorsResponsive: ['transform-skew'],
					},
					{
						icon: <Icon icon={transform3dIcon} />,
						tooltip: __('3D Transform', 'maxi-blocks'),
						value: 'transform3d',
						extraIndicatorsResponsive: [
							'transform-perspective',
							'transform-translate3d',
							'transform-scale3d',
							'transform-rotate3d',
						],
					},
				]}
				onChange={val => setTransformStatus(val)}
				depth={depth}
			/>
			<SelectControl
				__nextHasNoMarginBottom
				className='maxi-transform-control__target-select'
				newStyle
				label={__(`${getTransformStatusLabel()} target`, 'maxi-blocks')}
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
								selected={getCurrentTransformHoverStatus()}
								newStyle
								onChange={val => {
									onChangeTransform(
										getCurrentTransformHoverUpdate({
											'hover-status': val,
										})
									);
									onChange(
										getCurrentBreakpointTransformOptions(),
										...getInlineTargetAndPseudoElement(
											latestTarget.current.targetSelector
										)
									);
								}}
							/>
						)}
						{(hoverSelected === 'normal' ||
							getCurrentTransformHoverStatus()) && (
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
											selected={getCurrentTransformHoverTargetUsesCanvas()}
											newStyle
											onChange={val => {
												onChangeTransform(
													getCurrentTransformHoverUpdate(
														{
															'hover-target':
																!val,
														}
													)
												);
												onChange(
													getCurrentBreakpointTransformOptions(),
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
								{transformStatus === 'skew' &&
									renderInputGroupControl('transform-skew', [
										{
											key: 'x',
											label: __('X', 'maxi-blocks'),
											min: -360,
											max: 360,
											placeholder: '0deg',
										},
										{
											key: 'y',
											label: __('Y', 'maxi-blocks'),
											min: -360,
											max: 360,
											placeholder: '0deg',
										},
									])}
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
								{transformStatus === 'transform3d' && (
									<>
										{renderInputGroupControl(
											'transform-perspective',
											[
												{
													key: 'value',
													unitKey: 'unit',
													label: __(
														'Value',
														'maxi-blocks'
													),
													min: 0,
													max: 5000,
													allowedUnits: [
														'px',
														'em',
														'rem',
														'vw',
														'vh',
													],
													unitRanges:
														PERSPECTIVE_UNIT_RANGES,
													placeholder: '0',
												},
											],
											__('Perspective', 'maxi-blocks')
										)}
										{renderInputGroupControl(
											'transform-translate3d',
											[
												{
													key: 'x',
													unitKey: 'x-unit',
													label: __(
														'X',
														'maxi-blocks'
													),
													min: -5000,
													max: 5000,
													allowedUnits: [
														'px',
														'em',
														'rem',
														'vw',
														'vh',
														'%',
													],
													unitRanges:
														TRANSLATE3D_UNIT_RANGES,
													placeholder: '0',
												},
												{
													key: 'y',
													unitKey: 'y-unit',
													label: __(
														'Y',
														'maxi-blocks'
													),
													min: -5000,
													max: 5000,
													allowedUnits: [
														'px',
														'em',
														'rem',
														'vw',
														'vh',
														'%',
													],
													unitRanges:
														TRANSLATE3D_UNIT_RANGES,
													placeholder: '0',
												},
												{
													key: 'z',
													unitKey: 'z-unit',
													label: __(
														'Z',
														'maxi-blocks'
													),
													min: -5000,
													max: 5000,
													allowedUnits: [
														'px',
														'em',
														'rem',
														'vw',
														'vh',
													],
													unitRanges:
														TRANSLATE3D_UNIT_RANGES,
													placeholder: '0',
												},
											],
											__('Translate3D', 'maxi-blocks')
										)}
										{renderInputGroupControl(
											'transform-scale3d',
											[
												{
													key: 'x',
													label: __(
														'X',
														'maxi-blocks'
													),
													min: -10,
													max: 10,
													step: 0.1,
													placeholder: '1',
												},
												{
													key: 'y',
													label: __(
														'Y',
														'maxi-blocks'
													),
													min: -10,
													max: 10,
													step: 0.1,
													placeholder: '1',
												},
												{
													key: 'z',
													label: __(
														'Z',
														'maxi-blocks'
													),
													min: -10,
													max: 10,
													step: 0.1,
													placeholder: '1',
												},
											],
											__('Scale3D', 'maxi-blocks')
										)}
										{renderInputGroupControl(
											'transform-rotate3d',
											[
												{
													key: 'x',
													label: __(
														'X',
														'maxi-blocks'
													),
													min: -10,
													max: 10,
													step: 0.1,
													placeholder: '0',
												},
												{
													key: 'y',
													label: __(
														'Y',
														'maxi-blocks'
													),
													min: -10,
													max: 10,
													step: 0.1,
													placeholder: '0',
												},
												{
													key: 'z',
													label: __(
														'Z',
														'maxi-blocks'
													),
													min: -10,
													max: 10,
													step: 0.1,
													placeholder: '1',
												},
												{
													key: 'angle',
													label: __(
														'Angle',
														'maxi-blocks'
													),
													min: -360,
													max: 360,
													placeholder: '0deg',
												},
											],
											__('Rotate3D', 'maxi-blocks')
										)}
									</>
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
