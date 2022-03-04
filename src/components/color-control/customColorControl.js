/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
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
 * Styles
 */
import './editor.scss';
import { reset } from '../../icons';

/**
 * Component
 */
const CustomColorControl = props => {
	const {
		label,
		color,
		onChangeValue,
		disableColorDisplay,
		disableOpacity,
		disableReset,
		onReset,
		onResetOpacity,
	} = props;

	return (
		<>
			{!disableColorDisplay && (
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
			<div className='maxi-color-control__color'>
				<ChromePicker
					color={color}
					onChangeComplete={val => {
						onChangeValue({
							color: tinycolor(val.rgb)
								.toRgbString()
								.replace(/\s/g, ''),
						});
					}}
					disableAlpha
				/>
			</div>
		</>
	);
};

export default CustomColorControl;
