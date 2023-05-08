/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getDefaultAttribute,
} from '../../../../extensions/attributes';
import {
	ToggleSwitch,
	AdvancedNumberControl,
	SelectControl,
} from '../../../../components';

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
		_il: isLoop,
		_ia: isAutoplay,
		_poh: pauseOnHover,
		_poi: pauseOnInteraction,
	} = props;
	const [sliderAutoplaySpeed, sliderTransition, sliderTransitionSpeed] =
		getAttributesValue({
			target: ['_sas', '_slt', '_sts'],
			props,
		});

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
					onChange({ _ia: val });
				}}
			/>
			{isAutoplay && (
				<>
					<ToggleSwitch
						label={__('Pause on hover', 'maxi-blocks')}
						selected={pauseOnHover}
						onChange={val => {
							onChange({ _poh: val });
						}}
					/>
					<ToggleSwitch
						label={__('Pause on interaction', 'maxi-blocks')}
						selected={pauseOnInteraction}
						onChange={val => {
							onChange({ _poi: val });
						}}
					/>
					<AdvancedNumberControl
						label={__('Autoplay speed (ms)', 'maxi-blocks')}
						min={500}
						max={10000}
						initial={2500}
						step={100}
						value={sliderAutoplaySpeed}
						onChangeValue={val => {
							onChange({
								_sas: val !== undefined ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								_sas: getDefaultAttribute('_sas'),
							})
						}
					/>
				</>
			)}
			<ToggleSwitch
				label={__('Infinite loop', 'maxi-blocks')}
				selected={isLoop}
				onChange={val => {
					onChange({ _il: val });
				}}
			/>
			<SelectControl
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
				value={sliderTransition}
				onChange={val => {
					onChange({
						_slt: val,
					});
				}}
			/>
			<AdvancedNumberControl
				label={__('Transition speed (ms)', 'maxi-blocks')}
				min={0}
				max={10000}
				initial={200}
				step={1}
				value={sliderTransitionSpeed}
				onChangeValue={val => {
					onChange({
						_sts: val !== undefined && val !== '' ? val : '',
					});
				}}
				onReset={() =>
					onChange({
						_sts: getDefaultAttribute('_sts'),
					})
				}
			/>
		</div>
	);
};

export default SliderControl;
