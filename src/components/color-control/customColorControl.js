/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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

	const [colorPicker, setColorPicker] = useState(color); // state for inline

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
											tinycolor(color).toRgbString(),
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
									background: tinycolor(color).toRgbString(),
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
						const newColor = tinycolor(val.rgb)
							.toRgbString()
							.replace(/\s/g, '');
						setColorPicker(newColor);
						onChangeInlineValue({
							color: newColor,
						});
					}}
					onChangeComplete={val => {
						const tempColor = tinycolor(val.rgb)
							.toRgbString()
							.replace(/\s/g, '');

						setColorPicker(tempColor);
						onChangeValue({
							color: tempColor,
						});
					}}
					disableAlpha
				/>
			</div>
		</>
	);
};

export default CustomColorControl;
