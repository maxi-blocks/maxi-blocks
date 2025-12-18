/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '@components/toggle-switch';
import { getLastBreakpointAttribute } from '@extensions/styles';
import icon from './inspector-icon';

/**
 * Carousel Dots Settings
 * Contains: Enable dots toggle and dot icon controls (normal and active)
 */
const carouselDots = ({ props }) => {
	const {
		attributes,
		maxiSetAttributes: onChange,
		deviceType: breakpoint,
	} = props;

	// Get carousel status (NOT breakpoint-specific)
	const carouselStatus = attributes['row-carousel-status'];

	const dotPrefix = 'navigation-dot-';

	const dotsEnabled = getLastBreakpointAttribute({
		target: `${dotPrefix}status`,
		breakpoint,
		attributes,
		forceSingle: true,
	});

	return {
		label: __('Dots', 'maxi-blocks'),
		content: carouselStatus && (
			<>
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
					<>
						<h4>{__('Dot icon', 'maxi-blocks')}</h4>
						{
							icon({
								props,
								prefix: 'navigation-dot-',
							}).content
						}
						<h4>{__('Active dot icon', 'maxi-blocks')}</h4>
						{
							icon({
								props,
								prefix: 'active-navigation-dot-',
							}).content
						}
					</>
				)}
			</>
		),
	};
};

export default carouselDots;
