/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import DialogBox from '../index';

global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@components/button', () => {
	const Button = ({ children, icon, label, onClick }) => (
		<button aria-label={label} type='button' onClick={onClick}>
			{children || icon || label}
		</button>
	);

	return Button;
});

jest.mock('@components/icon', () => {
	const Icon = () => null;

	return Icon;
});

jest.mock('@extensions/fse', () => ({
	getIsSiteEditor: jest.fn(() => false),
}));

jest.mock('@maxi-icons', () => ({
	closeIcon: 'close',
	dialogIcon: 'dialog',
}));

describe('DialogBox', () => {
	let editor;
	let container;
	let root;

	beforeEach(() => {
		editor = document.createElement('div');
		editor.id = 'editor';
		document.body.appendChild(editor);

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		document.body.innerHTML = '';
	});

	const renderDialog = props => {
		act(() => {
			root.render(
				<DialogBox
					message='Confirm change'
					cancelLabel='Cancel'
					confirmLabel='Continue'
					isHidden={false}
					setIsHidden={jest.fn()}
					{...props}
				/>
			);
		});
	};

	it('calls onCancel when the cancel button is clicked', () => {
		const onCancel = jest.fn();
		const setIsHidden = jest.fn();

		renderDialog({ onCancel, setIsHidden });

		act(() => {
			editor.querySelector('button').click();
		});

		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(setIsHidden).toHaveBeenCalledWith(true);
	});

	it('calls onCancel when the close button is clicked', () => {
		const onCancel = jest.fn();
		const setIsHidden = jest.fn();

		renderDialog({ onCancel, setIsHidden });

		act(() => {
			editor.querySelector('button[aria-label="Close"]').click();
		});

		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(setIsHidden).toHaveBeenCalledWith(true);
	});

	it('does not call onCancel when confirming', () => {
		const onCancel = jest.fn();
		const onConfirm = jest.fn();

		renderDialog({ onCancel, onConfirm });

		act(() => {
			editor.querySelectorAll('button')[1].click();
		});

		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(onCancel).not.toHaveBeenCalled();
	});
});
