/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ToggleSwitch from '@components/toggle-switch';
import SelectControl from '@components/select-control';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '@extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSliderSettings } from '@maxi-icons';

/**
 * Slider settings
 */
const SliderSettings = props => {
	const {
		onChange,
		isLoop,
		isAutoplay,
		pauseOnHover,
		pauseOnInteraction,
		attributes,
	} = props;

	return (
		<ToolbarPopover
			className='toolbar-item__size'
			tooltip={__('Slider settings', 'maxi-blocks')}
			icon={toolbarSliderSettings}
			advancedOptions='slider settings'
		>
			<div className='toolbar-item__size__popover'>
				<ToggleSwitch
					label={__('Autoplay', 'maxi-blocks')}
					selected={isAutoplay}
					onChange={val => {
						onChange({ isAutoplay: val });
					}}
				/>
				{isAutoplay && (
					<>
						<ToggleSwitch
							label={__('Pause on hover', 'maxi-blocks')}
							selected={pauseOnHover}
							onChange={val => {
								onChange({ pauseOnHover: val });
							}}
						/>
						<ToggleSwitch
							label={__('Pause on interaction', 'maxi-blocks')}
							selected={pauseOnInteraction}
							onChange={val => {
								onChange({ pauseOnInteraction: val });
							}}
						/>
						<AdvancedNumberControl
							label={__('Autoplay speed (ms)', 'maxi-blocks')}
							min={500}
							max={10000}
							initial={1}
							step={1}
							value={props['slider-autoplay-speed']}
							onChangeValue={(val, meta) => {
								onChange({
									'slider-autoplay-speed':
										val !== undefined && val !== ''
											? val
											: '',
									meta,
								});
							}}
							onReset={() =>
								onChange({
									'slider-autoplay-speed':
										getDefaultAttribute('autoplay-speed'),
								})
							}
						/>
					</>
				)}

				<ToggleSwitch
					label={__('Infinite loop', 'maxi-blocks')}
					selected={isLoop}
					onChange={val => {
						onChange({ isLoop: val });
					}}
				/>
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Transition', 'maxi-blocks')}
					options={[
						{
							label: __('Slide', 'maxi-blocks'),
							value: 'slide',
						},
						{
							label: __('Fade', 'maxi-blocks'),
							value: 'fade',
						},
					]}
					value={getLastBreakpointAttribute({
						target: 'slider-transition',
						attributes,
					})}
					onChange={val => {
						onChange({
							'slider-transition': val,
						});
					}}
				/>
				<AdvancedNumberControl
					label={__('Transition speed (ms)', 'maxi-blocks')}
					min={0}
					max={10000}
					initial={200}
					step={1}
					value={props['slider-transition-speed']}
					onChangeValue={(val, meta) => {
						onChange({
							'slider-transition-speed':
								val !== undefined && val !== '' ? val : '',
							meta,
						});
					}}
					onReset={() =>
						onChange({
							'slider-transition-speed': getDefaultAttribute(
								'slider-transition-speed'
							),
						})
					}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default SliderSettings;
