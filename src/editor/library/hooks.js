import { useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Hook to observe the size of a block placeholder
 *
 * @param {React.RefObject} ref                        - The ref object to observe.
 * @param {boolean}         [isCloudPlaceholder=false] - Whether the block is a cloud placeholder.
 * @param {number}          [smallBreakpoint=120]      - Width where the block switches to compact mode.
 * @returns {Object} An object containing the block size states.
 */
const useObserveBlockSize = (ref, isCloudPlaceholder = false, smallBreakpoint = 120) => {
	const [isBlockSmall, setIsBlockSmall] = useState(null);
	const [isBlockSmaller, setIsBlockSmaller] = useState(null);

	const resizeObserver = useMemo(() => {
		return new ResizeObserver(entries => {
			const newIsSmallBlock =
				entries[0].contentRect.width < smallBreakpoint;
			const newIsSmallerBlock = entries[0].contentRect.width < 38;

			if (newIsSmallBlock !== isBlockSmall)
				setIsBlockSmall(newIsSmallBlock);
			if (newIsSmallerBlock !== isBlockSmaller)
				setIsBlockSmaller(newIsSmallerBlock);
		});
	}, [isBlockSmall, isBlockSmaller, smallBreakpoint]);

	useEffect(() => {
		const elementToObserve = isCloudPlaceholder
			? ref.current?.closest('.maxi-block-library__placeholder')
			: ref.current;
		if (resizeObserver && elementToObserve)
			resizeObserver.observe(elementToObserve);

		return () => {
			if (resizeObserver) resizeObserver.disconnect();
		};
	}, [ref, resizeObserver, isCloudPlaceholder]);

	return { isBlockSmall, isBlockSmaller };
};

export default useObserveBlockSize;
