/**
 * Internal dependencies
 */
import styleGenerator from '@extensions/styles/styleGenerator';
import controls from './controls';
import * as defaultGroupAttributes from '@extensions/styles/defaults/index';
import { omit } from 'lodash';

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
		defaultGroupAttributes: defaultGroupAttributes,
	},
	action
) {
	switch (action.type) {
		case 'UPDATE_STYLES':
			return Object.assign({}, state, {
				styles: Object.assign({}, state.styles, action.styles),
			});
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

			const breakpointStyles = {};
			BREAKPOINTS.forEach(breakpoint => {
				breakpointStyles[breakpoint] = styleGenerator(
					stylesObj,
					isIframe,
					isSiteEditor,
					breakpoint
				);
			});

			const newState = Object.assign({}, state, {
				cssCache: Object.assign({}, state.cssCache, {
					[uniqueID]: breakpointStyles,
				}),
			});

			const size = new TextEncoder().encode(JSON.stringify(newState)).length;
			console.log('newState size in MB:', (size / 1048576).toFixed(2));
			console.log('newState cssCache:', newState.cssCache);

			return newState;
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

export default reducer;
