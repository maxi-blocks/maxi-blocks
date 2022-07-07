const searchEvent = input => {
	const inputValue = input.value;
	const searchUrl = `${window.location.origin}/?s=${inputValue}`;

	window.location.href = searchUrl;
};

const search = () => {
	Object.entries(maxiSearch[0]).forEach(
		([
			uniqueID,
			{
				iconContent,
				closeIconContent,
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
			const buttonText = searchBlock.querySelector('.maxi-search-block__button__content');
			const input = searchBlock.querySelector(
				'.maxi-search-block__input'
			);

			if (skin === 'icon-reveal') {
				button.addEventListener('click', () => {
					if (
						input.classList.contains(
							'maxi-search-block__input--hidden'
						)
					) {
						input.classList.remove(
							'maxi-search-block__input--hidden'
						);

						if(buttonSkin === 'icon') {
							buttonIcon.classList.add(
								'maxi-search-block__button__close-icon'
							);
							buttonIcon.classList.remove(
								'maxi-search-block__button__default-icon'
							);
							buttonIcon.innerHTML = closeIconContent;
						}	else {
							buttonText.innerHTML = buttonContentClose;
						}
					} else {
						input.classList.add('maxi-search-block__input--hidden');

						if(buttonSkin === 'icon') {
							buttonIcon.classList.remove(
								'maxi-search-block__button__close-icon'
							);
							buttonIcon.classList.add(
								'maxi-search-block__button__default-icon'
							);
							buttonIcon.innerHTML = iconContent;
						} else {
							buttonText.innerHTML = buttonContent;
						}
					}
				});
			} else {
				button.addEventListener('click', () => searchEvent(input));
			}
			input.addEventListener('keypress', e => {
				if (e.key === 'Enter') {
					searchEvent(input);
				}
			});
		}
	);
};

window.addEventListener('load', search);
