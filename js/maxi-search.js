const onSearchEvent = input => {
	const inputValue = input.value;

	if (input.checkValidity()) {
		const searchUrl = `${window.location.origin}/?s=${inputValue}`;

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
	target,
	input,
	{ wrapper, content, contentClose, isIcon },
	searchBlock
) => {
	const isClickInside = searchBlock.contains(target);
	const isCLickOnButton = searchBlock
		.querySelector('.maxi-search-block__button')
		.contains(target);
	const isInputHidden = input.classList.contains(
		'maxi-search-block__input--hidden'
	);

	if (isInputHidden && isCLickOnButton) {
		wrapper.innerHTML = contentClose;
		toggleClasses(input, wrapper, isIcon);
	} else if (!isInputHidden && (isCLickOnButton || !isClickInside)) {
		wrapper.innerHTML = content;
		toggleClasses(input, wrapper, isIcon);
	}
};

const search = () => {
	Object.entries(maxiSearch[0]).forEach(
		([
			uniqueID,
			{
				buttonIconContent,
				buttonCloseIconContent,
				buttonContent,
				buttonContentClose,
				buttonSkin,
				skin,
			},
		]) => {
			const searchBlock = document.getElementById(uniqueID);

			if (!searchBlock) {
				return;
			}

			const button = searchBlock.querySelector(
				'.maxi-search-block__button'
			);
			const buttonIcon = searchBlock.querySelector(
				'.maxi-search-block__button__icon'
			);
			const buttonText = searchBlock.querySelector(
				'.maxi-search-block__button__content'
			);
			const input = searchBlock.querySelector(
				'.maxi-search-block__input'
			);

			const isIcon = buttonSkin === 'icon';

			const content = isIcon ? buttonIconContent : buttonContent;
			const contentClose = isIcon
				? buttonCloseIconContent
				: buttonContentClose;
			const wrapper = isIcon ? buttonIcon : buttonText;

			if (skin === 'icon-reveal') {
				document.addEventListener('click', event =>
					onRevealEvent(
						event.target,
						input,
						{ wrapper, content, contentClose, isIcon },
						searchBlock
					)
				);
			} else {
				button.addEventListener('click', () => onSearchEvent(input));
			}

			input.addEventListener('keypress', event => {
				if (event.key === 'Enter') {
					onSearchEvent(input);
				}
			});
		}
	);
};

window.addEventListener('load', search);
