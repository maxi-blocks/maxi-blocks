import { maybeOpenFlowSidebar } from '../ai/utils/openFlowSidebar';

describe('maybeOpenFlowSidebar', () => {
	test('no-ops outside selection scope', () => {
		const selectBlock = jest.fn();
		const openSidebarForProperty = jest.fn();

		expect(
			maybeOpenFlowSidebar({
				flow: 'flow_icon_fill',
				mode: 'page',
				clientId: 'client-id',
				selectBlock,
				openSidebarForProperty,
			})
		).toBe(false);

		expect(selectBlock).not.toHaveBeenCalled();
		expect(openSidebarForProperty).not.toHaveBeenCalled();
	});

	test('no-ops when flow is missing', () => {
		const selectBlock = jest.fn();
		const openSidebarForProperty = jest.fn();

		expect(
			maybeOpenFlowSidebar({
				flow: null,
				mode: 'selection',
				clientId: 'client-id',
				selectBlock,
				openSidebarForProperty,
			})
		).toBe(false);

		expect(selectBlock).not.toHaveBeenCalled();
		expect(openSidebarForProperty).not.toHaveBeenCalled();
	});

	test('selects block then opens sidebar', () => {
		const selectBlock = jest.fn();
		const openSidebarForProperty = jest.fn();

		expect(
			maybeOpenFlowSidebar({
				flow: 'flow_icon_fill',
				mode: 'selection',
				clientId: 'client-id',
				selectBlock,
				openSidebarForProperty,
			})
		).toBe(true);

		expect(selectBlock).toHaveBeenCalledWith('client-id');
		expect(openSidebarForProperty).toHaveBeenCalledWith('flow_icon_fill');
	});

	test('still opens sidebar if selectBlock throws', () => {
		const selectBlock = jest.fn(() => {
			throw new Error('nope');
		});
		const openSidebarForProperty = jest.fn();

		expect(
			maybeOpenFlowSidebar({
				flow: 'flow_icon_fill',
				mode: 'selection',
				clientId: 'client-id',
				selectBlock,
				openSidebarForProperty,
			})
		).toBe(true);

		expect(openSidebarForProperty).toHaveBeenCalledWith('flow_icon_fill');
	});
});

