/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import SettingTabsControl from '../setting-tabs-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import ColorControl from '../color-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getColorRGBAString,
} from '../../extensions/styles';
import {
	setSVGStrokeWidth,
	setSVGContent,
	setSVGContentHover,
} from '../../extensions/svg';
import SvgWidthControl from '../svg-width-control';
import SvgStrokeWidthControl from '../svg-stroke-width-control';
import MaxiModal from '../../editor/library/modal';
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import { iconBorder, iconFill } from '../../icons';

/**
 * Component
 */
const NavigationIconControl = props => {
	const {
		className,
		onChangeInline = null,
		onChange,
		svgType = 'Line',
		breakpoint,
		blockStyle,
		isHover = false,
		prefix,
	} = props;

	const classes = classnames('maxi-icon-control', className);

	const [iconStyle, setIconStyle] = useState('color');

	const getOptions = () => {
		const options = [];

		if (svgType !== 'Shape')
			options.push({
				icon: <Icon icon={iconBorder} />,
				value: 'color',
			});
		else if (iconStyle === 'color') setIconStyle('fill');

		if (svgType !== 'Line')
			options.push({
				icon: <Icon icon={iconFill} />,
				value: 'fill',
			});
		else if (iconStyle === 'fill') setIconStyle('color');

		return options;
	};

	const shortPrefix =
		prefix === 'navigation-arrow-both-icon'
			? 'navigation-arrow'
			: 'navigation-dot';

	console.log('prefix', prefix);
	console.log('shortPrefix', shortPrefix);

	return (
		<div className={classes}>
			{!isHover &&
				breakpoint === 'general' &&
				shortPrefix === 'navigation-arrow' && (
					<>
						<MaxiModal
							type='navigation-icon'
							title={__('Add first arrow icon', 'maxi-blocks')}
							style={blockStyle}
							onSelect={obj => onChange(obj)}
							onRemove={obj => onChange(obj)}
							icon={props[`${shortPrefix}-first-icon-content`]}
							prefix={`${shortPrefix}-first-`}
						/>
						<MaxiModal
							type='navigation-icon'
							title={__('Add second arrow icon', 'maxi-blocks')}
							style={blockStyle}
							onSelect={obj => onChange(obj)}
							onRemove={obj => onChange(obj)}
							icon={props[`${shortPrefix}-second-icon-content`]}
							prefix={`${shortPrefix}-second-`}
						/>
					</>
				)}
			{!isHover &&
				breakpoint === 'general' &&
				shortPrefix === 'navigation-dot' && (
					<MaxiModal
						type='navigation-icon'
						title={__('Add dot icon', 'maxi-blocks')}
						style={blockStyle}
						onSelect={obj => onChange(obj)}
						onRemove={obj => onChange(obj)}
						icon={props[`${shortPrefix}-icon-content`]}
						prefix={`${shortPrefix}-`}
					/>
				)}
			{(props['navigation-arrow-first-icon-content'] ||
				props['navigation-arrow-second-icon-content'] ||
				props['navigation-dot-icon-content']) && (
				<>
					<ResponsiveTabsControl breakpoint={breakpoint}>
						<>
							<SvgWidthControl
								{...getGroupAttributes(
									props,
									shortPrefix === 'navigation-dot'
										? `dotIcon${isHover ? 'Hover' : ''}`
										: `arrowIcon${isHover ? 'Hover' : ''}`,
									isHover
								)}
								onChange={onChange}
								prefix={`${prefix}-`}
								breakpoint={breakpoint}
								isHover={isHover}
							/>
							<SvgStrokeWidthControl
								{...getGroupAttributes(
									props,
									shortPrefix === 'navigation-dot'
										? `dotIcon${isHover ? 'Hover' : ''}`
										: `arrowIcon${isHover ? 'Hover' : ''}`,
									isHover
								)}
								onChange={obj => {
									shortPrefix === 'navigation-arrow' &&
										onChange({
											...obj,
											'navigation-arrow-first-icon-content':
												setSVGStrokeWidth(
													props[
														'navigation-arrow-first-icon-content'
													],
													obj[
														`${prefix}-stroke-${breakpoint}${
															isHover
																? '-hover'
																: ''
														}`
													]
												),
											'navigation-arrow-second-icon-content':
												setSVGStrokeWidth(
													props[
														'navigation-arrow-second-icon-content'
													],
													obj[
														`${prefix}-stroke-${breakpoint}${
															isHover
																? '-hover'
																: ''
														}`
													]
												),
										});
									shortPrefix === 'navigation-dot' &&
										onChange({
											...obj,
											'navigation-dot-icon-content':
												setSVGStrokeWidth(
													props[
														'navigation-dot-icon-content'
													],
													obj[
														`${prefix}-stroke-${breakpoint}${
															isHover
																? '-hover'
																: ''
														}`
													]
												),
										});
								}}
								prefix={`${prefix}-`}
								breakpoint={breakpoint}
								isHover={isHover}
							/>
							<AdvancedNumberControl
								label={__('Horizontal Spacing', 'maxi-blocks')}
								min={-300}
								max={300}
								initial={1}
								step={1}
								breakpoint={breakpoint}
								value={
									props[
										`${prefix}-spacing-horizontal-${breakpoint}${
											isHover ? '-hover' : ''
										}`
									]
								}
								onChangeValue={val => {
									onChange({
										[`${prefix}-spacing-horizontal-${breakpoint}${
											isHover ? '-hover' : ''
										}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								onReset={() =>
									onChange({
										[`${prefix}-spacing-horizontal-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: getDefaultAttribute(
											`${prefix}-spacing-horizontal-${breakpoint}${
												isHover ? '-hover' : ''
											}`
										),
									})
								}
								isHover={isHover}
							/>
							<AdvancedNumberControl
								label={__('Vertical Spacing', 'maxi-blocks')}
								min={-100}
								max={200}
								initial={1}
								step={1}
								breakpoint={breakpoint}
								value={
									props[
										`${prefix}-spacing-vertical-${breakpoint}${
											isHover ? '-hover' : ''
										}`
									]
								}
								onChangeValue={val => {
									onChange({
										[`${prefix}-spacing-vertical-${breakpoint}${
											isHover ? '-hover' : ''
										}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								onReset={() =>
									onChange({
										[`${prefix}-spacing-vertical-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: getDefaultAttribute(
											`${prefix}-spacing-vertical-${breakpoint}${
												isHover ? '-hover' : ''
											}`
										),
									})
								}
								isHover={isHover}
							/>
						</>
					</ResponsiveTabsControl>
					<SettingTabsControl
						label=''
						className='maxi-icon-styles-control'
						type='buttons'
						fullWidthMode
						selected={iconStyle}
						items={getOptions()}
						onChange={val => setIconStyle(val)}
					/>
					{iconStyle === 'color' && svgType !== 'Shape' && (
						<ColorControl
							label={__('Icon line', 'maxi-blocks')}
							color={
								props[
									`${prefix}-stroke-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							prefix={`${prefix}-stroke-`}
							avoidBreakpointForDefault
							paletteColor={
								props[
									`${prefix}-stroke-palette-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteOpacity={
								props[
									`${prefix}-stroke-palette-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteStatus={
								props[
									`${prefix}-stroke-palette-status${
										isHover ? '-hover' : ''
									}`
								]
							}
							onChangeInline={({ color }) =>
								onChangeInline &&
								onChangeInline(
									{ stroke: color },
									'[data-stroke]',
									true
								)
							}
							onChange={({
								color,
								paletteColor,
								paletteStatus,
								paletteOpacity,
							}) => {
								const strokeColorStr = getColorRGBAString({
									firstVar: `${prefix}-stroke${
										isHover ? '-hover' : ''
									}`,
									secondVar: `color-${paletteColor}${
										isHover ? '-hover' : ''
									}`,
									opacity: paletteOpacity,
									blockStyle,
								});

								onChange({
									[`${prefix}-stroke-color${
										isHover ? '-hover' : ''
									}`]: color,
									[`${prefix}-stroke-palette-color${
										isHover ? '-hover' : ''
									}`]: paletteColor,
									[`${prefix}-stroke-palette-status${
										isHover ? '-hover' : ''
									}`]: paletteStatus,
									[`${prefix}-stroke-palette-opacity${
										isHover ? '-hover' : ''
									}`]: paletteOpacity,
									'navigation-arrow-first-icon-content':
										isHover
											? setSVGContentHover(
													props[
														'navigation-arrow-first-icon-content'
													],
													paletteStatus
														? strokeColorStr
														: color,
													'stroke'
											  )
											: setSVGContent(
													props[
														'navigation-arrow-first-icon-content'
													],
													paletteStatus
														? strokeColorStr
														: color,
													'stroke'
											  ),
									'navigation-arrow-second-icon-content':
										isHover
											? setSVGContentHover(
													props[
														'navigation-arrow-second-icon-content'
													],
													paletteStatus
														? strokeColorStr
														: color,
													'stroke'
											  )
											: setSVGContent(
													props[
														'navigation-arrow-second-icon-content'
													],
													paletteStatus
														? strokeColorStr
														: color,
													'stroke'
											  ),
								});
							}}
							isHover={isHover}
						/>
					)}
					{iconStyle === 'fill' && svgType !== 'Line' && (
						<ColorControl
							label={__('Icon fill', 'maxi-blocks')}
							color={
								props[
									`${prefix}-fill-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							prefix={`${prefix}-fill-`}
							avoidBreakpointForDefault
							paletteColor={
								props[
									`${prefix}-fill-palette-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteOpacity={
								props[
									`${prefix}-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteStatus={
								props[
									`${prefix}-fill-palette-status${
										isHover ? '-hover' : ''
									}`
								]
							}
							onChangeInline={({ color }) =>
								onChangeInline &&
								onChangeInline(
									{ fill: color },
									'[data-fill]',
									true
								)
							}
							onChange={({
								color,
								paletteColor,
								paletteStatus,
								paletteOpacity,
							}) => {
								const fillColorStr = getColorRGBAString({
									firstVar: `${prefix}-fill${
										isHover ? '-hover' : ''
									}`,
									secondVar: `color-${paletteColor}${
										isHover ? '-hover' : ''
									}`,
									opacity: paletteOpacity,
									blockStyle,
								});

								onChange({
									[`${prefix}-fill-color${
										isHover ? '-hover' : ''
									}`]: color,
									[`${prefix}-fill-palette-color${
										isHover ? '-hover' : ''
									}`]: paletteColor,
									[`${prefix}-fill-palette-status${
										isHover ? '-hover' : ''
									}`]: paletteStatus,
									[`${prefix}-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`]: paletteOpacity,
									[`${prefix}-content`]: isHover
										? setSVGContentHover(
												props[
													'navigation-arrow-first-icon-content'
												],
												paletteStatus
													? fillColorStr
													: color,
												'fill'
										  )
										: setSVGContent(
												props[
													'navigation-arrow-first-icon-content'
												],
												paletteStatus
													? fillColorStr
													: color,
												'fill'
										  ),
								});
							}}
							isHover={isHover}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default NavigationIconControl;
