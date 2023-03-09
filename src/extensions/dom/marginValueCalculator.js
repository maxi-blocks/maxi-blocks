import getEditorWrapper from './getEditorWrapper';

const MarginValueCalculator = () => {
	let fullWidthElementWidth = null;
	let editorWidth = null;
	let updateValue = false;
	const rawWrapper = getEditorWrapper();
	const editorWrapper = rawWrapper?.contentDocument ?? rawWrapper;

	const getMarginValue = () => {
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

	// Some themes have margin values in vw or rem which change on responsive, so we need to update the value on resize.
	const editorSizeObserver = new ResizeObserver(() => {
		updateValue = true;
	});

	editorSizeObserver.observe(editorWrapper);

	return getMarginValue;
};

export default MarginValueCalculator;
