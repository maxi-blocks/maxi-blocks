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
 * Carousel Arrows Settings
 * Contains: Enable arrows toggle and arrow icon controls
 */
const carouselArrows = ({ props }) => {
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
	const arrowPrefix = 'navigation-arrow-';

	const arrowsEnabled = getLastBreakpointAttribute({
		target: `${arrowPrefix}both-status`,
		breakpoint,
		attributes,
		forceSingle: true,
	});

	return {
		label: __('Arrows', 'maxi-blocks'),
		content: (
			<>
				<ToggleSwitch
					label={__('Enable arrows', 'maxi-blocks')}
					className='maxi-carousel-arrows__toggle'
					selected={arrowsEnabled}
					onChange={val =>
						onChange({
							[`${arrowPrefix}both-status-${breakpoint}`]: val,
						})
					}
				/>

				{arrowsEnabled && (
					<NavigationIconsControl
						{...getGroupAttributes(attributes, [
							'arrowIcon',
							'arrowIconHover',
						])}
						onChange={obj => onChange(obj)}
						deviceType={breakpoint}
						insertInlineStyles={insertInlineStyles}
						cleanInlineStyles={cleanInlineStyles}
						normalInlineTarget={inlineStylesTargets?.arrow}
						activeInlineTarget={inlineStylesTargets?.arrowActive}
						clientId={clientId}
						blockStyle={blockStyle}
						svgType={svgType}
						prefix='navigation-arrow-both-icon-'
					/>
				)}
			</>
		),
	};
};

export default carouselArrows;
