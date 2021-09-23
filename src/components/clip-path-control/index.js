/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../button';
import SelectControl from '../select-control';
import BaseControl from '../base-control';
import clipPathDefaults from './defaults';
import ClipPathVisualEditor from './visualEditor';
import Icon from '../icon';
import FancyRadioControl from '../fancy-radio-control';
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isArray, isEmpty, isNil, trim } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { styleNone } from '../../icons';

/**
 * Component
 */
const optionColors = [
	'red',
	'blue',
	'pink',
	'green',
	'yellow',
	'grey',
	'brown',
	'orange',
	'black',
	'violet',
];

const ClipPathOption = props => {
	const { values, onChange, onRemove, number, type } = props;

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
					<input
						type='number'
						value={trim(Number(values[0]))}
						onChange={e => {
							let value = +e.target.value;

							if (value > 100) value = 100;
							if (value < 0) value = 0;

							values[0] = value;

							onChange(values);
						}}
						min={0}
						max={100}
					/>
					{!isNil(values[1]) && (
						<input
							type='number'
							value={trim(Number(values[1]))}
							onChange={e => {
								let value = +e.target.value;

								if (value > 100) value = 100;
								if (value < 0) value = 0;

								values[1] = value;

								onChange(values);
							}}
							min={0}
							max={100}
						/>
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
	const { clipPath, className, onChange } = props;

	const classes = classnames('maxi-clip-path-control', className);

	const deconstructCP = () => {
		if (isEmpty(clipPath))
			return {
				type: 'polygon',
				content: [],
			};

		const cpType = clipPath.match(/^[^(]+/gi)[0];
		const cpValues = [];
		let cpContent = [];

		switch (cpType) {
			case 'polygon':
				cpContent = clipPath
					.replace(cpType, '')
					.replace('(', '')
					.replace(')', '');

				cpContent.split(', ').forEach(value => {
					const newItem = value.trim().replace(/%/g, '').split(' ');
					newItem.forEach((item, i) => {
						newItem[i] = Number(item);
					});
					cpValues.push(newItem);
				});
				break;
			case 'circle':
				cpContent = clipPath
					.replace(cpType, '')
					.replace('(', '')
					.replace(')', '');

				cpContent.split('at ').forEach(value => {
					const newItem = value.trim().replace(/%/g, '').split(' ');
					newItem.forEach((item, i) => {
						if (!isEmpty(item)) newItem[i] = Number(item);
						else {
							delete newItem[i];
							newItem.length -= 1;
						}
					});
					cpValues.push(newItem);
				});
				break;
			case 'ellipse':
				cpContent = clipPath
					.replace(cpType, '')
					.replace('(', '')
					.replace(')', '');

				cpContent.split('at ').forEach((value, i) => {
					const newItem = value.trim().replace(/%/g, '').split(' ');
					newItem.forEach((item, j) => {
						if (i === 0) {
							cpValues.push([Number(item)]);
						} else if (!isEmpty(item)) newItem[j] = Number(item);
						else {
							delete newItem[j];
							newItem.length -= 1;
						}
					});
					if (i !== 0) cpValues.push(newItem);
				});
				break;
			case 'inset':
				cpContent = clipPath
					.replace(cpType, '')
					.replace('(', '')
					.replace(')', '')
					.replace('at ', '');

				cpContent.split(' ').forEach(value => {
					cpValues.push([Number(value.trim().replace(/%/g, ''))]);
				});
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

	const [hasClipPath, changeHasClipPath] = useState(!isEmpty(clipPath));
	const [isCustom, changeIsCustom] = useState(
		!(
			Object.values(clipPathDefaults).includes(clipPath) ||
			isEmpty(clipPath)
		)
	);

	useEffect(() => {
		if (JSON.stringify(clipPathOptions) !== JSON.stringify(deconstructCP()))
			changeClipPathOptions(deconstructCP());
	}, [clipPathOptions, deconstructCP]);

	const generateCP = clipPath => {
		const { type, content } = clipPath;
		const arrayContent = Object.values(content);

		let newContent = '';

		switch (type) {
			case 'polygon':
				newContent = arrayContent.reduce((a, b) => {
					if (isArray(a))
						return `${a[0]}% ${a[1]}%, ${b[0]}% ${b[1]}%`;
					return `${a}, ${b[0]}% ${b[1]}%`;
				});
				break;
			case 'circle':
				newContent = `${arrayContent[0][0]}% at ${arrayContent[1][0]}% ${arrayContent[1][1]}%`;
				break;
			case 'ellipse':
				newContent = `${arrayContent[0][0]}% ${arrayContent[1][0]}% at ${arrayContent[2][0]}% ${arrayContent[2][1]}%`;
				break;
			case 'inset':
				newContent = `${arrayContent[0][0]}% ${arrayContent[1][0]}% ${arrayContent[2][0]}% ${arrayContent[3][0]}%`;
				break;
			default:
				break;
		}
		const newCP = `${type}(${newContent})`;

		onChange(newCP);
	};

	const onChangeType = newType => {
		const newCP = clipPathOptions;

		switch (newType) {
			case 'polygon':
				newCP.type = 'polygon';
				newCP.content = {
					0: [0, 0],
					1: [100, 0],
					2: [100, 100],
					3: [0, 100],
				};
				break;
			case 'circle':
				newCP.type = 'circle';
				newCP.content = { 0: [50], 1: [50, 50] };
				break;
			case 'ellipse':
				newCP.type = 'ellipse';
				newCP.content = { 0: [25], 1: [50], 2: [50, 50] };
				break;
			case 'inset':
				newCP.type = 'inset';
				newCP.content = { 0: [15], 1: [5], 2: [15], 3: [5] };
				break;
			default:
				break;
		}

		changeClipPathOptions(newCP);
		generateCP(newCP);
	};

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Use Clip-path', 'maxi-blocks')}
				selected={hasClipPath}
				onChange={() => changeHasClipPath(!hasClipPath)}
			/>
			{hasClipPath && (
				<>
					<ToggleSwitch
						label={__('Use Custom', 'maxi-blocks')}
						selected={isCustom}
						onChange={() => changeIsCustom(!isCustom)}
					/>
					{!isCustom && (
						<div className='clip-path-defaults'>
							<Tooltip
								key='clip-path-defaults__item__none'
								text={__('none', 'maxi-blocks')}
								position='bottom center'
							>
								<Button
									aria-pressed={clipPath === ''}
									className='clip-path-defaults__items clip-path-defaults__items__none'
									onClick={() => onChange('')}
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
												onChange(newClipPath)
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
							<FancyRadioControl
								fullWidthMode
								selected={customMode}
								options={[
									{
										label: __('Visual', 'maxi-blocks'),
										value: 'visual',
									},
									{
										label: __('Edit Points', 'maxi-blocks'),
										value: 'data',
									},
								]}
								optionType='string'
								onChange={val => setCustomMode(val)}
							/>
							{customMode === 'visual' && (
								<ClipPathVisualEditor
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
												onChange={value => {
													clipPathOptions.content[i] =
														value;
													generateCP(clipPathOptions);
												}}
												onRemove={number => {
													delete clipPathOptions
														.content[number];
													generateCP(clipPathOptions);
												}}
												number={i}
												type={clipPathOptions.type}
											/>
										);
									})}
									{clipPathOptions.type === 'polygon' &&
										clipPathOptions.content.length < 10 && (
											<Button
												className='maxi-clip-path-control__handles'
												onClick={() => {
													clipPathOptions.content.push(
														[0, 0]
													);
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

export default ClipPathControl;
