/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '@components/toggle-switch';
import AdvancedNumberControl from '@components/advanced-number-control';
// import SelectControl from '@components/select-control';
import AlignmentControl from '@components/alignment-control';
import { ResponsiveTabsControl } from '@components';
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '@extensions/styles';

/**
 * Carousel Slider Settings
 * Contains: Enable toggle, slides per view, alignment, gaps, autoplay, loop, transitions
 */
const carouselSlider = ({ props }) => {
	const {
		attributes,
		maxiSetAttributes: onChange,
		deviceType: breakpoint,
	} = props;

	// Get carousel status (NOT breakpoint-specific)
	const carouselStatus = attributes['row-carousel-status'];
	const carouselPreview = attributes['row-carousel-preview'];

	const slidesPerView = getLastBreakpointAttribute({
		target: 'row-carousel-slides-per-view',
		breakpoint,
		attributes,
	});

	const columnGap = getLastBreakpointAttribute({
		target: 'row-carousel-column-gap',
		breakpoint,
		attributes,
	});

	const peekOffset = getLastBreakpointAttribute({
		target: 'row-carousel-peek-offset',
		breakpoint,
		attributes,
	});

	const heightOffset = getLastBreakpointAttribute({
		target: 'row-carousel-height-offset',
		breakpoint,
		attributes,
	});

	const isLoop = getLastBreakpointAttribute({
		target: 'row-carousel-loop',
		breakpoint,
		attributes,
	});

	const isAutoplay = getLastBreakpointAttribute({
		target: 'row-carousel-autoplay',
		breakpoint,
		attributes,
	});

	const pauseOnHover = getLastBreakpointAttribute({
		target: 'row-carousel-pause-on-hover',
		breakpoint,
		attributes,
	});

	const pauseOnInteraction = getLastBreakpointAttribute({
		target: 'row-carousel-pause-on-interaction',
		breakpoint,
		attributes,
	});

	const autoplaySpeed = getLastBreakpointAttribute({
		target: 'row-carousel-autoplay-speed',
		breakpoint,
		attributes,
	});

	// const transition = getLastBreakpointAttribute({
	// 	target: 'row-carousel-transition',
	// 	breakpoint,
	// 	attributes,
	// });

	const transitionSpeed = getLastBreakpointAttribute({
		target: 'row-carousel-transition-speed',
		breakpoint,
		attributes,
	});

	return {
		label: __('Carousel slider', 'maxi-blocks'),
		extraIndicators: ['row-carousel-status'],
		content: (
			<>
				<ToggleSwitch
					label={__('Enable carousel', 'maxi-blocks')}
					className='maxi-carousel-slider__toggle'
					selected={carouselStatus}
					onChange={val => {
						onChange({
							'row-carousel-status': val,
						});
					}}
				/>
				{carouselStatus && (
					<>
						<ToggleSwitch
							label={__('Preview', 'maxi-blocks')}
							selected={carouselPreview}
							onChange={val => {
								onChange({
									'row-carousel-preview': val,
								});
							}}
						/>
						<AdvancedNumberControl
							label={__('Trigger width (px)', 'maxi-blocks')}
							className='maxi-carousel-slider__trigger-width'
							min={0}
							max={7680}
							initial={undefined}
							step={1}
							value={attributes['row-carousel-trigger-width']}
							onChangeValue={val => {
								onChange({
									'row-carousel-trigger-width':
										val !== undefined ? val : undefined,
								});
							}}
							onReset={() => {
								onChange({
									'row-carousel-trigger-width': undefined,
								});
							}}
						/>
						<ResponsiveTabsControl />
						<AdvancedNumberControl
							label={__('Columns per slide', 'maxi-blocks')}
							min={1}
							max={12}
							initial={1}
							step={1}
							value={slidesPerView}
							onChangeValue={val => {
								onChange({
									[`row-carousel-slides-per-view-${breakpoint}`]:
										val,
								});
							}}
							onReset={() =>
								onChange({
									[`row-carousel-slides-per-view-${breakpoint}`]: 1,
								})
							}
						/>
						<AlignmentControl
							label={__('Alignment', 'maxi-blocks')}
							{...getGroupAttributes(
								attributes,
								'rowCarouselAlignment'
							)}
							onChange={obj => onChange(obj)}
							breakpoint={breakpoint}
							prefix='row-carousel-'
							disableJustify
							disableRTC
						/>
						<AdvancedNumberControl
							label={__(
								'Gap between columns (px)',
								'maxi-blocks'
							)}
							min={0}
							max={100}
							initial={0}
							step={1}
							value={columnGap}
							onChangeValue={val => {
								onChange({
									[`row-carousel-column-gap-${breakpoint}`]:
										val,
								});
							}}
							onReset={() =>
								onChange({
									[`row-carousel-column-gap-${breakpoint}`]: 0,
								})
							}
						/>
						<AdvancedNumberControl
							label={__('Peek offset (px)', 'maxi-blocks')}
							min={0}
							max={200}
							initial={0}
							step={1}
							value={peekOffset}
							onChangeValue={val => {
								onChange({
									[`row-carousel-peek-offset-${breakpoint}`]:
										val,
								});
							}}
							onReset={() =>
								onChange({
									[`row-carousel-peek-offset-${breakpoint}`]: 0,
								})
							}
						/>
						<AdvancedNumberControl
							label={__('Height offset (px)', 'maxi-blocks')}
							min={0}
							max={500}
							initial={0}
							step={10}
							value={heightOffset}
							onChangeValue={val => {
								onChange({
									[`row-carousel-height-offset-${breakpoint}`]:
										val,
								});
							}}
							onReset={() =>
								onChange({
									[`row-carousel-height-offset-${breakpoint}`]: 0,
								})
							}
						/>
						<ToggleSwitch
							label={__('Autoplay', 'maxi-blocks')}
							selected={isAutoplay}
							onChange={val => {
								const updates = {
									[`row-carousel-autoplay-${breakpoint}`]:
										val,
								};

								// When enabling autoplay, also enable pause behaviors automatically
								if (val) {
									updates[
										`row-carousel-pause-on-hover-${breakpoint}`
									] = true;
									updates[
										`row-carousel-pause-on-interaction-${breakpoint}`
									] = true;
								}

								onChange(updates);
							}}
						/>
						{isAutoplay && (
							<>
								<ToggleSwitch
									label={__('Pause on hover', 'maxi-blocks')}
									selected={pauseOnHover}
									onChange={val => {
										onChange({
											[`row-carousel-pause-on-hover-${breakpoint}`]:
												val,
										});
									}}
								/>
								<ToggleSwitch
									label={__(
										'Pause on interaction',
										'maxi-blocks'
									)}
									selected={pauseOnInteraction}
									onChange={val => {
										onChange({
											[`row-carousel-pause-on-interaction-${breakpoint}`]:
												val,
										});
									}}
								/>
								<AdvancedNumberControl
									label={__(
										'Autoplay speed (s)',
										'maxi-blocks'
									)}
									min={0.5}
									max={10}
									initial={2.5}
									step={0.1}
									value={autoplaySpeed}
									onChangeValue={val => {
										onChange({
											[`row-carousel-autoplay-speed-${breakpoint}`]:
												val,
										});
									}}
									onReset={() =>
										onChange({
											[`row-carousel-autoplay-speed-${breakpoint}`]: 2.5,
										})
									}
								/>
							</>
						)}
						<ToggleSwitch
							label={__('Infinite loop', 'maxi-blocks')}
							selected={isLoop}
							onChange={val => {
								onChange({
									[`row-carousel-loop-${breakpoint}`]: val,
								});
							}}
						/>
						{/* Transition control temporarily disabled - only slide supported */}
						{/* <SelectControl
						__nextHasNoMarginBottom
						label={__('Transition', 'maxi-blocks')}
						newStyle
						options={[
							{
								label: __('Slide', 'maxi-blocks'),
								value: 'slide',
							},
						]}
						value={transition}
						onChange={val =>
							onChange({
								[`row-carousel-transition-${breakpoint}`]:
									val,
							})
						}
					/> */}
						<AdvancedNumberControl
							label={__('Transition speed (s)', 'maxi-blocks')}
							min={0}
							max={10}
							initial={0.5}
							step={0.1}
							value={transitionSpeed}
							onChangeValue={val => {
								onChange({
									[`row-carousel-transition-speed-${breakpoint}`]:
										val,
								});
							}}
							onReset={() =>
								onChange({
									[`row-carousel-transition-speed-${breakpoint}`]: 0.5,
								})
							}
						/>
					</>
				)}
			</>
		),
	};
};

export default carouselSlider;
