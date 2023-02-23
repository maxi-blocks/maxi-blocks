/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import Button from '../button';
import SelectControl from '../select-control';
import BaseControl from '../base-control';
import clipPathDefaults from './defaults';
import ClipPathVisualEditor from './visualEditor';
import Icon from '../icon';
import ToggleSwitch from '../toggle-switch';
import SettingTabsControl from '../setting-tabs-control';
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getAttributeValue,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
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
import { styleNone } from '../../icons';

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
									onChangeValue={value => {
										values[index].value = value || 0;
										onChange(values);
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
		if (isEmpty(clipPathToDeconstruct) || clipPath === 'none')
			return {
				type: 'polygon',
				content: cloneDeep(typeDefaults.polygon),
			};

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
				return false;
		}

		return {
			type: cpType,
			content: { ...cpValues },
		};
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
		if (JSON.stringify(clipPathOptions) !== JSON.stringify(deconstructCP()))
			changeClipPathOptions(deconstructCP());
	}, [clipPath, clipPathOptions]);

	const onChangeValue = val => {
		onChange({
			[getAttributeKey('clip-path', isHover, prefix, breakpoint)]: val,
		});
	};

	const generateCP = clipPath => {
		const newCP = getClipPath(clipPath);

		onChangeValue(newCP);
		changeClipPathOptions(clipPath);
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
						onChange={val => changeIsCustom(val)}
					/>
					{!isCustom && (
						<div className='clip-path-defaults'>
							<Tooltip
								key='clip-path-defaults__item__none'
								text={__('none', 'maxi-blocks')}
								position='top center'
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
										position='bottom center'
									>
										<Button
											aria-pressed={
												newClipPath === clipPath
											}
											className='clip-path-defaults__items'
											onClick={() =>
												newClipPath !== clipPath &&
												onChangeValue(newClipPath)
											}
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
												className='maxi-clip-path-control__handles'
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
