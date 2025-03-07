import {
	updateStyles,
	removeStyles,
	saveStyles,
	savePrevSavedAttrs,
	saveCSSCache,
	saveRawCSSCache,
	removeCSSCache,
	saveBlockMarginValue,
} from '@extensions/styles/store/actions';

describe('styles store actions', () => {
	describe('updateStyles', () => {
		it('Creates UPDATE_STYLES action with target and styles', async () => {
			const target = 'block1';
			const styles = { color: 'red' };
			const action = await updateStyles(target, styles);

			expect(action).toEqual({
				type: 'UPDATE_STYLES',
				target,
				styles,
			});
		});

		it('Creates UPDATE_STYLES action with null target', async () => {
			const styles = { color: 'red' };
			const action = await updateStyles(null, styles);

			expect(action).toEqual({
				type: 'UPDATE_STYLES',
				target: null,
				styles,
			});
		});
	});

	describe('removeStyles', () => {
		it('Creates REMOVE_STYLES action with targets', async () => {
			const targets = ['block1', 'block2'];
			const action = await removeStyles(targets);

			expect(action).toEqual({
				type: 'REMOVE_STYLES',
				targets,
			});
		});
	});

	describe('saveStyles', () => {
		it('Creates SAVE_STYLES action with isUpdate flag', () => {
			const isUpdate = true;
			const action = saveStyles(isUpdate);

			expect(action).toEqual({
				type: 'SAVE_STYLES',
				isUpdate,
			});
		});
	});

	describe('savePrevSavedAttrs', () => {
		it('Creates SAVE_PREV_SAVED_ATTRS action with attributes and clientId', () => {
			const prevSavedAttrs = { color: 'blue', padding: '10px' };
			const prevSavedAttrsClientId = 'block1';
			const action = savePrevSavedAttrs(
				prevSavedAttrs,
				prevSavedAttrsClientId
			);

			expect(action).toEqual({
				type: 'SAVE_PREV_SAVED_ATTRS',
				prevSavedAttrs: Object.keys(prevSavedAttrs),
				prevSavedAttrsClientId,
			});
		});
	});

	describe('saveCSSCache', () => {
		it('Creates SAVE_CSS_CACHE action with all parameters', () => {
			const uniqueID = 'block1';
			const stylesObj = { css: '.block { color: red; }' };
			const isIframe = true;
			const isSiteEditor = false;

			const action = saveCSSCache(
				uniqueID,
				stylesObj,
				isIframe,
				isSiteEditor
			);

			expect(action).toEqual({
				type: 'SAVE_CSS_CACHE',
				uniqueID,
				stylesObj,
				isIframe,
				isSiteEditor,
			});
		});
	});

	describe('saveRawCSSCache', () => {
		it('Creates SAVE_RAW_CSS_CACHE action with uniqueID and styles content', () => {
			const uniqueID = 'block1';
			const stylesContent = '.block { margin: 10px; }';

			const action = saveRawCSSCache(uniqueID, stylesContent);

			expect(action).toEqual({
				type: 'SAVE_RAW_CSS_CACHE',
				uniqueID,
				stylesContent,
			});
		});
	});

	describe('removeCSSCache', () => {
		it('Creates REMOVE_CSS_CACHE action with uniqueID', () => {
			const uniqueID = 'block1';
			const action = removeCSSCache(uniqueID);

			expect(action).toEqual({
				type: 'REMOVE_CSS_CACHE',
				uniqueID,
			});
		});
	});

	describe('saveBlockMarginValue', () => {
		it('Creates SAVE_BLOCK_MARGIN_VALUE action with margin value', () => {
			const blockMarginValue = 20;
			const action = saveBlockMarginValue(blockMarginValue);

			expect(action).toEqual({
				type: 'SAVE_BLOCK_MARGIN_VALUE',
				blockMarginValue,
			});
		});
	});
});
