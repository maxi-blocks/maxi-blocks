/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Icon from '../icon';
import BaseControl from '../base-control';
import OpacityControl from '../opacity-control';
import Button from '../button';

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
import { colorOpacity, reset } from '../../icons';

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
								<Button
									className='components-maxi-control__reset-button'
									onClick={e => {
										e.preventDefault();
										onReset();
									}}
									isSmall
									aria-label={sprintf(
										/* translators: %s: a textual label  */
										__('Reset %s settings', 'maxi-blocks'),
										label?.toLowerCase()
									)}
									type='reset'
								>
									{reset}
								</Button>
							)}
						</BaseControl>
					)}
					{!disableOpacity && (
						<OpacityControl
							label={__('Colour opacity', 'maxi-blocks')}
							opacity={color.a}
							onChange={val => {
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
					</BaseControl>
					<Icon icon={colorOpacity} />
					<OpacityControl
						opacity={color.a}
						onChange={val => {
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
