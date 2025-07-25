/**
 * External dependencies
 */
import { isEmpty, camelCase } from 'lodash';

const modifyStyleElement = (styleElement, modifiedTarget, styleObj) => {
	styleElement.innerHTML = `${modifiedTarget} { ${Object.entries(
		styleObj
	).map(
		([key, value]) => `${key}: ${value} !important;`
	)} transition: none !important; }`;
};

const normalizeTarget = target =>
	target.replace('>', match => `:scope ${match}`);

const handleInsertInlineStyles = ({
	styleObj,
	target: rawTarget,
	isMultiplySelector,
	pseudoElement,
	styleObjKeys,
	ref,
}) => {
	if (isEmpty(styleObj)) return;

	const parentElement = ref?.current.blockRef.current;
	const target = normalizeTarget(rawTarget);
	const targetElements =
		target !== '' && target !== ':hover'
			? isMultiplySelector
				? Array.from(parentElement.querySelectorAll(target))
				: [parentElement.querySelector(target)]
			: [parentElement];

	targetElements.forEach(targetElement => {
		if (!targetElement) return;

		if (pseudoElement !== '') {
			const styleElement = targetElement.querySelector(
				`style[data-pseudo-element="${pseudoElement}"]`
			);

			if (styleElement) {
				modifyStyleElement(
					styleElement,
					`#${parentElement.id}${target}${pseudoElement}`,
					styleObj
				);
			} else {
				const styleElement = document.createElement('style');
				styleElement.setAttribute('data-pseudo-element', pseudoElement);
				modifyStyleElement(
					styleElement,
					`#${parentElement.id}${target}${pseudoElement}`,
					styleObj
				);

				targetElement.appendChild(styleElement);
			}
		} else {
			Object.entries(styleObj).forEach(([key, val]) => {
				targetElement.style[camelCase(key)] = val;
			});

			targetElement.style.transition = 'none';
		}

		if (pseudoElement === '') {
			styleObjKeys.current = [...Object.keys(styleObj), 'transition'];
		}
	});
};

const handleCleanInlineStyles = (
	rawTarget,
	pseudoElement = '',
	styleObjKeys,
	ref
) => {
	const target = normalizeTarget(rawTarget);
	const parentElement = ref?.current.blockRef.current;
	const targetElements =
		target !== ''
			? parentElement.querySelectorAll(target)
			: [parentElement];

	targetElements.forEach(targetElement => {
		if (
			pseudoElement !== '' &&
			targetElement.querySelector(
				`style[data-pseudo-element="${pseudoElement}"]`
			)
		) {
			targetElement
				.querySelector(`style[data-pseudo-element="${pseudoElement}"]`)
				.remove();
		} else {
			styleObjKeys.current.forEach(key => {
				if (targetElement.style[key]) targetElement.style[key] = '';
			});
		}
	});

	styleObjKeys.current = [];
};

export { handleInsertInlineStyles, handleCleanInlineStyles };
