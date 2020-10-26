/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, Fragment } = wp.element;
const { SelectControl, BaseControl, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import clipPathDefaults from './defaults';
import ClipPathVisualEditor from './visualEditor';
import __experimentalFancyRadioControl from '../fancy-radio-control';
import SettingTabsControl from '../setting-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isArray, isEmpty, isNil, trim, uniqueId } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

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
							values[0] = Number(e.target.value);
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
								values[1] = Number(e.target.value);
								onChange(values);
							}}
							min={0}
							max={100}
						/>
					)}
				</div>
			</BaseControl>
			{type === 'polygon' && (
				<div className='maxi-clip-path-controller__handle maxi-clip-path-delete-handle'>
					<span onClick={() => onRemove(number)} />
				</div>
			)}
		</div>
	);
};

const ClipPathControl = props => {
	const { clipPath, className, onChange } = props;

	const [hasClipPath, changeHasClipPath] = useState(
		isEmpty(clipPath) ? 0 : 1
	);
	const [isCustom, changeIsCustom] = useState(
		Object.values(clipPathDefaults).includes(clipPath) || isEmpty(clipPath)
			? 0
			: 1
	);

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
			content: cpValues,
		};
	};

	const cp = deconstructCP();

	const generateCP = (type = cp.type) => {
		let newContent = '';

		switch (type) {
			case 'polygon':
				newContent = cp.content.reduce((a, b) => {
					if (isArray(a))
						return `${a[0]}% ${a[1]}%, ${b[0]}% ${b[1]}%`;
					return `${a}, ${b[0]}% ${b[1]}%`;
				});
				break;
			case 'circle':
				newContent = `${cp.content[0]}% at ${cp.content[1]}% ${cp.content[2]}%`;
				break;
			case 'ellipse':
				newContent = `${cp.content[0]}% ${cp.content[1]}% at ${cp.content[2]}% ${cp.content[3]}%`;
				break;
			case 'inset':
				newContent = `${cp.content[0]}% ${cp.content[1]}% ${cp.content[2]}% ${cp.content[3]}%`;
				break;
			default:
				return false;
		}
		const newCP = `${cp.type}(${newContent})`;

		onChange(newCP);

		return true;
	};

	const onChangeType = newType => {
		switch (newType) {
			case 'polygon':
				cp.content = [
					[0, 0],
					[100, 0],
					[100, 100],
					[0, 100],
				];
				generateCP(newType);
				break;
			case 'circle':
				cp.content = [[50], [50], [50]];
				generateCP(newType);
				break;
			case 'ellipse':
				cp.content = [[50], [50], [50], [50]];
				generateCP(newType);
				break;
			case 'inset':
				cp.content = [[15], [5], [15], [5]];
				generateCP(newType);
				break;
			default:
				return false;
		}

		return false;
	};

	const classes = classnames('maxi-clip-path-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Use Clip-path', 'maxi-blocks')}
				selected={hasClipPath}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={value => changeHasClipPath(Number(value))}
			/>
			{!!hasClipPath && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Use custom', 'maxi-blocks')}
						selected={isCustom}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={value => changeIsCustom(Number(value))}
					/>
					{!isCustom && (
						<div className='clip-path-defaults'>
							{Object.entries(clipPathDefaults).map(
								([name, clipPath]) => (
									<Tooltip
										text={name}
										position='bottom center'
									>
										<Button
											className='clip-path-defaults__items'
											onClick={() => onChange(clipPath)}
										>
											<span
												className='clip-path-defaults__clip-path'
												style={{ clipPath }}
											/>
										</Button>
									</Tooltip>
								)
							)}
						</div>
					)}
					{!!isCustom && (
						<div className='maxi-clip-path-control__handles'>
							<SelectControl
								label={__('Type', 'maxi-blocks')}
								value={cp.type}
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
								onChange={value => {
									cp.type = value;
									onChangeType(value);
									generateCP();
								}}
							/>
							<SettingTabsControl
								items={[
									{
										label: __('Visual', 'maxi-blocks'),
										content: (
											<ClipPathVisualEditor
												clipPathOptions={cp}
												colors={optionColors}
												onChange={clipPath =>
													onChange(clipPath)
												}
											/>
										),
									},
									{
										label: __('Data', 'maxi-blocks'),
										content: (
											<Fragment>
												{cp.content.map((handle, i) => (
													<ClipPathOption
														key={uniqueId(
															'maxi-clip-path-control-'
														)}
														values={handle}
														onChange={value => {
															cp.content[
																i
															] = value;
															generateCP();
														}}
														onRemove={number => {
															if (cp.content < 2)
																delete cp
																	.content[
																	number
																];
															generateCP();
														}}
														number={i}
														type={cp.type}
													/>
												))}
												{cp.type === 'polygon' &&
													cp.content.length < 10 && (
														<Button
															className='maxi-clip-path-control__handles'
															onClick={() => {
																cp.content.push(
																	[0, 0]
																);
																generateCP();
															}}
														>
															Add new point
														</Button>
													)}
											</Fragment>
										),
									},
								]}
							/>
						</div>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default ClipPathControl;
