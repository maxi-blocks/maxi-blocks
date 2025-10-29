/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import Button from '@components/button';
import SelectControl from '@components/select-control';
import BaseControl from '@components/base-control';
import clipPathDefaults from './defaults';
import ClipPathVisualEditor from './visualEditor';
import Icon from '@components/icon';
import ToggleSwitch from '@components/toggle-switch';
import SettingTabsControl from '@components/setting-tabs-control';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getAttributeValue,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import getClipPath from './getClipPath';
import optionColors from './optionColors';
import typeDefaults from './typeDefaults';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep, isEmpty, isEqual, isNil } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { styleNone } from '@maxi-icons';

/**
 * Normalizers and helpers
 */
const DEFAULT_COORDINATE = { value: 0, unit: '%' };
const ALLOWED_COORD_UNITS = ['%', 'px', 'em', 'rem', 'vw', 'vh'];

const createDefaultCoordinate = () => ({ ...DEFAULT_COORDINATE });

const createDefaultHandle = () => [
	createDefaultCoordinate(),
	createDefaultCoordinate(),
];

const sanitizeCoordinate = coordinate => {
	if (
		!coordinate ||
		typeof coordinate.value === 'undefined' ||
		typeof coordinate.unit === 'undefined'
	)
		return createDefaultCoordinate();

	const value =
		typeof coordinate.value === 'number'
			? coordinate.value
			: Number.parseFloat(coordinate.value);

	const hasValidValue = Number.isFinite(value);

	const unit =
		typeof coordinate.unit === 'string' &&
		ALLOWED_COORD_UNITS.includes(coordinate.unit)
			? coordinate.unit
			: DEFAULT_COORDINATE.unit;

	return {
		value: hasValidValue ? value : DEFAULT_COORDINATE.value,
		unit,
	};
};

const normalizePolygonHandle = handle => {
	if (!Array.isArray(handle)) return createDefaultHandle();

	const normalized = handle.slice(0, 2).map(sanitizeCoordinate);

	while (normalized.length < 2) normalized.push(createDefaultCoordinate());

	return normalized;
};

const normalizeClipPathOptions = clipPathOptions => {
	if (!clipPathOptions || typeof clipPathOptions !== 'object')
		return clipPathOptions;

	const normalized = cloneDeep(clipPathOptions);

	if (normalized.type !== 'polygon') return normalized;

	const content =
		normalized.content && typeof normalized.content === 'object'
			? normalized.content
			: {};

	normalized.content = Object.entries(content).reduce(
		(acc, [key, handle]) => ({
			...acc,
			[key]: normalizePolygonHandle(handle),
		}),
		{}
	);

	return normalized;
};

/**
 * Component
 */
const ClipPathOption = props => {
	const { values, number, type, onChange, onReset, onRemove } = props;

	const getLabel = () => {
		if (type === 'circle' && number === 0)
			return __('Radius', 'maxi-blocks');
		if (
			(type === 'circle' && number === 1) ||
			(type === 'ellipse' && number === 2)
		)
			return __('Center', 'maxi-blocks');
		if (type === 'ellipse' && number === 0)
			return __('Left', 'maxi-blocks');
		if (type === 'ellipse' && number === 1) return __('Top', 'maxi-blocks');

		if (type === 'inset')
			switch (number) {
				case 0:
					return __('Top', 'maxi-blocks');
				case 1:
					return __('Right', 'maxi-blocks');
				case 2:
					return __('Bottom', 'maxi-blocks');
				case 3:
					return __('Left', 'maxi-blocks');
				default:
					break;
			}

		return `${__('Point', 'maxi-blocks')} ${number + 1}`;
	};

	return (
		<div className='maxi-clip-path-controller'>
			<div className='maxi-clip-path-controller__handle maxi-clip-path-color-handle'>
				<span
					style={{
						backgroundColor: optionColors[number],
					}}
				/>
			</div>
			<BaseControl
				__nextHasNoMarginBottom
				label={getLabel()}
				className='maxi-clip-path-controller__item'
			>
				<div className='maxi-clip-path-controller__settings'>
					{[0, 1].map(
						index =>
							!isNil(values[index]) && (
								<AdvancedNumberControl
									key={index}
									value={values[index].value}
									unit={values[index].unit}
									onChangeValue={(value, meta) => {
										values[index].value = value || 0;
										onChange(values, meta);
									}}
									onChangeUnit={unit => {
										values[index].unit = unit;
										onChange(values);
									}}
									onReset={() => onReset(index)}
									minMaxSettings={{
										px: {
											min: 0,
											max: 3999,
										},
										'%': {
											min: 0,
											max: 100,
										},
									}}
									disableRange
									enableUnit
								/>
							)
					)}
				</div>
			</BaseControl>
			{type === 'polygon' && number > 2 && (
				<div className='maxi-clip-path-controller__handle maxi-clip-path-delete-handle'>
					<span onClick={() => onRemove(number)} />
				</div>
			)}
		</div>
	);
};

