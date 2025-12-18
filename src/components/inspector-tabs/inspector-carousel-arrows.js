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
	} = props;

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
						insertInlineStyles={props.insertInlineStyles}
						cleanInlineStyles={props.cleanInlineStyles}
						clientId={props.clientId}
						blockStyle={attributes.blockStyle}
						prefix='navigation-arrow-both-icon-'
					/>
				)}
			</>
		),
	};
};

export default carouselArrows;
