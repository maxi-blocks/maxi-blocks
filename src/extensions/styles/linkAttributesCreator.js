/**
 * Internal dependencies
 */
import breakpointAttributesCreator from './breakpointAttributesCreator';
import paletteAttributesCreator from './paletteAttributesCreator';

const linkAttributesCreator = (withDefaults = true) =>
	breakpointAttributesCreator({
		obj: {
			...paletteAttributesCreator({
				prefix: 'link-',
				palette: withDefaults ? 4 : undefined,
			}),
			...paletteAttributesCreator({
				prefix: 'link-hover-',
				palette: withDefaults ? 6 : undefined,
			}),
			...paletteAttributesCreator({
				prefix: 'link-active-',
				palette: withDefaults ? 6 : undefined,
			}),
			...paletteAttributesCreator({
				prefix: 'link-visited-',
				palette: withDefaults ? 6 : undefined,
			}),
		},
	});

export default linkAttributesCreator;
