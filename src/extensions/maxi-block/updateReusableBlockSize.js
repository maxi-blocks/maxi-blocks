// This is a fix for wrong width of reusable blocks on backend only.
// This makes reusable blocks container full width and inserts element
// that mirrors the block on the same level as reusable container.
// The size of the clone if observed to get the width of the real block.
const updateReusableBlockSize = (target, uniqueID, clientId) => {
	target.parentNode.dataset.containsMaxiBlock = true;
	target.parentNode.parentNode.dataset.containsMaxiBlock = true;

	const sizeElement = document.createElement('div');
	sizeElement.classList.add(uniqueID, 'maxi-block', 'maxi-block--backend');
	sizeElement.id = `maxi-block-size-checker-${clientId}`;
	sizeElement.style =
		'top: 0 !important; height: 0 !important;  min-height: 0 !important; padding: 0 !important; margin: 0 !important; display:none !important;';
	target.parentNode.insertAdjacentElement('afterend', sizeElement);
};

export default updateReusableBlockSize;
