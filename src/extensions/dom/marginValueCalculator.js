import getEditorWrapper from './getEditorWrapper';

const marginValueCalculator = () => {
	let fullWidthElementWidth = null;
	let editorWidth = null;
	let updateValue = false;
	let observed = false;
	let editorSizeObserver = null;

	const getMarginValue = (unmount = false) => {
		if (unmount) {
			editorSizeObserver?.disconnect();
			return 0;
		}

		const rawWrapper = getEditorWrapper();
		const editorWrapper = rawWrapper?.contentDocument ?? rawWrapper;
		const blockContainer =
			editorWrapper?.querySelector('.is-root-container');

		if (blockContainer && !observed) {
			// Some themes have margin values in vw or rem which can change on responsive, so we need to update the value on resize.
			editorSizeObserver = new ResizeObserver(() => {
				updateValue = true;
			});
			editorSizeObserver.observe(blockContainer);
			observed = true;
		}

		if (
			fullWidthElementWidth === null ||
			editorWidth === null ||
			updateValue
		) {
			const blockContainer =
				editorWrapper?.querySelector('.is-root-container');

			if (!blockContainer) return 0;

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

export default marginValueCalculator;
