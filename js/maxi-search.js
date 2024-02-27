/* eslint-disable no-undef */
const onSearchEvent = input => {
	const searchLink = maxiSearch[1];
	const inputValue = input.value;
	if (input.checkValidity()) {
		const searchUrl = `${searchLink}${inputValue}`;

		window.location.href = searchUrl;
	} else {
		input.setCustomValidity('Please fill in the search field.');
		input.reportValidity();
	}
};

const toggleClasses = (input, wrapper, isIcon) => {
	input.classList.toggle('maxi-search-block__input--hidden');

	if (isIcon) {
		wrapper.classList.toggle('maxi-search-block__button__close-icon');
		wrapper.classList.toggle('maxi-search-block__button__default-icon');
	}
};

const onRevealEvent = (
	event,
	input,
	{ wrapper, content, contentClose, isIcon },
	searchBlock
) => {
	const { target, type } = event;

	const isClickType = type !== 'mouseover' && type !== 'mouseleave';

	const isTargetInside = searchBlock.contains(target);
	const isTargetOnButton = searchBlock
		.querySelector('.maxi-search-block__button')
		.contains(target);
	const isInputHidden = input.classList.contains(
		'maxi-search-block__input--hidden'
	);
	// eslint-disable-next-line @wordpress/no-global-active-element
	const isInputFocussed = input === document.activeElement;

	if (
		(isClickType || (!isClickType && type === 'mouseover')) &&
		isInputHidden &&
		isTargetOnButton
	) {
		wrapper.innerHTML = contentClose;
		toggleClasses(input, wrapper, isIcon);
	} else if (
		!isInputHidden &&
		((isClickType && (isTargetOnButton || !isTargetInside)) ||
			(!isClickType && type === 'mouseleave' && !isInputFocussed))
	) {
		wrapper.innerHTML = content;
		toggleClasses(input, wrapper, isIcon);
	}
};

const populateSearchInput = () => {
	const params = new URLSearchParams(window.location.search);
	const searchQuery = params.get('s'); // Assuming 's' is the query parameter for search
	if (searchQuery) {
		const searchInputs = document.querySelectorAll(
			'.maxi-search-block__input'
		);
		searchInputs.forEach(input => {
			input.value = searchQuery;
		});
	}
};

const search = () => {
	populateSearchInput(); // Populate search input with the query from URL
	Object.entries(maxiSearch[0]).forEach(([uniqueID, json]) => {
		let parsedJson;

		if (typeof json === 'string') {
			try {
				parsedJson = JSON.parse(json);
			} catch (e) {
				console.error('Invalid JSON string', e);
				return;
			}
		} else if (typeof json === 'object' && json !== null) {
			parsedJson = json;
		} else {
			console.error('json is neither an object nor a string');
			return;
		}

		const {
			buttonIconContent,
			buttonCloseIconContent,
			buttonContent,
			buttonContentClose,
			buttonSkin,
			iconRevealAction,
			skin,
		} = parsedJson;

		const searchBlock = document.getElementById(uniqueID);

		if (!searchBlock) return;

		const button = searchBlock.querySelector('.maxi-search-block__button');
		const buttonIcon = searchBlock.querySelector(
			'.maxi-search-block__button__icon'
		);
		const buttonText = searchBlock.querySelector(
			'.maxi-search-block__button__content'
		);
		const input = searchBlock.querySelector('.maxi-search-block__input');

		const isIcon = buttonSkin === 'icon';

		const content = isIcon ? buttonIconContent : buttonContent;
		const contentClose = isIcon
			? buttonCloseIconContent
			: buttonContentClose;
		const wrapper = isIcon ? buttonIcon : buttonText;

		if (skin === 'icon-reveal') {
			const events = [
				'click',
				...(iconRevealAction === 'hover'
					? ['mouseover', 'mouseleave']
					: []),
			];

			events.forEach(event => {
				const eventTarget = event === 'click' ? document : searchBlock;

				eventTarget.addEventListener(event, event =>
					onRevealEvent(
						event,
						input,
						{ wrapper, content, contentClose, isIcon },
						searchBlock
					)
				);
			});
		} else {
			button.addEventListener('click', () => onSearchEvent(input));
		}

		input.addEventListener('keypress', event => {
			if (event.key === 'Enter') {
				onSearchEvent(input);
			}
		});
	});
};

window.addEventListener('DOMContentLoaded', search);
