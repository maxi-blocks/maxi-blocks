/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CustomCssControl from '../custom-css-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import { getBgLayersSelectorsCss } from '../background-displayer/utils';

/**
 * External dependencies
 */
import { isEmpty, without } from 'lodash';

/**
 * Component
 */
const customCss = ({
	props,
	breakpoint = 'general',
	selectors,
	categories,
}) => {
	const { attributes, maxiSetAttributes } = props;

	const customCssValue = getLastBreakpointAttribute({
		target: 'custom-css',
		breakpoint,
		attributes,
	});
	const customCssCategory = attributes['custom-css-category'];

	const getCategoriesCss = () => {
		const {
			'icon-content': iconContent,
			'block-background-hover-status': blockBackgroundHoverStatus,
			'background-layers': bgLayers,
		} = attributes;

		return without(
			categories,
			isEmpty(iconContent) && 'icon',
			isEmpty(bgLayers) && 'background',
			!blockBackgroundHoverStatus && 'background hover'
		);
	};

	const getSelectorsCss = () => {
		const {
			'background-layers': bgLayers = [],
			'background-layers-hover': bgLayersHover = [],
		} = attributes;

		return {
			...selectors,
			...getBgLayersSelectorsCss([...bgLayers, ...bgLayersHover]),
		};
	};

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<CustomCssControl
				breakpoint={breakpoint}
				categories={getCategoriesCss()}
				category={customCssCategory}
				selectors={getSelectorsCss()}
				value={customCssValue}
				onChange={(attr, val) =>
					maxiSetAttributes({
						[attr]: val,
					})
				}
			/>
		),
	};
};

export default customCss;
