import { createElement } from '@wordpress/element';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import BlockSelectControl from '../BlockSelectControl';

describe('BlockSelectControl', () => {
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

	const mouseOver = element => {
		act(() => {
			element.dispatchEvent(
				new MouseEvent('mouseover', {
					bubbles: true,
				})
			);
		});
	};

	const mouseOut = element => {
		act(() => {
			element.dispatchEvent(
				new MouseEvent('mouseout', {
					bubbles: true,
				})
			);
		});
	};

	const change = (element, value) => {
		act(() => {
			const inputValueSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype,
				'value'
			).set;

			inputValueSetter.call(element, value);
			element.dispatchEvent(
				new Event('input', {
					bubbles: true,
				})
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

	it('opens only the current block container and column groups by default', () => {
		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
							columnLabel: 'Text column',
							isCurrentGroup: true,
							isCurrentColumn: true,
						},
						{
							label: 'Hero button',
							value: 'hero-button',
							groupLabel: 'Hero container',
							columnLabel: 'Text column',
							isCurrentGroup: true,
							isCurrentColumn: true,
						},
						{
							label: 'Hero image',
							value: 'hero-image',
							groupLabel: 'Hero container',
							columnLabel: 'Image column',
						},
						{
							label: 'Footer icon',
							value: 'footer-icon',
							groupLabel: 'Footer container',
							columnLabel: 'Footer column',
						},
					],
					onChange: jest.fn(),
				})
			);
		});

		click(container.querySelector('.maxi-block-select-control__trigger'));

		expect(container.textContent).toContain('Hero text');
		expect(container.textContent).toContain('Hero button');
		expect(container.textContent).not.toContain('Hero image');
		expect(container.textContent).not.toContain('Footer icon');

		const heroGroupButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-group-button'
			)
		).find(button => button.textContent.includes('Hero container'));

		expect(heroGroupButton).toBeTruthy();
		expect(heroGroupButton.getAttribute('aria-expanded')).toBe('true');

		const textColumnButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-column-button'
			)
		).find(button => button.textContent.includes('Text column'));

		expect(textColumnButton).toBeTruthy();
		expect(textColumnButton.getAttribute('aria-expanded')).toBe('true');

		const imageColumnButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-column-button'
			)
		).find(button => button.textContent.includes('Image column'));

		expect(imageColumnButton).toBeTruthy();
		expect(imageColumnButton.getAttribute('aria-expanded')).toBe('false');

		click(imageColumnButton);

		expect(imageColumnButton.getAttribute('aria-expanded')).toBe('true');
		expect(container.textContent).toContain('Hero image');

		const footerGroupButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-group-button'
			)
		).find(button => button.textContent.includes('Footer container'));

		expect(footerGroupButton).toBeTruthy();
		expect(footerGroupButton.getAttribute('aria-expanded')).toBe('false');

		click(footerGroupButton);

		expect(footerGroupButton.getAttribute('aria-expanded')).toBe('true');

		const footerColumnButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-column-button'
			)
		).find(button => button.textContent.includes('Footer column'));

		expect(footerColumnButton).toBeTruthy();
		expect(footerColumnButton.getAttribute('aria-expanded')).toBe('false');
		expect(container.textContent).not.toContain('Footer icon');

		click(footerColumnButton);

		expect(footerColumnButton.getAttribute('aria-expanded')).toBe('true');
		expect(container.textContent).toContain('Footer icon');

		click(heroGroupButton);

		expect(heroGroupButton.getAttribute('aria-expanded')).toBe('false');
		expect(container.textContent).not.toContain('Hero text');
		expect(container.textContent).not.toContain('Hero button');
		expect(container.textContent).not.toContain('Hero image');
		expect(container.textContent).toContain('Footer icon');

		click(heroGroupButton);

		expect(heroGroupButton.getAttribute('aria-expanded')).toBe('true');
		expect(container.textContent).toContain('Hero text');
		expect(container.textContent).toContain('Hero button');
		expect(container.textContent).toContain('Hero image');
	});

	it('keeps container and column accordion rows free of number counts', () => {
		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
							columnLabel: 'Text column',
							isCurrentGroup: true,
							isCurrentColumn: true,
						},
						{
							label: 'Hero button',
							value: 'hero-button',
							groupLabel: 'Hero container',
							columnLabel: 'Text column',
							isCurrentGroup: true,
							isCurrentColumn: true,
						},
						{
							label: 'Hero image',
							value: 'hero-image',
							groupLabel: 'Hero container',
							columnLabel: 'Image column',
						},
						{
							label: 'Footer icon',
							value: 'footer-icon',
							groupLabel: 'Footer container',
							columnLabel: 'Footer column',
						},
					],
					onChange: jest.fn(),
				})
			);
		});

		click(container.querySelector('.maxi-block-select-control__trigger'));

		const heroGroupButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-group-button'
			)
		).find(button => button.textContent.includes('Hero container'));
		const footerGroupButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-group-button'
			)
		).find(button => button.textContent.includes('Footer container'));
		const textColumnButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-column-button'
			)
		).find(button => button.textContent.includes('Text column'));
		const imageColumnButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-column-button'
			)
		).find(button => button.textContent.includes('Image column'));

		expect(heroGroupButton).toBeTruthy();
		expect(footerGroupButton).toBeTruthy();
		expect(textColumnButton).toBeTruthy();
		expect(imageColumnButton).toBeTruthy();
		expect(
			container.querySelectorAll(
				'.maxi-block-select-control__option-count'
			)
		).toHaveLength(0);
	});

	it('shows an add blocks button below selected blocks and opens the picker from it', () => {
		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: ['hero-text'],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
						},
						{
							label: 'Hero button',
							value: 'hero-button',
							groupLabel: 'Hero container',
						},
					],
					onChange: jest.fn(),
				})
			);
		});

		expect(
			container.querySelector('.maxi-block-select-control__search-input')
		).toBeNull();

		const addButton = container.querySelector(
			'.maxi-block-select-control__selected-add'
		);

		expect(addButton).toBeTruthy();
		expect(addButton.textContent).toContain('Add blocks');

		click(addButton);

		const searchInput = container.querySelector(
			'.maxi-block-select-control__search-input'
		);

		expect(searchInput).toBeTruthy();
		expect(document.activeElement).toBe(searchInput);
	});

	it('groups selected chips by their container labels', () => {
		const onChange = jest.fn();

		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: ['hero-text', 'hero-button', 'footer-icon'],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
						},
						{
							label: 'Hero button',
							value: 'hero-button',
							groupLabel: 'Hero container',
						},
						{
							label: 'Footer icon',
							value: 'footer-icon',
							groupLabel: 'Footer container',
						},
					],
					onChange,
				})
			);
		});

		const selectedGroups = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__selected-group'
			)
		);

		expect(selectedGroups).toHaveLength(2);
		expect(selectedGroups[0].textContent).toContain('Hero container');
		expect(selectedGroups[0].textContent).toContain('Hero text');
		expect(selectedGroups[0].textContent).toContain('Hero button');
		expect(selectedGroups[0].textContent).not.toContain('Footer icon');
		expect(selectedGroups[1].textContent).toContain('Footer container');
		expect(selectedGroups[1].textContent).toContain('Footer icon');

		const heroTextRemove = Array.from(
			selectedGroups[0].querySelectorAll(
				'.maxi-block-select-control__selected-remove'
			)
		).find(button => button.getAttribute('aria-label') === 'Remove Hero text');

		click(heroTextRemove);

		expect(onChange).toHaveBeenLastCalledWith([
			'hero-button',
			'footer-icon',
		]);
	});

	it('reveals a selected chip target when the chip label is clicked', () => {
		const onChange = jest.fn();
		const onOptionReveal = jest.fn();

		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: ['hero-text'],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							hoverValue: 'hero-text-client',
							groupLabel: 'Hero container',
						},
					],
					onChange,
					onOptionReveal,
				})
			);
		});

		click(
			container.querySelector(
				'.maxi-block-select-control__selected-locate'
			)
		);

		expect(onOptionReveal).toHaveBeenLastCalledWith('hero-text-client');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('clears all selected targets from the selected block area', () => {
		const onChange = jest.fn();

		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: ['hero-text', 'hero-button'],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
						},
						{
							label: 'Hero button',
							value: 'hero-button',
							groupLabel: 'Hero container',
						},
					],
					onChange,
				})
			);
		});

		const clearButton = container.querySelector(
			'.maxi-block-select-control__selected-clear'
		);

		expect(clearButton).toBeTruthy();
		expect(clearButton.textContent).toContain('Clear all');

		click(clearButton);

		expect(onChange).toHaveBeenLastCalledWith([]);
	});

	it('shows block type markers on selectable block rows', () => {
		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
							blockType: 'text',
							blockTypeLabel: 'Text',
							isCurrentGroup: true,
						},
						{
							label: 'Hero image',
							value: 'hero-image',
							groupLabel: 'Hero container',
							blockType: 'image',
							blockTypeLabel: 'Image',
							isCurrentGroup: true,
						},
					],
					onChange: jest.fn(),
				})
			);
		});

		click(container.querySelector('.maxi-block-select-control__trigger'));

		const textOption = Array.from(
			container.querySelectorAll('.maxi-block-select-control__option')
		).find(option => option.textContent.includes('Hero text'));
		const imageOption = Array.from(
			container.querySelectorAll('.maxi-block-select-control__option')
		).find(option => option.textContent.includes('Hero image'));

		const textTypeIcon = textOption.querySelector(
			'.maxi-block-select-control__option-type-icon--text'
		);
		const imageTypeIcon = imageOption.querySelector(
			'.maxi-block-select-control__option-type-icon--image'
		);

		expect(textTypeIcon).toBeTruthy();
		expect(textTypeIcon.getAttribute('aria-label')).toBe('Text block');
		expect(imageTypeIcon).toBeTruthy();
		expect(imageTypeIcon.getAttribute('aria-label')).toBe('Image block');
	});

	it('shows current badges on the active container, column, and block rows', () => {
		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
							columnLabel: 'Text column',
							isCurrentGroup: true,
							isCurrentColumn: true,
							isCurrentBlock: true,
						},
						{
							label: 'Hero button',
							value: 'hero-button',
							groupLabel: 'Hero container',
							columnLabel: 'Text column',
							isCurrentGroup: true,
							isCurrentColumn: true,
						},
						{
							label: 'Footer icon',
							value: 'footer-icon',
							groupLabel: 'Footer container',
							columnLabel: 'Footer column',
						},
					],
					onChange: jest.fn(),
				})
			);
		});

		click(container.querySelector('.maxi-block-select-control__trigger'));

		const heroGroupButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-group-button'
			)
		).find(button => button.textContent.includes('Hero container'));
		const textColumnButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-column-button'
			)
		).find(button => button.textContent.includes('Text column'));
		const heroTextOption = Array.from(
			container.querySelectorAll('.maxi-block-select-control__option')
		).find(option => option.textContent.includes('Hero text'));
		const heroButtonOption = Array.from(
			container.querySelectorAll('.maxi-block-select-control__option')
		).find(option => option.textContent.includes('Hero button'));

		expect(
			heroGroupButton.querySelector(
				'.maxi-block-select-control__current-badge'
			).textContent
		).toBe('Current');
		expect(
			textColumnButton.querySelector(
				'.maxi-block-select-control__current-badge'
			).textContent
		).toBe('Current');
		expect(
			heroTextOption.querySelector(
				'.maxi-block-select-control__current-badge'
			).textContent
		).toBe('Current');
		expect(
			heroButtonOption.querySelector(
				'.maxi-block-select-control__current-badge'
			)
		).toBeNull();
	});

	it('shows the current search result count while filtering blocks', () => {
		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
						},
						{
							label: 'Hero button',
							value: 'hero-button',
							groupLabel: 'Hero container',
						},
						{
							label: 'Footer icon',
							value: 'footer-icon',
							groupLabel: 'Footer container',
						},
					],
					onChange: jest.fn(),
				})
			);
		});

		click(container.querySelector('.maxi-block-select-control__trigger'));

		const searchInput = container.querySelector(
			'.maxi-block-select-control__search-input'
		);
		const resultCount = () =>
			container.querySelector(
				'.maxi-block-select-control__search-count'
			).textContent;

		expect(resultCount()).toBe('3 blocks found');

		change(searchInput, 'Footer');

		expect(resultCount()).toBe('1 block found');
		expect(container.textContent).toContain('Footer icon');
		expect(container.textContent).not.toContain('Hero text');

		change(searchInput, 'Missing');

		expect(resultCount()).toBe('0 blocks found');
		expect(container.textContent).toContain('No blocks found');
	});

	it('closes the picker from the search header close button', () => {
		const onOptionHover = jest.fn();

		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							hoverValue: 'hero-text-client',
							groupLabel: 'Hero container',
							isCurrentGroup: true,
						},
					],
					onChange: jest.fn(),
					onOptionHover,
				})
			);
		});

		const trigger = container.querySelector(
			'.maxi-block-select-control__trigger'
		);

		click(trigger);

		const heroTextOption = container.querySelector(
			'.maxi-block-select-control__option'
		);

		mouseOver(heroTextOption);
		expect(onOptionHover).toHaveBeenLastCalledWith(
			'hero-text-client',
			true
		);

		click(container.querySelector('.maxi-block-select-control__close'));

		expect(
			container.querySelector('.maxi-block-select-control__search-input')
		).toBeNull();
		expect(onOptionHover).toHaveBeenLastCalledWith(
			'hero-text-client',
			false
		);
		expect(document.activeElement).toBe(trigger);
	});

	it('keeps the dropdown and current accordion branch open after selecting a block in multi-select mode', () => {
		const onChange = jest.fn();

		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text',
							groupLabel: 'Hero container',
							columnLabel: 'Text column',
							isCurrentGroup: true,
							isCurrentColumn: true,
						},
						{
							label: 'Hero button',
							value: 'hero-button',
							groupLabel: 'Hero container',
							columnLabel: 'Text column',
							isCurrentGroup: true,
							isCurrentColumn: true,
						},
						{
							label: 'Footer icon',
							value: 'footer-icon',
							groupLabel: 'Footer container',
							columnLabel: 'Footer column',
						},
					],
					onChange,
				})
			);
		});

		click(container.querySelector('.maxi-block-select-control__trigger'));

		const heroTextOption = Array.from(
			container.querySelectorAll('.maxi-block-select-control__option')
		).find(option => option.textContent.includes('Hero text'));

		expect(heroTextOption).toBeTruthy();

		click(
			heroTextOption.querySelector(
				'.maxi-block-select-control__option-check'
			)
		);

		expect(onChange).toHaveBeenLastCalledWith(['hero-text']);
		expect(
			container.querySelector('.maxi-block-select-control__search-input')
		).toBeTruthy();
		expect(container.textContent).toContain('Hero text');
		expect(container.textContent).toContain('Hero button');

		const heroGroupButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-group-button'
			)
		).find(button => button.textContent.includes('Hero container'));
		const textColumnButton = Array.from(
			container.querySelectorAll(
				'.maxi-block-select-control__option-column-button'
			)
		).find(button => button.textContent.includes('Text column'));

		expect(heroGroupButton.getAttribute('aria-expanded')).toBe('true');
		expect(textColumnButton.getAttribute('aria-expanded')).toBe('true');
	});

	it('highlights the hovered container, column, and block rows', () => {
		const onOptionHover = jest.fn();

		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text-uid',
							hoverValue: 'hero-text-client',
							groupLabel: 'Hero container',
							groupValue: 'hero-container-uid',
							groupHoverValue: 'hero-container-client',
							columnLabel: 'Text column',
							columnValue: 'text-column-uid',
							columnHoverValue: 'text-column-client',
							isCurrentGroup: true,
							isCurrentColumn: true,
						},
					],
					onChange: jest.fn(),
					onOptionHover,
				})
			);
		});

		click(container.querySelector('.maxi-block-select-control__trigger'));
		onOptionHover.mockClear();

		const heroGroupButton = container.querySelector(
			'.maxi-block-select-control__option-group-button'
		);
		const textColumnButton = container.querySelector(
			'.maxi-block-select-control__option-column-button'
		);
		const textOption = container.querySelector(
			'.maxi-block-select-control__option'
		);

		mouseOver(heroGroupButton);
		expect(onOptionHover).toHaveBeenLastCalledWith(
			'hero-container-client',
			true
		);

		onOptionHover.mockClear();
		mouseOver(textColumnButton);
		expect(onOptionHover).toHaveBeenNthCalledWith(
			1,
			'hero-container-client',
			false
		);
		expect(onOptionHover).toHaveBeenNthCalledWith(
			2,
			'text-column-client',
			true
		);

		onOptionHover.mockClear();
		mouseOver(textOption);
		expect(onOptionHover).toHaveBeenNthCalledWith(
			1,
			'text-column-client',
			false
		);
		expect(onOptionHover).toHaveBeenNthCalledWith(
			2,
			'hero-text-client',
			true
		);

		onOptionHover.mockClear();
		mouseOut(textOption);
		expect(onOptionHover).toHaveBeenLastCalledWith(
			'hero-text-client',
			false
		);
	});

	it('reveals the matching container or column when accordion rows are clicked', () => {
		const onOptionReveal = jest.fn();

		act(() => {
			root.render(
				createElement(BlockSelectControl, {
					label: 'Blocks to affect',
					value: [],
					multiple: true,
					options: [
						{
							label: 'Hero text',
							value: 'hero-text-uid',
							groupLabel: 'Hero container',
							groupValue: 'hero-container-uid',
							groupHoverValue: 'hero-container-client',
							columnLabel: 'Text column',
							columnValue: 'text-column-uid',
							columnHoverValue: 'text-column-client',
						},
					],
					onChange: jest.fn(),
					onOptionReveal,
				})
			);
		});

		click(container.querySelector('.maxi-block-select-control__trigger'));

		const heroGroupButton = container.querySelector(
			'.maxi-block-select-control__option-group-button'
		);

		expect(heroGroupButton.getAttribute('aria-expanded')).toBe('false');

		click(heroGroupButton);

		expect(onOptionReveal).toHaveBeenLastCalledWith(
			'hero-container-client'
		);
		expect(heroGroupButton.getAttribute('aria-expanded')).toBe('true');

		const textColumnButton = container.querySelector(
			'.maxi-block-select-control__option-column-button'
		);

		click(textColumnButton);

		expect(onOptionReveal).toHaveBeenLastCalledWith('text-column-client');
		expect(textColumnButton.getAttribute('aria-expanded')).toBe('true');
	});
});
