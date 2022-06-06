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
const ArrowIconControl = props => {
	const {
		className,
		onChangeInline = null,
		onChange,
		svgType = 'Line',
		breakpoint,
		blockStyle,
		isHover = false,
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

	return (
		<div className={classes}>
			{!isHover && breakpoint === 'general' && (
				<>
					<MaxiModal
						type='arrow-icon'
						title={__('Add first arrow icon', 'maxi-blocks')}
						style={blockStyle}
						onSelect={obj => onChange(obj)}
						onRemove={obj => onChange(obj)}
						icon={props['navigation-arrow-first-icon-content']}
						prefix='navigation-arrow-first-'
					/>
					<MaxiModal
						type='arrow-icon'
						title={__('Add second arrow icon', 'maxi-blocks')}
						style={blockStyle}
						onSelect={obj => onChange(obj)}
						onRemove={obj => onChange(obj)}
						icon={props['navigation-arrow-second-icon-content']}
						prefix='navigation-arrow-second-'
					/>
				</>
			)}
			{(props['navigation-arrow-first-icon-content'] ||
				props['navigation-arrow-second-icon-content']) && (
				<>
					<SvgWidthControl
						{...getGroupAttributes(
							props,
							`arrowIcon${isHover ? 'Hover' : ''}`,
							isHover
						)}
						onChange={onChange}
						prefix='navigation-arrow-both-icon-'
						breakpoint={breakpoint}
						isHover={isHover}
					/>
					<SvgStrokeWidthControl
						{...getGroupAttributes(
							props,
							`arrowIcon${isHover ? 'Hover' : ''}`,
							isHover
						)}
						onChange={obj => {
							onChange({
								...obj,
								'navigation-arrow-first-icon-content':
									setSVGStrokeWidth(
										props[
											'navigation-arrow-first-icon-content'
										],
										obj[
											`navigation-arrow-both-icon-stroke-${breakpoint}${
												isHover ? '-hover' : ''
											}`
										]
									),
							});
						}}
						prefix='navigation-arrow-both-icon-'
						breakpoint={breakpoint}
						isHover={isHover}
					/>
					{!isHover && (
						<AdvancedNumberControl
							label={__('Spacing', 'maxi-blocks')}
							min={-999}
							max={999}
							initial={1}
							step={1}
							breakpoint={breakpoint}
							value={
								props[
									`navigation-arrow-both-icon-spacing-${breakpoint}`
								]
							}
							onChangeValue={val => {
								onChange({
									[`navigation-arrow-both-icon-spacing-${breakpoint}`]:
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							onReset={() =>
								onChange({
									[`navigation-arrow-both-icon-spacing-${breakpoint}`]:
										getDefaultAttribute(
											`navigation-arrow-both-icon-spacing-${breakpoint}`
										),
								})
							}
						/>
					)}
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
							label={__('Icon stroke', 'maxi-blocks')}
							className='maxi-icon-styles-control--color'
							avoidBreakpointForDefault
							color={
								props[
									`navigation-arrow-both-icon-stroke-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							prefix='navigation-arrow-both-icon-stroke-'
							paletteColor={
								props[
									`navigation-arrow-both-icon-stroke-palette-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteOpacity={
								props[
									`navigation-arrow-both-icon-stroke-palette-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteStatus={
								props[
									`navigation-arrow-both-icon-stroke-palette-status${
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
								const lineColorStr = getColorRGBAString({
									firstVar: `navigation-arrow-both-icon-stroke${
										isHover ? '-hover' : ''
									}`,
									secondVar: `color-${paletteColor}${
										isHover ? '-hover' : ''
									}`,
									opacity: paletteOpacity,
									blockStyle,
								});

								onChange({
									[`navigation-arrow-both-icon-stroke-color${
										isHover ? '-hover' : ''
									}`]: color,
									[`navigation-arrow-both-icon-stroke-palette-color${
										isHover ? '-hover' : ''
									}`]: paletteColor,
									[`navigation-arrow-both-icon-stroke-palette-status${
										isHover ? '-hover' : ''
									}`]: paletteStatus,
									[`navigation-arrow-both-icon-stroke-palette-opacity${
										isHover ? '-hover' : ''
									}`]: paletteOpacity,
									'navigation-arrow-first-icon-content':
										isHover
											? setSVGContentHover(
													props[
														'navigation-arrow-first-icon-content'
													],
													paletteStatus
														? lineColorStr
														: color,
													'stroke'
											  )
											: setSVGContent(
													props[
														'navigation-arrow-first-icon-content'
													],
													paletteStatus
														? lineColorStr
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
														? lineColorStr
														: color,
													'stroke'
											  )
											: setSVGContent(
													props[
														'navigation-arrow-second-icon-content'
													],
													paletteStatus
														? lineColorStr
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
									`navigation-arrow-both-icon-fill-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							prefix='navigation-arrow-both-icon-fill-'
							avoidBreakpointForDefault
							paletteColor={
								props[
									`navigation-arrow-both-icon-fill-palette-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteOpacity={
								props[
									`navigation-arrow-both-icon-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteStatus={
								props[
									`navigation-arrow-both-icon-fill-palette-status${
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
									firstVar: `navigation-arrow-both-icon-fill${
										isHover ? '-hover' : ''
									}`,
									secondVar: `color-${paletteColor}${
										isHover ? '-hover' : ''
									}`,
									opacity: paletteOpacity,
									blockStyle,
								});

								onChange({
									[`navigation-arrow-both-icon-fill-color${
										isHover ? '-hover' : ''
									}`]: color,
									[`navigation-arrow-both-icon-fill-palette-color${
										isHover ? '-hover' : ''
									}`]: paletteColor,
									[`navigation-arrow-both-icon-fill-palette-status${
										isHover ? '-hover' : ''
									}`]: paletteStatus,
									[`navigation-arrow-both-icon-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`]: paletteOpacity,
									'navigation-arrow-both-icon--content':
										isHover
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

export default ArrowIconControl;
