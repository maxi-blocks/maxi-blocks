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
import AlignmentControl from '@components/alignment-control';
import NavigationIconsControl from '@blocks/slider-maxi/components/navigation-control/navigation-control';
import { ResponsiveTabsControl } from '@components';
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
	getIconWithColor,
} from '@extensions/styles';
import * as inspectorTabs from '@components/inspector-tabs';

/**
 * External dependencies
 */
import classnames from 'classnames';

const RowCarouselControl = ({ props }) => {
	const {
		attributes,
		maxiSetAttributes: onChange,
		deviceType: breakpoint,
		className,
	} = props;

	const classes = classnames('maxi-row-carousel-control', className);

	// Get carousel status (NOT breakpoint-specific)
	const carouselStatus = attributes['row-carousel-status'];

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

	const transition = getLastBreakpointAttribute({
		target: 'row-carousel-transition',
		breakpoint,
		attributes,
	});

	const transitionSpeed = getLastBreakpointAttribute({
		target: 'row-carousel-transition-speed',
		breakpoint,
		attributes,
	});

	// Get navigation status
	const arrowPrefix = 'navigation-arrow-';
	const dotPrefix = 'navigation-dot-';

	const arrowsEnabled = getLastBreakpointAttribute({
		target: `${arrowPrefix}both-status`,
		breakpoint,
		attributes,
		forceSingle: true,
	});

	const dotsEnabled = getLastBreakpointAttribute({
		target: `${dotPrefix}status`,
		breakpoint,
		attributes,
		forceSingle: true,
	});

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Enable carousel', 'maxi-blocks')}
				selected={carouselStatus}
				onChange={val => {
					onChange({
						'row-carousel-status': val,
					});
				}}
			/>
			{carouselStatus && (
				<>
					<ResponsiveTabsControl />
					<AdvancedNumberControl
						label={__('Columns per slide', 'maxi-blocks')}
						min={1}
						max={12}
						initial={1}
						step={1}
						value={slidesPerView}
						onChangeValue={val => {
							// eslint-disable-next-line no-console
							console.log(
								'Row Carousel: Slides per view onChange',
								{
									breakpoint,
									val,
									attributeName: `row-carousel-slides-per-view-${breakpoint}`,
								}
							);
							onChange({
								[`row-carousel-slides-per-view-${breakpoint}`]:
									val !== undefined ? val : '',
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
						label={__('Gap between columns (px)', 'maxi-blocks')}
						min={0}
						max={100}
						initial={0}
						step={1}
						value={columnGap}
						onChangeValue={val => {
							onChange({
								[`row-carousel-column-gap-${breakpoint}`]:
									val !== undefined ? val : '',
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
									val !== undefined ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								[`row-carousel-peek-offset-${breakpoint}`]: 0,
							})
						}
					/>
					<AdvancedNumberControl
						label={__('Trigger width (px)', 'maxi-blocks')}
						min={320}
						max={3840}
						initial={undefined}
						step={1}
						value={attributes['row-carousel-trigger-width']}
						onChangeValue={val => {
							onChange({
								'row-carousel-trigger-width':
									val !== undefined ? val : undefined,
							});
						}}
						onReset={() =>
							onChange({
								'row-carousel-trigger-width': undefined,
							})
						}
					/>
					<ToggleSwitch
						label={__('Autoplay', 'maxi-blocks')}
						selected={isAutoplay}
						onChange={val => {
							const updates = {
								[`row-carousel-autoplay-${breakpoint}`]: val,
							};

							// When enabling autoplay, also enable pause behaviors by default
							if (val) {
								if (
									pauseOnHover === undefined ||
									pauseOnHover === false
								) {
									updates[
										`row-carousel-pause-on-hover-${breakpoint}`
									] = true;
								}
								if (
									pauseOnInteraction === undefined ||
									pauseOnInteraction === false
								) {
									updates[
										`row-carousel-pause-on-interaction-${breakpoint}`
									] = true;
								}
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
								label={__('Autoplay speed (s)', 'maxi-blocks')}
								min={0.5}
								max={10}
								initial={2.5}
								step={0.1}
								value={autoplaySpeed}
								onChangeValue={val => {
									onChange({
										[`row-carousel-autoplay-speed-${breakpoint}`]:
											val !== undefined ? val : '',
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
						value={transition}
						onChange={val =>
							onChange({
								[`row-carousel-transition-${breakpoint}`]: val,
							})
						}
					/>
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
									val !== undefined ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								[`row-carousel-transition-speed-${breakpoint}`]: 0.5,
							})
						}
					/>

					{/* Navigation Controls */}
					<div className='maxi-row-carousel-control__divider' />
					<h3>{__('Navigation', 'maxi-blocks')}</h3>

					<ToggleSwitch
						label={__('Enable arrows', 'maxi-blocks')}
						selected={arrowsEnabled}
						onChange={val =>
							onChange({
								[`${arrowPrefix}both-status-${breakpoint}`]:
									val,
							})
						}
					/>

					<ToggleSwitch
						label={__('Enable dots', 'maxi-blocks')}
						selected={dotsEnabled}
						onChange={val =>
							onChange({
								[`${dotPrefix}status-${breakpoint}`]: val,
							})
						}
					/>

					{/* Arrow Icon Controls */}
					{arrowsEnabled && (
						<>
							<div className='maxi-row-carousel-control__divider' />
							<h3>{__('Arrow icons', 'maxi-blocks')}</h3>
							<NavigationIconsControl
								{...getGroupAttributes(attributes, [
									'arrowIcon',
									'arrowIconHover',
								])}
								onChange={obj => onChange(obj)}
								deviceType={breakpoint}
								insertInlineStyles={props.insertInlineStyles}
								cleanInlineStyles={props.cleanInlineStyles}
								clientId={props.clientId}
								blockStyle={attributes.blockStyle}
								prefix='navigation-arrow-both-icon-'
							/>
						</>
					)}

					{/* Dot Icon Controls */}
					{dotsEnabled && (
						<>
							<div className='maxi-row-carousel-control__divider' />
							<h3>{__('Dot icons', 'maxi-blocks')}</h3>
							{
								inspectorTabs.icon({
									props,
									prefix: 'navigation-dot-',
								}).content
							}
							<h4>{__('Active dot', 'maxi-blocks')}</h4>
							{
								inspectorTabs.icon({
									props,
									prefix: 'active-navigation-dot-',
								}).content
							}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default RowCarouselControl;
