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
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
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

	const {
		'row-carousel-autoplay': isAutoplay,
		'row-carousel-pause-on-hover': pauseOnHover,
		'row-carousel-pause-on-interaction': pauseOnInteraction,
		'row-carousel-loop': isLoop,
	} = attributes;

	const classes = classnames('maxi-row-carousel-control', className);

	// Get breakpoint-specific carousel status
	const carouselStatus = getLastBreakpointAttribute({
		target: 'row-carousel-status',
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
						[`row-carousel-status-${breakpoint}`]: val,
					});
				}}
			/>
			{carouselStatus && (
				<>
					<AdvancedNumberControl
						label={__('Columns per slide', 'maxi-blocks')}
						min={1}
						max={12}
						initial={1}
						step={1}
						value={attributes['row-carousel-slides-per-view']}
						onChangeValue={val => {
							onChange({
								'row-carousel-slides-per-view':
									val !== undefined ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								'row-carousel-slides-per-view': 1,
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
						value={attributes['row-carousel-column-gap']}
						onChangeValue={val => {
							onChange({
								'row-carousel-column-gap':
									val !== undefined ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								'row-carousel-column-gap': 0,
							})
						}
					/>
					<AdvancedNumberControl
						label={__('Peek offset (px)', 'maxi-blocks')}
						min={0}
						max={200}
						initial={0}
						step={1}
						value={attributes['row-carousel-peek-offset']}
						onChangeValue={val => {
							onChange({
								'row-carousel-peek-offset':
									val !== undefined ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								'row-carousel-peek-offset': 0,
							})
						}
					/>
					<ToggleSwitch
						label={__('Autoplay', 'maxi-blocks')}
						selected={isAutoplay}
						onChange={val => {
							const updates = {
								'row-carousel-autoplay': val,
							};

							// When enabling autoplay, also enable pause behaviors by default
							if (val) {
								if (
									pauseOnHover === undefined ||
									pauseOnHover === false
								) {
									updates[
										'row-carousel-pause-on-hover'
									] = true;
								}
								if (
									pauseOnInteraction === undefined ||
									pauseOnInteraction === false
								) {
									updates[
										'row-carousel-pause-on-interaction'
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
										'row-carousel-pause-on-hover': val,
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
										'row-carousel-pause-on-interaction':
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
								value={
									attributes['row-carousel-autoplay-speed']
								}
								onChangeValue={val => {
									onChange({
										'row-carousel-autoplay-speed':
											val !== undefined ? val : '',
									});
								}}
								onReset={() =>
									onChange({
										'row-carousel-autoplay-speed': 2.5,
									})
								}
							/>
						</>
					)}
					<ToggleSwitch
						label={__('Infinite loop', 'maxi-blocks')}
						selected={isLoop}
						onChange={val => {
							onChange({ 'row-carousel-loop': val });
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
						value={attributes['row-carousel-transition']}
						onChange={val =>
							onChange({ 'row-carousel-transition': val })
						}
					/>
					<AdvancedNumberControl
						label={__('Transition speed (s)', 'maxi-blocks')}
						min={0}
						max={10}
						initial={0.5}
						step={0.1}
						value={attributes['row-carousel-transition-speed']}
						onChangeValue={val => {
							onChange({
								'row-carousel-transition-speed':
									val !== undefined ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								'row-carousel-transition-speed': 0.5,
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
					{arrowsEnabled && (
						<SelectControl
							__nextHasNoMarginBottom
							label={__('Arrow position', 'maxi-blocks')}
							newStyle
							options={[
								{
									label: __('Inside', 'maxi-blocks'),
									value: 'inside',
								},
								{
									label: __('Outside', 'maxi-blocks'),
									value: 'outside',
								},
							]}
							value={getLastBreakpointAttribute({
								target: `${arrowPrefix}position`,
								breakpoint,
								attributes,
							})}
							onChange={val => {
								onChange({
									[`${arrowPrefix}position-${breakpoint}`]:
										val,
									...(val === 'inside' && {
										[`${arrowPrefix}both-icon-spacing-horizontal-${breakpoint}`]:
											-40,
									}),
									...(val === 'outside' && {
										[`${arrowPrefix}both-icon-spacing-horizontal-${breakpoint}`]: 10,
									}),
								});
							}}
						/>
					)}

					<ToggleSwitch
						label={__('Enable dots', 'maxi-blocks')}
						selected={dotsEnabled}
						onChange={val =>
							onChange({
								[`${dotPrefix}status-${breakpoint}`]: val,
							})
						}
					/>
					{dotsEnabled && (
						<SelectControl
							__nextHasNoMarginBottom
							label={__('Dots position', 'maxi-blocks')}
							newStyle
							options={[
								{
									label: __('Inside', 'maxi-blocks'),
									value: 'inside',
								},
								{
									label: __('Outside', 'maxi-blocks'),
									value: 'outside',
								},
							]}
							value={getLastBreakpointAttribute({
								target: `${dotPrefix}position`,
								breakpoint,
								attributes,
							})}
							onChange={val => {
								onChange({
									[`${dotPrefix}position-${breakpoint}`]: val,
									...(val === 'inside' && {
										[`${dotPrefix}icon-spacing-vertical-${breakpoint}`]: 85,
									}),
									...(val === 'outside' && {
										[`${dotPrefix}icon-spacing-vertical-${breakpoint}`]: 110,
									}),
								});
							}}
						/>
					)}

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
