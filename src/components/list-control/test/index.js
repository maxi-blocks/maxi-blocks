import { createElement } from '@wordpress/element';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import ListControl from '../index';
import ListItemControl from '../list-item-control';

jest.mock('@extensions/relations/debugPreview', () => ({
	debugPreview: jest.fn(),
}));

jest.mock('react-drag-listview', () => ({
	__esModule: true,
	default: ({ children }) => {
		const { createElement: mockCreateElement } = require('@wordpress/element');
		return mockCreateElement('div', null, children);
	},
}));

describe('ListControl', () => {
	let container;
	let root;

	const click = element => {
		act(() => {
			element.dispatchEvent(
				new MouseEvent('click', {
					bubbles: true,
				})
			);
		});
	};

	const renderList = ids => {
		act(() => {
			root.render(
				createElement(
					ListControl,
					null,
					ids.map(id =>
						createElement(ListItemControl, {
							key: id,
							id,
							title: id,
							content: createElement(
								'div',
								{ className: 'test-list-content' },
								`${id} content`
							),
							onRemove: jest.fn(),
						})
					)
				)
			);
		});
	};

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		container.remove();
		container = null;
		root = null;
	});

	it('keeps the matching row open when a child id is replaced at the same position', () => {
		renderList(['relation-group-1', 'relation-legacy-abc']);

		click(container.querySelectorAll('.maxi-list-item-control__row')[1]);

		expect(container.textContent).toContain('relation-legacy-abc content');

		renderList(['relation-group-1', 'relation-group-2']);

		expect(container.textContent).toContain('relation-group-2 content');
		expect(container.textContent).not.toContain(
			'relation-legacy-abc content'
		);
	});
});
