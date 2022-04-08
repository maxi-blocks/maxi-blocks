import { splitValueAndUnit } from '../../extensions/styles';

// eslint-disable-next-line import/prefer-default-export
export const maxiBlockTopMargin = ({
	e,
	ref,
	allowMargin,
	marginApplied: rawMarginApplied = false,
	setMarginApplied,
}) => {
	const blockNode = ref.current;

	let marginApplied = rawMarginApplied;
	let eventExists = false;

	const setMarginEvent = e => {
		const { clientX, clientY } = e;

		const rect = blockNode.getBoundingClientRect();

		const topRange = marginApplied ? 20 : 40;

		if (
			clientX > rect.left &&
			clientX < rect.right &&
			clientY > rect.top - topRange &&
			clientY < rect.top + topRange
		) {
			if (!marginApplied) {
				const originalMarginTop =
					getComputedStyle(blockNode).getPropertyValue('margin-top');

				const { value, unit } = splitValueAndUnit(originalMarginTop);

				blockNode.style.transition = 'margin-top 0.2s ease-in-out';
				blockNode.style.marginTop = `${value + 20}${unit}`;

				marginApplied = true;
				setMarginApplied(true);
			}
		} else {
			// eslint-disable-next-line no-lonely-if
			if (marginApplied) {
				ref.current.ownerDocument.removeEventListener(
					'mousemove',
					setMarginEvent
				);

				blockNode.style.marginTop = '';
				setTimeout(() => {
					blockNode.style.transition = '';

					marginApplied = false;
					setMarginApplied(false);
					eventExists = false;
				}, 200);
			}
		}
	};

	const { clientX, clientY } = e;
	const rect = blockNode.getBoundingClientRect();

	if (
		!eventExists &&
		!marginApplied &&
		allowMargin &&
		clientX > rect.left &&
		clientX < rect.right &&
		clientY > rect.top - 40 &&
		clientY < rect.top + 40
	) {
		ref.current.ownerDocument.addEventListener('mousemove', setMarginEvent);

		eventExists = true;
	}
};
