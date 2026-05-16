import { createElement } from '@wordpress/element';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import AdvancedNumberControl from '@components/advanced-number-control';
import { clampNumberInputValue } from '@components/advanced-number-control/utils';

global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@wordpress/i18n', () => ({
	__: text => text,
}));

jest.mock('@wordpress/components', () => ({
	RangeControl: () => null,
}));

jest.mock('@wordpress/compose', () => ({
	useDebounce: callback => callback,
	useInstanceId: () => 'test-id',
}));

jest.mock('@extensions/styles', () => ({
	getIsValid: value => value !== undefined,
}));

jest.mock('@components/base-control', () => {
	return function BaseControl({ children }) {
		return <div>{children}</div>;
	};
});

jest.mock('@components/select-control', () => {
	return function SelectControl() {
		return null;
	};
});

jest.mock('@components/toggle-switch', () => {
	return function ToggleSwitch() {
		return null;
	};
});

jest.mock('@components/reset-control', () => {
	return function ResetButton() {
		return null;
	};
});

const setInputValue = (input, value) => {
	Object.getOwnPropertyDescriptor(
		window.HTMLInputElement.prototype,
		'value'
	).set.call(input, value);
	input.dispatchEvent(
		new InputEvent('input', {
			bubbles: true,
			inputType: 'insertText',
		})
	);
};

describe('AdvancedNumberControl', () => {
	let container;
	let root;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		document.body.removeChild(container);
	});

	it('allows typing a partial value below a positive min without saving it', () => {
		const onChangeValue = jest.fn();

		act(() => {
			root.render(
				createElement(AdvancedNumberControl, {
					min: 10,
					value: 10,
					onChangeValue,
				})
			);
		});

		const input = container.querySelector('input');

		act(() => {
			setInputValue(input, '2');
		});

		expect(input.value).toBe('2');
		expect(onChangeValue).not.toHaveBeenCalled();

		act(() => {
			input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
		});

		expect(input.value).toBe('10');
		expect(onChangeValue).toHaveBeenCalledWith(10, { inline: {} });
	});

	it('allows numeric string values to be completed before clamping to min', () => {
		const onChangeValue = jest.fn();

		act(() => {
			root.render(
				createElement(AdvancedNumberControl, {
					min: 15,
					value: '15',
					optionType: 'string',
					onChangeValue,
				})
			);
		});

		const input = container.querySelector('input');

		act(() => {
			setInputValue(input, '1');
		});

		expect(input.value).toBe('1');
		expect(onChangeValue).not.toHaveBeenCalled();

		act(() => {
			input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
		});

		expect(input.value).toBe('15');
		expect(onChangeValue).toHaveBeenCalledWith('15', { inline: {} });
	});

	it('allows marker-size-style values to be replaced with another valid value', () => {
		const onChangeValue = jest.fn();

		act(() => {
			root.render(
				createElement(AdvancedNumberControl, {
					min: 15,
					max: 40,
					value: '20',
					defaultValue: '20',
					optionType: 'string',
					onChangeValue,
				})
			);
		});

		const input = container.querySelector('input');

		act(() => {
			setInputValue(input, '');
		});

		expect(input.value).toBe('');
		expect(onChangeValue).not.toHaveBeenCalled();

		act(() => {
			setInputValue(input, '3');
		});

		expect(input.value).toBe('3');
		expect(onChangeValue).not.toHaveBeenCalled();

		act(() => {
			setInputValue(input, '30');
		});

		expect(input.value).toBe('30');
		expect(onChangeValue).toHaveBeenCalledWith('30', { inline: {} });
	});

	it('clamps an empty positive-min numeric input on blur', () => {
		const onChangeValue = jest.fn();

		act(() => {
			root.render(
				createElement(AdvancedNumberControl, {
					min: 15,
					value: '20',
					optionType: 'string',
					onChangeValue,
				})
			);
		});

		const input = container.querySelector('input');

		act(() => {
			setInputValue(input, '');
		});

		expect(input.value).toBe('');
		expect(onChangeValue).not.toHaveBeenCalled();

		act(() => {
			input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
		});

		expect(input.value).toBe('15');
		expect(onChangeValue).toHaveBeenCalledWith('15', { inline: {} });
	});

	it('still clamps values above max while typing', () => {
		const onChangeValue = jest.fn();

		act(() => {
			root.render(
				createElement(AdvancedNumberControl, {
					max: 50,
					value: 10,
					onChangeValue,
				})
			);
		});

		const input = container.querySelector('input');

		act(() => {
			setInputValue(input, '99');
		});

		expect(input.value).toBe('50');
		expect(onChangeValue).toHaveBeenCalledWith(50, { inline: {} });
	});
});

describe('clampNumberInputValue', () => {
	it('can defer min clamping for intermediate typing', () => {
		expect(
			clampNumberInputValue('2', {
				min: 10,
				max: 99,
				clampMin: false,
			})
		).toBe('2');
	});

	it('clamps to min when min clamping is enabled', () => {
		expect(clampNumberInputValue('2', { min: 10, max: 99 })).toBe(10);
	});
});
