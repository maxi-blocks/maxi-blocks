/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '@components/toggle-switch';
import NavigationIconsControl from '@blocks/slider-maxi/components/navigation-control/navigation-control';
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '@extensions/styles';

/**
 * Carousel Dots Settings
 * Contains: Enable dots toggle and dot icon controls (normal, hover, and active states)
 * Note: Active state uses the same icon as normal but with different styling
 */
const carouselDots = ({ props }) => {
	const {
		attributes,
		maxiSetAttributes: onChange,
		deviceType: breakpoint,
		insertInlineStyles,
		cleanInlineStyles,
		inlineStylesTargets,
		clientId,
	} = props;

	const { blockStyle, svgType } = attributes;
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
					<NavigationIconsControl
						{...getGroupAttributes(attributes, [
							'dotIcon',
							'dotIconHover',
							'dotIconActive',
						])}
						onChange={obj => onChange(obj)}
						deviceType={breakpoint}
						insertInlineStyles={insertInlineStyles}
						cleanInlineStyles={cleanInlineStyles}
						normalInlineTarget={inlineStylesTargets?.dot}
						activeInlineTarget={inlineStylesTargets?.dotActive}
						clientId={clientId}
						blockStyle={blockStyle}
						svgType={svgType}
						prefix='navigation-dot-icon-'
					/>
				)}
			</>
		),
	};
};

export default carouselDots;
