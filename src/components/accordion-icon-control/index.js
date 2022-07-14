/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	SelectControl,
	SettingTabsControl,
	AdvancedNumberControl,
	ToggleSwitch,
} from '..';
import MaxiModal from '../../editor/library/modal';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import IconColor from './IconColor';

const AccordionIconSettings = props => {
	const { onChange, blockStyle, svgType, svgTypeActive, breakpoint } = props;

	const defaultWidth = getDefaultAttribute(`icon-width-${breakpoint}`);
	const defaultWidthUnit = getDefaultAttribute(
		`icon-width-unit-${breakpoint}`
	);

	return (
		<>
			<SelectControl
				label={__('Icon position', 'maxi-blocks')}
				options={[
					{
						label: 'Right',
						value: 'right',
					},
					{
						label: 'Left',
						value: 'left',
					},
				]}
				value={props['icon-position']}
				onChange={val =>
					onChange({
						'icon-position': val,
					})
				}
			/>
			<MaxiModal
				type='accordion-icon'
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props['icon-content']}
				label='Icon'
			/>
			<MaxiModal
				type='accordion-icon-active'
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props['active-icon-content']}
				label='Active icon'
			/>
			<SettingTabsControl
				items={[
					props['icon-content'] !== '' && {
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<>
								{(props['icon-content'] !== '' ||
									props['active-icon-content'] !== '') && (
									<AdvancedNumberControl
										label={__('Width', 'maxi-blocks')}
										value={
											getLastBreakpointAttribute({
												target: 'icon-width',
												breakpoint,
												attributes: props,
											}) || defaultWidth
										}
										placeholder={getLastBreakpointAttribute(
											{
												target: 'icon-width',
												breakpoint,
												attributes: props,
											}
										)}
										onChangeValue={val => {
											const newVal =
												val !== undefined ? val : '';

											onChange({
												[getAttributeKey(
													'width',
													false,
													'icon-',
													breakpoint
												)]: newVal,
											});
										}}
										enableUnit
										unit={getLastBreakpointAttribute({
											target: 'icon-width-unit',
											breakpoint,
											attributes: props,
										})}
										allowedUnits={['px', 'vw', '%']}
										onChangeUnit={val => {
											onChange({
												[getAttributeKey(
													'width-unit',
													false,
													'icon-',
													breakpoint
												)]: val,
											});
										}}
										min={10}
										max={500}
										step={1}
										onReset={() =>
											onChange({
												[getAttributeKey(
													'width',
													false,
													'icon-',
													breakpoint
												)]: defaultWidth,
												[getAttributeKey(
													'width-unit',
													false,
													'icon-',
													breakpoint
												)]: defaultWidthUnit,
											})
										}
										defaultValue={defaultWidth}
										initialPosition={defaultWidth}
										optionType='string'
									/>
								)}
								{props['icon-content'] !== '' && (
									<SettingTabsControl
										items={[
											{
												label: __(
													'Normal state',
													'maxi-blocks'
												),
												content: (
													<>
														{svgType !==
															'Shape' && (
															<IconColor
																colorType='stroke'
																prefix='icon-'
																{...props}
															/>
														)}
														{svgType !== 'Line' && (
															<IconColor
																colorType='fill'
																prefix='icon-'
																{...props}
															/>
														)}
													</>
												),
											},
											{
												label: __(
													'Hover state',
													'maxi-blocks'
												),
												content: (
													<>
														<ToggleSwitch
															label={__(
																'Enable Icon Hover',
																'maxi-blocks'
															)}
															selected={
																props[
																	'icon-status-hover'
																]
															}
															onChange={val =>
																onChange({
																	'icon-status-hover':
																		val,
																})
															}
														/>
														{props[
															'icon-status-hover'
														] &&
															svgType !==
																'Shape' && (
																<IconColor
																	colorType='stroke'
																	prefix='icon-'
																	isHover
																	{...props}
																/>
															)}
														{props[
															'icon-status-hover'
														] &&
															svgType !==
																'Line' && (
																<IconColor
																	colorType='fill'
																	prefix='icon-'
																	isHover
																	{...props}
																/>
															)}
													</>
												),
											},
										]}
									/>
								)}
							</>
						),
					},
					props['active-icon-content'] !== '' && {
						label: __('Active state', 'maxi-blocks'),
						content: (
							<SettingTabsControl
								items={[
									{
										label: __(
											'Normal state',
											'maxi-blocks'
										),
										content: (
											<>
												{svgTypeActive !== 'Shape' && (
													<IconColor
														colorType='stroke'
														prefix='active-icon-'
														{...props}
													/>
												)}
												{svgTypeActive !== 'Line' && (
													<IconColor
														colorType='fill'
														prefix='active-icon-'
														{...props}
													/>
												)}
											</>
										),
									},
									{
										label: __('Hover state', 'maxi-blocks'),
										content: (
											<>
												<ToggleSwitch
													label={__(
														'Enable Icon Hover',
														'maxi-blocks'
													)}
													selected={
														props[
															'active-icon-status-hover'
														]
													}
													onChange={val =>
														onChange({
															'active-icon-status-hover':
																val,
														})
													}
												/>
												{props[
													'active-icon-status-hover'
												] &&
													svgTypeActive !==
														'Shape' && (
														<IconColor
															colorType='stroke'
															prefix='active-icon-'
															isHover
															{...props}
														/>
													)}
												{props[
													'active-icon-status-hover'
												] &&
													svgTypeActive !==
														'Line' && (
														<IconColor
															colorType='fill'
															prefix='active-icon-'
															isHover
															{...props}
														/>
													)}
											</>
										),
									},
								]}
							/>
						),
					},
				]}
			/>
		</>
	);
};
export default AccordionIconSettings;
