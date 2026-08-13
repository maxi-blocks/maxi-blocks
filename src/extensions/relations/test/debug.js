/**
 * Internal dependencies
 */
import {
	debugIB,
	getIsIBDebugEnabled,
	summarizeRelation,
	summarizeRelations,
} from '@extensions/relations/debug';

/**
 * `debug.js` has a compile-time master switch that disables every debug path,
 * runtime flag included. Probe it with the runtime flag on so the logging tests
 * only run when the switch is on, and the kill-switch test only when it's off.
 */
const getIsDebugMasterEnabled = () => {
	const previousFlag = window.__MAXI_IB_DEBUG__;

	window.__MAXI_IB_DEBUG__ = true;
	const isEnabled = getIsIBDebugEnabled();
	window.__MAXI_IB_DEBUG__ = previousFlag;

	return isEnabled;
};

const isDebugMasterEnabled = getIsDebugMasterEnabled();
const itWithDebug = isDebugMasterEnabled ? it : it.skip;
const itWithoutDebug = isDebugMasterEnabled ? it.skip : it;

describe('relations/debug', () => {
	beforeEach(() => {
		window.__MAXI_IB_DEBUG__ = true;
		window.__maxiIBDebug = undefined;
		jest.spyOn(window.console, 'debug').mockImplementation(() => {});
	});

	afterEach(() => {
		window.__MAXI_IB_DEBUG__ = undefined;
		window.__maxiIBDebug = undefined;
		window.console.debug.mockRestore();
	});

	itWithoutDebug('is fully disabled by the master debug switch', () => {
		expect(getIsIBDebugEnabled()).toBe(false);
		expect(debugIB('master-disabled-event', { id: 1 })).toBe(null);
		expect(window.__maxiIBDebug).toBeUndefined();
		expect(window.console.debug).not.toHaveBeenCalled();
	});

	itWithDebug('records debug events in a browser-readable buffer', () => {
		const result = debugIB('test-event', { id: 1 });

		expect(result).toEqual(
			expect.objectContaining({
				event: 'test-event',
				details: { id: 1 },
			})
		);
		expect(window.__maxiIBDebug.events).toHaveLength(1);
		expect(window.__maxiIBDebug.events[0]).toEqual(result);
		expect(window.console.debug).toHaveBeenCalledWith(
			'[MaxiBlocks IB] test-event',
			{ id: 1 }
		);
	});

	it('can be disabled with the runtime flag', () => {
		window.__MAXI_IB_DEBUG__ = false;

		expect(getIsIBDebugEnabled()).toBe(false);
		expect(debugIB('disabled-event')).toBe(null);
		expect(window.__maxiIBDebug).toBeUndefined();
	});

	it('summarizes relation payloads without full attribute data', () => {
		const relation = {
			id: 3,
			title: 'Image relation',
			uniqueID: 'image-1',
			target: 'image',
			action: 'click',
			sid: 'bgl',
			attributes: {
				opacity: 0,
			},
			css: {
				' .selector': {
					opacity: 0,
				},
			},
			effects: {
				transitionTarget: ['opacity'],
			},
		};

		expect(summarizeRelation(relation)).toEqual({
			id: 3,
			title: 'Image relation',
			uniqueID: 'image-1',
			target: 'image',
			action: 'click',
			sid: 'bgl',
			attributeKeys: ['opacity'],
			cssKeys: [' .selector'],
			effectKeys: ['transitionTarget'],
		});
		expect(summarizeRelations([relation])).toEqual([
			summarizeRelation(relation),
		]);
	});

	it('handles nullable relation payload sections', () => {
		expect(
			summarizeRelation({
				id: 1,
				attributes: null,
				css: null,
				effects: null,
			})
		).toEqual({
			id: 1,
			title: undefined,
			uniqueID: undefined,
			target: undefined,
			action: undefined,
			sid: undefined,
			attributeKeys: [],
			cssKeys: [],
			effectKeys: [],
		});
	});
});
