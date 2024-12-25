/**
 * Internal dependencies
 */
import styleGenerator from '@extensions/styles/styleGenerator';
import controls from './controls';
import * as defaultGroupAttributes from '@extensions/styles/defaults/index';

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
		defaultGroupAttributes: { ...defaultGroupAttributes },
	},
	action
) {
	switch (action.type) {
		case 'UPDATE_STYLES':
			return {
				...state,
				styles: {
					...state.styles,
					...action.styles,
				},
			};
		case 'SAVE_STYLES':
			controls.SAVE_STYLES({
				styles: state.styles,
				isUpdate: action.isUpdate,
			});
			return {
				...state,
				isUpdate: action.isUpdate,
			};
		case 'REMOVE_STYLES':
			action.targets.forEach(target => delete state.styles[target]);
			return {
				...state,
			};
		case 'SAVE_PREV_SAVED_ATTRS':
			return {
				...state,
				prevSavedAttrs: action.prevSavedAttrs,
				prevSavedAttrsClientId: action.prevSavedAttrsClientId,
			};
		case 'SAVE_CSS_CACHE': {
			const { uniqueID, stylesObj, isIframe, isSiteEditor } = action;

			return {
				...state,
				cssCache: {
					...state.cssCache,
					[uniqueID]: {
						...BREAKPOINTS.reduce(
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
						),
					},
				},
			};
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

			delete state.cssCache[uniqueID];

			return state;
		}
		case 'SAVE_BLOCK_MARGIN_VALUE': {
			return {
				...state,
				blockMarginValue: action.blockMarginValue,
			};
		}
		default:
			return state;
	}
}

export default reducer;
