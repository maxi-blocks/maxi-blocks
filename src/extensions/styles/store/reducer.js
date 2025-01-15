/**
 * Internal dependencies
 */
import styleGenerator from '@extensions/styles/styleGenerator';
import controls from './controls';
import * as defaultGroupAttributes from '@extensions/styles/defaults/index';
import { omit } from 'lodash';
import { select } from '@wordpress/data';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
	console.log('Reducer Action:', action.type);

	switch (action.type) {
		case 'UPDATE_STYLES': {
			console.log('UPDATE_STYLES - Input size:', Object.keys(action.styles).length);

			const chunkSize = 100;
			const chunks = chunkStylesIntoChunks(action.styles, chunkSize);
			console.log('Chunks created:', chunks.length);

			const updatedStyles = chunks.reduce((acc, chunk) => ({
				...acc,
				...chunk
			}), state.styles);

			console.log('Updated styles size:', Object.keys(updatedStyles).length);
			return { ...state, styles: updatedStyles };
		}
		case 'SAVE_STYLES':
			controls.SAVE_STYLES({
				styles: state.styles,
				isUpdate: action.isUpdate,
			});
			return Object.assign({}, state, { isUpdate: action.isUpdate });
		case 'REMOVE_STYLES':
			return Object.assign({}, state, {
				styles: omit(state.styles, action.targets),
			});
		case 'SAVE_PREV_SAVED_ATTRS':
			return {
				...state,
				prevSavedAttrs: action.prevSavedAttrs,
				prevSavedAttrsClientId: action.prevSavedAttrsClientId,
			};
		case 'SAVE_CSS_CACHE': {
			const { uniqueID, stylesObj, isIframe, isSiteEditor } = action;
			console.log('SAVE_CSS_CACHE - UniqueID:', uniqueID);

			const breakpointStyles = BREAKPOINTS.reduce((acc, breakpoint) => ({
				...acc,
				[breakpoint]: styleGenerator(
					stylesObj,
					isIframe,
					isSiteEditor,
					breakpoint
				),
			}), {});

			console.log('Generated styles for breakpoints:', Object.keys(breakpointStyles));

			const updatedCache = {
				...state.cssCache,
				[uniqueID]: breakpointStyles,
			};

			const cacheSize = Object.keys(updatedCache).length;
			console.log('Cache size after update:', cacheSize);

			if (cacheSize > 100) {
				console.log('Cache limit exceeded, truncating...');
				const truncatedCache = Object.fromEntries(
					Object.entries(updatedCache).slice(-100)
				);
				return { ...state, cssCache: truncatedCache };
			}

			return { ...state, cssCache: updatedCache };
		}
		case 'SAVE_RAW_CSS_CACHE': {
			const { uniqueID, stylesContent } = action;

			return Object.assign({}, state, {
				cssCache: Object.assign({}, state.cssCache, {
					[uniqueID]: Object.assign({}, state.cssCache[uniqueID], stylesContent),
				}),
			});
		}
		case 'REMOVE_CSS_CACHE': {
			const { uniqueID } = action;

			return Object.assign({}, state, {
				cssCache: omit(state.cssCache, [uniqueID]),
			});
		}
		case 'SAVE_BLOCK_MARGIN_VALUE':
			return Object.assign({}, state, {
				blockMarginValue: action.blockMarginValue,
			});
		default:
			return state;
	}
}

// Helper function to chunk large style objects
const chunkStylesIntoChunks = (styles, size) => {
	console.log('Chunking styles - Input size:', Object.keys(styles).length);
	const chunks = [];
	const entries = Object.entries(styles);

	for (let i = 0; i < entries.length; i += size) {
		chunks.push(
			Object.fromEntries(entries.slice(i, i + size))
		);
	}

	console.log('Chunks created:', chunks.length);
	return chunks;
};

export default reducer;
