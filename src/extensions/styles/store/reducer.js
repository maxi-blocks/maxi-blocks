/**
 * Internal dependencies
 */
import styleGenerator from '@extensions/styles/styleGenerator';
import controls from './controls';
import * as defaultGroupAttributes from '@extensions/styles/defaults/index';
import { omit } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

// Helper function to chunk large style objects
const chunkStylesIntoChunks = (styles, size) => {
	const chunks = [];
	const entries = Object.entries(styles);

	for (let i = 0; i < entries.length; i += size) {
		chunks.push(Object.fromEntries(entries.slice(i, i + size)));
	}

	return chunks;
};

/**
 * Reducer managing the styles
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 * @return {Object} Updated state.
 */
function reducer(
	state = {
		styles: {},
		isUpdate: null,
		prevSavedAttrs: [],
		prevSavedAttrsClientId: null,
		cssCache: {},
		blockMarginValue: '',
		defaultGroupAttributes,
	},
	action
) {
	switch (action.type) {
		case 'UPDATE_STYLES': {
			const chunkSize = 100;
			const chunks = chunkStylesIntoChunks(action.styles, chunkSize);

			const updatedStyles = chunks.reduce(
				(acc, chunk) => ({
					...acc,
					...chunk,
				}),
				state.styles
			);

			return { ...state, styles: updatedStyles };
		}
		case 'SAVE_STYLES':
			controls.SAVE_STYLES({
				styles: state.styles,
				isUpdate: action.isUpdate,
			});
			return { ...state, isUpdate: action.isUpdate };
		case 'REMOVE_STYLES':
			return { ...state, styles: omit(state.styles, action.targets) };
		case 'SAVE_PREV_SAVED_ATTRS':
			return {
				...state,
				prevSavedAttrs: action.prevSavedAttrs,
				prevSavedAttrsClientId: action.prevSavedAttrsClientId,
			};
		case 'SAVE_CSS_CACHE': {
			const { uniqueID, stylesObj, isIframe, isSiteEditor } = action;

			const breakpointStyles = BREAKPOINTS.reduce(
				(acc, breakpoint) => ({
					...acc,
					[breakpoint]: styleGenerator(
						stylesObj,
						isIframe,
						isSiteEditor,
						breakpoint
					),
				}),
				{}
			);

			const updatedCache = {
				...state.cssCache,
				[uniqueID]: breakpointStyles,
			};

			const cacheSize = Object.keys(updatedCache).length;

			if (cacheSize > 100) {
				const truncatedCache = Object.fromEntries(
					Object.entries(updatedCache).slice(-100)
				);
				return { ...state, cssCache: truncatedCache };
			}

			return { ...state, cssCache: updatedCache };
		}
		case 'SAVE_RAW_CSS_CACHE': {
			const { uniqueID, stylesContent } = action;

			return {
				...state,
				cssCache: {
					...state.cssCache,
					[uniqueID]: {
						...state.cssCache[uniqueID],
						...stylesContent,
					},
				},
			};
		}
		case 'REMOVE_CSS_CACHE': {
			const { uniqueID } = action;

			return { ...state, cssCache: omit(state.cssCache, [uniqueID]) };
		}
		case 'SAVE_BLOCK_MARGIN_VALUE':
			return { ...state, blockMarginValue: action.blockMarginValue };
		default:
			return state;
	}
}

export default reducer;
