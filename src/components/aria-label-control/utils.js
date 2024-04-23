/**
 * External dependencies
 */
import { without, isEmpty } from 'lodash';

const filterAriaLabelCategories = (categories, blockName, attributes) => {
	if (blockName === 'maxi-blocks/button-maxi') {
		return without(
			categories,
			isEmpty(attributes['icon-content']) && 'icon'
		);
	}

	if (blockName === 'maxi-blocks/container-maxi') {
		return without(
			categories,
			!attributes['shape-divider-top-status'] && 'top shape divider',
			!attributes['shape-divider-bottom-status'] && 'bottom shape divider'
		);
	}

	if (blockName === 'maxi-blocks/map-maxi') {
		return without(
			categories,
			isEmpty(attributes['map-markers']) && 'popup'
		);
	}

	if (blockName === 'maxi-blocks/number-counter-maxi') {
		return without(
			categories,
			attributes['number-counter-circle-status'] && 'circle' // number counter circle status attribute is reversed
		);
	}

	if (blockName === 'maxi-blocks/search-maxi') {
		return without(
			categories,
			attributes.skin !== 'icon-reveal' && 'close icon'
		);
	}

	if (blockName === 'maxi-blocks/slider-maxi') {
		return without(
			categories,
			!attributes['navigation-arrow-first-icon-content'] && 'first arrow',
			!attributes['navigation-arrow-second-icon-content'] &&
				'second arrow',
			...(!attributes['navigation-dot-icon-content'] && [
				'dot',
				'all dots',
			])
		);
	}

	if (blockName === 'maxi-blocks/text-maxi') {
		return without(
			categories,
			attributes.isList && 'text',
			!attributes.isList && 'list'
		);
	}

	if (blockName === 'maxi-blocks/video-maxi') {
		return without(
			categories,
			(attributes.playerType !== 'popup' ||
				isEmpty(attributes['play-icon-content'])) &&
				'play icon',
			(attributes.playerType !== 'popup' ||
				isEmpty(attributes['close-icon-content'])) &&
				'close icon'
		);
	}

	return categories;
};

export default filterAriaLabelCategories;
