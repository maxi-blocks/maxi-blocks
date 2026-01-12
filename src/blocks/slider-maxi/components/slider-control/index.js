/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '@components/toggle-switch';
import AdvancedNumberControl from '@components/advanced-number-control';
import SelectControl from '@components/select-control';
import { getDefaultAttribute } from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

const SliderControl = props => {
	const {
		className,
		onChange,
		isEditView,
		setEditView,
		isLoop,
		isAutoplay,
		pauseOnHover,
		pauseOnInteraction,
	} = props;

	const classes = classnames('maxi-slider-control', className);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Edit view', 'maxi-blocks')}
				selected={isEditView}
				onChange={val => {
					setEditView(val);
				}}
			/>
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
						initial={2500}
						step={100}
						value={props['slider-autoplay-speed']}
						onChangeValue={(val, meta) => {
							onChange({
								'slider-autoplay-speed':
									val !== undefined ? val : '',
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
				newStyle
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
				value={props['slider-transition']}
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
	);
};

export default SliderControl;
