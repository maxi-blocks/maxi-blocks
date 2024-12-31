/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import OpacityControl from '@components/opacity-control';
import ResetButton from '@components/reset-control';

/**
 * External dependencies
 */
import ChromePicker from 'react-color';
import tinycolor from 'tinycolor2';
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import './editor.scss';

/**
 * Component
 */
const CustomColorControl = props => {
	const {
		label,
		color,
		onChangeInlineValue,
		onChangeValue,
		disableColorDisplay,
		disableOpacity,
		isToolbar = false,
		disableReset,
		onReset,
		onResetOpacity,
	} = props;
	const [colorPicker, setColorPicker] = useState(color);
	const [isChanging, setIsChanging] = useState(false);

	useEffect(() => {
		if (!isChanging) setColorPicker(color);
	}, [color]);

	return (
		<>
			{!isToolbar && (
				<>
					{!disableColorDisplay && (
						<BaseControl
					__nextHasNoMarginBottom
							className='maxi-color-control__display'
							label={`${label} ${__('colour', 'maxi-blocks')}`}
						>
							<div className='maxi-color-control__display__color'>
								<span
									style={{
										background:
											tinycolor(
												colorPicker
											).toRgbString(),
									}}
								/>
							</div>
							{!disableReset && (
								<ResetButton
									onReset={e => {
										onReset();
									}}
									isSmall
								/>
							)}
						</BaseControl>
					)}
					{!disableOpacity && (
						<OpacityControl
							label={__('Colour opacity', 'maxi-blocks')}
							opacity={color.a}
							onChangeOpacity={val => {
								if (!isEmpty(color)) {
									color.a = val;

									onChangeValue({
										color: tinycolor(color).toRgbString(),
										paletteOpacity: val,
									});
								}
							}}
							onReset={onResetOpacity}
						/>
					)}
				</>
			)}
			{isToolbar && (
				<div className='maxi-color-control__wrap'>
					<BaseControl
					__nextHasNoMarginBottom
						className='maxi-color-control__display'
						label={`${label} ${__('colour', 'maxi-blocks')}`}
					>
						<div className='maxi-color-control__display__color'>
							<span
								style={{
									background: colorPicker,
								}}
							/>
						</div>
						{!disableReset && (
							<ResetButton
								onReset={e => {
									onReset();
								}}
								isSmall
							/>
						)}
					</BaseControl>
					<OpacityControl
						label={__('Colour opacity', 'maxi-blocks')}
						opacity={color.a}
						onChangeOpacity={val => {
							if (!isEmpty(color)) {
								color.a = val;

								onChangeValue({
									color: tinycolor(color).toRgbString(),
									paletteOpacity: val,
								});
							}
						}}
						onReset={onResetOpacity}
						disableLabel
					/>
				</div>
			)}
			<div className='maxi-color-control__color'>
				<ChromePicker
					color={colorPicker}
					onChange={val => {
						setIsChanging(true);
						const tempColor = tinycolor(val.rgb)
							.toRgbString()
							.replace(/\s/g, '');

						setColorPicker(tempColor);
						onChangeInlineValue({
							color: tempColor,
						});
					}}
					onChangeComplete={val => {
						const tempColor = tinycolor(val.rgb)
							.toRgbString()
							.replace(/\s/g, '');

						onChangeValue({
							color: tempColor,
						});
						setIsChanging(false);
					}}
					disableAlpha
				/>
			</div>
		</>
	);
};

export default CustomColorControl;
