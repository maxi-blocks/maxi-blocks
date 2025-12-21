/**
 * Internal dependencies
 */
import breakpointAttributesCreator from './breakpointAttributesCreator';
import paletteAttributesCreator from './paletteAttributesCreator';

const typographyAttributesCreator = (
	withDefaults = true,
	disableBottomGap = false
) =>
	breakpointAttributesCreator({
		obj: {
			'font-family': {
				type: 'string',
			},
			...paletteAttributesCreator({
				prefix: '',
				palette: withDefaults ? 3 : undefined,
			}),
			...paletteAttributesCreator({
				prefix: 'list-',
				palette: withDefaults ? 3 : undefined,
			}),
			'font-size-unit': {
				type: 'string',
				default: 'px',
			},
			'font-size': {
				type: 'number',
			},
			'font-size-clamp-status': {
				type: 'boolean',
				default: false,
			},
			'font-size-min': {
				type: 'number',
			},
			'font-size-min-unit': {
				type: 'string',
				default: 'rem',
			},
			'font-size-preferred': {
				type: 'number',
			},
			'font-size-preferred-unit': {
				type: 'string',
				default: 'vw',
			},
			'font-size-max': {
				type: 'number',
			},
			'font-size-max-unit': {
				type: 'string',
				default: 'rem',
			},
			'line-height-unit': {
				type: 'string',
				default: 'px',
			},
			'line-height': {
				type: 'number',
			},
			'letter-spacing-unit': {
				type: 'string',
				default: 'px',
			},
			'letter-spacing': {
				type: 'number',
			},
			'font-weight': {
				type: 'string',
			},
			'text-transform': {
				type: 'string',
			},
			'font-style': {
				type: 'string',
			},
			'text-decoration': {
				type: 'string',
			},
			'text-indent': {
				type: 'number',
			},
			'text-indent-unit': {
				type: 'string',
				default: 'px',
			},
			'text-shadow': {
				type: 'string',
			},
			'vertical-align': {
				type: 'string',
			},
			'custom-formats': {
				type: 'object',
			},
			'text-orientation': {
				type: 'string',
			},
			'text-direction': {
				type: 'string',
			},
			'white-space': {
				type: 'string',
			},
			'word-spacing': {
				type: 'number',
			},
			'word-spacing-unit': {
				type: 'string',
			},
			...(!disableBottomGap && {
				'bottom-gap': {
					type: 'number',
				},
				'bottom-gap-unit': {
					type: 'string',
					default: 'px',
				},
			}),
		},
		noBreakpointAttr: ['custom-formats'],
	});

export default typographyAttributesCreator;
