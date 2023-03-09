import getEditorWrapper from './getEditorWrapper';

const MarginValueCalculator = (unmount = false) => {
	let fullWidthElementWidth = null;
	let editorWidth = null;
	let updateValue = false;
	const rawWrapper = getEditorWrapper();
	const editorWrapper = rawWrapper?.contentDocument ?? rawWrapper;

	// Some themes have margin values in vw or rem which can change on responsive, so we need to update the value on resize.
	const editorSizeObserver = new ResizeObserver(() => {
		updateValue = true;
	});

	editorSizeObserver.observe(editorWrapper);

	const getMarginValue = (unmount = false) => {
		if (unmount) {
			editorSizeObserver.disconnect();
			return 0;
		}

		if (
			fullWidthElementWidth === null ||
			editorWidth === null ||
			updateValue
		) {
			const blockContainer =
				editorWrapper.querySelector('.is-root-container');
			editorWidth = editorWrapper?.offsetWidth ?? null;

			const fullWidthElement = document.createElement('div');
			fullWidthElement.style.minWidth = '100%';
			blockContainer.appendChild(fullWidthElement);
			fullWidthElementWidth = fullWidthElement.offsetWidth;
			blockContainer.removeChild(fullWidthElement);

			updateValue = false;
		}

		return (editorWidth - fullWidthElementWidth) / 2;
	};

	return getMarginValue;
};

export default MarginValueCalculator;
