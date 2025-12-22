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

	const dotPrefix = 'navigation-dot-';

	const dotsEnabled = getLastBreakpointAttribute({
		target: `${dotPrefix}status`,
		breakpoint,
		attributes,
		forceSingle: true,
	});

	return {
		label: __('Dots', 'maxi-blocks'),
		content: (
			<>
				<ToggleSwitch
					label={__('Enable dots', 'maxi-blocks')}
					className='maxi-carousel-dots__toggle'
					selected={dotsEnabled}
					onChange={val =>
						onChange({
							[`${dotPrefix}status-${breakpoint}`]: val,
						})
					}
				/>

				{dotsEnabled && (
					<>
						<h4 className='maxi-carousel-dots__not-active-icon-label'>
							{__('Not-active dot icon', 'maxi-blocks')}
						</h4>
						{
							icon({
								props,
								prefix: 'navigation-dot-',
							}).content
						}
						<h4 className='maxi-carousel-dots__active-icon-label'>
							{__('Active dot icon', 'maxi-blocks')}
						</h4>
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