const ClipPathControl = props => {
	const visualEditorRef = useRef(null);

	const {
		className,
		onChange,
		prefix = '',
		breakpoint,
		isHover = false,
		isLayer = false,
		isIB = false,
		getBounds,
		getBlockClipPath,
	} = props;

	const classes = classnames('maxi-clip-path-control', className);

	const clipPath = getLastBreakpointAttribute({
		target: `${prefix}clip-path`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const hasClipPath =
		isLayer || !isHover
			? getLastBreakpointAttribute({
					target: `${prefix}clip-path-status`,
					breakpoint,
					attributes: props,
					isHover,
			  })
			: getAttributeValue({
					target: 'clip-path-status',
					isHover: true,
					prefix,
					props,
			  });

	const deconstructCP = (clipPathToDeconstruct = clipPath) => {
		if (isEmpty(clipPathToDeconstruct) || clipPathToDeconstruct === 'none')
			return normalizeClipPathOptions({
				type: 'polygon',
				content: cloneDeep(typeDefaults.polygon),
			});

		const cpType = clipPathToDeconstruct.match(/^[^(]+/gi)[0];
		const cpValues = [];

		const parseClipPathContent = content => {
			const newItem = [];
			content.split(' ').forEach(item => {
				const match = item.match(/^([\d.]+)(\D+)$/);
				if (!match) return;
				newItem.push({
					value: Number(match?.[1]),
					unit: match?.[2],
				});
			});
			cpValues.push(newItem);
		};

		let cpContent = [];

		switch (cpType) {
			case 'polygon':
				cpContent = clipPathToDeconstruct
					.replace(cpType, '')
					.replace('(', '')
					.replace(')', '');

				cpContent
					.split(', ')
					.forEach(value => parseClipPathContent(value));
				break;
			case 'circle':
				cpContent = clipPathToDeconstruct
					.replace(cpType, '')
					.replace('(', '')
					.replace(')', '');

				cpContent
					.split('at ')
					.forEach(value => parseClipPathContent(value));
				break;
			case 'ellipse':
				cpContent = clipPathToDeconstruct
					.replace(cpType, '')
					.replace('(', '')
					.replace(')', '');

				// eslint-disable-next-line no-case-declarations
				const result = cpContent.split(' at ');

				[...result[0].split(' '), result[1]].forEach(value =>
					parseClipPathContent(value.trim())
				);
				break;
			case 'inset':
				cpContent = clipPathToDeconstruct
					.replace(cpType, '')
					.replace('(', '')
					.replace(')', '')
					.replace('at ', '');

				cpContent
					.split(' ')
					.forEach(value => parseClipPathContent(value));
				break;
			case 'none':
				break;
			default:
				return normalizeClipPathOptions({
					type: 'polygon',
					content: cloneDeep(typeDefaults.polygon),
				});
		}

		return normalizeClipPathOptions({
			type: cpType,
			content: { ...cpValues },
		});
	};

	const [customMode, setCustomMode] = useState('visual');

	const [clipPathOptions, changeClipPathOptions] = useState(deconstructCP());

	const [isCustom, changeIsCustom] = useState(
		!(
			Object.values(clipPathDefaults).includes(clipPath) ||
			isEmpty(clipPath) ||
			clipPath === 'none'
		)
	);

	useEffect(() => {
		const parsedClipPath = deconstructCP();
		if (JSON.stringify(clipPathOptions) !== JSON.stringify(parsedClipPath))
			changeClipPathOptions(parsedClipPath);
	}, [clipPath, clipPathOptions]);

	const onChangeValue = (val, meta) => {
		onChange({
			[getAttributeKey('clip-path', isHover, prefix, breakpoint)]: val,
			meta,
		});
	};

	const generateCP = (clipPath, meta) => {
		const normalized = normalizeClipPathOptions(clipPath);
		const newCP = getClipPath(normalized);

		onChangeValue(newCP, meta);
		changeClipPathOptions(normalized);
	};

	const onChangeType = newType => {
		const newCP = {
			...clipPathOptions,
			type: newType,
			content: cloneDeep(typeDefaults[newType]),
		};

		changeClipPathOptions(newCP);
		generateCP(newCP);
	};

	const onToggleClipPath = val => {
		onChange({
			[getAttributeKey('clip-path-status', isHover, prefix, breakpoint)]:
				val,
		});
	};

	return (
		<div className={classes}>
			{(isLayer || !isHover) && (
				<ToggleSwitch
					label={__('Use clip-path', 'maxi-blocks')}
					selected={hasClipPath}
					onChange={val => onToggleClipPath(val)}
				/>
			)}
			{hasClipPath && (
				<>
					<ToggleSwitch
						className='clip-path-custom'
						label={__('Custom clip-path', 'maxi-blocks')}
						selected={isCustom}
						onChange={val => {
							changeIsCustom(val);
							if (val && clipPath !== 'none') {
								changeClipPathOptions(deconstructCP(clipPath));
							}
						}}
					/>
					{!isCustom && (
						<div className='clip-path-defaults'>
							<Tooltip
								key='clip-path-defaults__item__none'
								text={__('none', 'maxi-blocks')}
								placement='top'
							>
								<Button
									aria-pressed={['', 'none'].includes(
										clipPath
									)}
									className='clip-path-defaults__items clip-path-defaults__items__none'
									onClick={() => onChangeValue('none')}
								>
									<Icon icon={styleNone} />
								</Button>
							</Tooltip>
							{Object.entries(clipPathDefaults).map(
								([name, newClipPath]) => (
									<Tooltip
										key={`clip-path-defaults__item__${name}`}
										text={name}
										placement='bottom'
									>
										<Button
											aria-pressed={
												newClipPath === clipPath
											}
											className='clip-path-defaults__items'
											onClick={() => {
												if (newClipPath === clipPath)
													return;

												if (isCustom) {
													const deconstructed =
														deconstructCP(
															newClipPath
														);

													generateCP(deconstructed);
												} else {
													onChangeValue(newClipPath);
												}
											}}
										>
											<span
												className='clip-path-defaults__clip-path'
												style={{
													clipPath: newClipPath,
												}}
											/>
										</Button>
									</Tooltip>
								)
							)}
						</div>
					)}
					{isCustom && (
						<div className='maxi-clip-path-control__handles'>
							<SelectControl
								__nextHasNoMarginBottom
								label={__('Type', 'maxi-blocks')}
								value={clipPathOptions.type}
								options={[
									{
										label: __('Polygon', 'maxi-blocks'),
										value: 'polygon',
									},
									{
										label: __('Circle', 'maxi-blocks'),
										value: 'circle',
									},
									{
										label: __('Ellipse', 'maxi-blocks'),
										value: 'ellipse',
									},
									{
										label: __('Inset', 'maxi-blocks'),
										value: 'inset',
									},
								]}
								onChange={value => onChangeType(value)}
							/>
							<SettingTabsControl
								fullWidthMode
								type='buttons'
								selected={customMode}
								items={[
									{
										label: __('Visual', 'maxi-blocks'),
										value: 'visual',
									},
									{
										label: __('Edit Points', 'maxi-blocks'),
										value: 'data',
									},
								]}
								onChange={val => setCustomMode(val)}
							/>
							{customMode === 'visual' && (
								<ClipPathVisualEditor
									ref={visualEditorRef}
									getBounds={getBounds}
									clipPathOptions={clipPathOptions}
									clipPath={clipPath}
									colors={optionColors}
									onChange={clipPathOptions =>
										generateCP(clipPathOptions)
									}
								/>
							)}
							{customMode === 'data' && (
								<>
									{Object.entries(
										clipPathOptions.content
									).map(([key, handle]) => {
										const i = Number(key);

										return (
											<ClipPathOption
												key={`maxi-clip-path-control-${i}`}
												values={handle}
												number={i}
												type={clipPathOptions.type}
												getBounds={getBounds}
												onChange={value => {
													clipPathOptions.content[i] =
														value;
													generateCP(clipPathOptions);
												}}
												onReset={coordIndex => {
													const breakpoints = [
														'general',
														'xxl',
														'xl',
														'l',
														'm',
														's',
														'xs',
													];
													const higherBreakpoint =
														breakpoints[
															breakpoints.indexOf(
																breakpoint
															) - 1
														];

													let newValue;
													let resetToDefault = false;
													if (
														higherBreakpoint ||
														isHover ||
														isIB
													) {
														const oneBreakpointHigherClipPath =
															deconstructCP(
																getLastBreakpointAttribute(
																	{
																		target: `${prefix}clip-path`,
																		breakpoint:
																			higherBreakpoint ??
																			breakpoint,
																		attributes:
																			isIB &&
																			!higherBreakpoint
																				? getBlockClipPath()
																				: props,
																		isHover:
																			isHover &&
																			higherBreakpoint,
																	}
																)
															);

														if (
															oneBreakpointHigherClipPath.type !==
															clipPathOptions.type
														) {
															resetToDefault = true;
														} else {
															newValue =
																oneBreakpointHigherClipPath
																	?.content?.[
																	i
																]?.[coordIndex];
														}
													} else {
														resetToDefault = true;
													}

													if (resetToDefault)
														newValue = cloneDeep(
															typeDefaults[
																clipPathOptions
																	.type
															]?.[i]?.[coordIndex]
														);

													if (
														isEqual(
															newValue,
															clipPathOptions
																.content[i][
																coordIndex
															]
														)
													)
														return;

													clipPathOptions.content[i][
														coordIndex
													] = newValue;

													generateCP(clipPathOptions);
												}}
												onRemove={number => {
													delete clipPathOptions
														.content[number];
													generateCP(clipPathOptions);
												}}
											/>
										);
									})}
									{clipPathOptions.type === 'polygon' &&
										Object.keys(clipPathOptions.content)
											.length < 100 && (
											<Button
												className='maxi-clip-path-control__handles maxi-clip-path-add-point-button'
												onClick={() => {
													clipPathOptions.content = {
														...clipPathOptions.content,
														[Object.keys(
															clipPathOptions.content
														).length]: [
															{
																value: 0,
																unit: '%',
															},
															{
																value: 0,
																unit: '%',
															},
														],
													};
													generateCP(clipPathOptions);
												}}
											>
												{__(
													'Add new point',
													'maxi-blocks'
												)}
											</Button>
										)}
								</>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default withRTC(ClipPathControl);
