const AccordionItemButton = props => {
	const { children, className, toggleExpanded, uniqueId, isExpanded } = props;

	const keycodes = {
		END: 'End',
		ENTER: 'Enter',
		HOME: 'Home',
		SPACE: ' ',
		SPACE_DEPRECATED: 'Spacebar',
		UP: 'ArrowUp',
		DOWN: 'ArrowDown',
		LEFT: 'ArrowLeft',
		RIGHT: 'ArrowRight',
	};

	const getClosestAccordion = el => {
		return (
			el &&
			(el.matches('[data-accordion-component="Accordion"]')
				? el
				: getClosestAccordion(el.parentElement))
		);
	};

	const getSiblingButtons = item => {
		const parentAccordion = getClosestAccordion(item);

		return (
			parentAccordion &&
			Array.from(
				parentAccordion.querySelectorAll(
					'[data-accordion-component="AccordionItemButton"]'
				)
			)
		);
	};

	const handleKeyPress = evt => {
		const keyCode = evt.key;

		if (
			keyCode === keycodes.ENTER ||
			keyCode === keycodes.SPACE ||
			keyCode === keycodes.SPACE_DEPRECATED
		) {
			evt.preventDefault();
			toggleExpanded(isExpanded ? '' : uniqueId);
		}

		if (evt.target instanceof HTMLElement) {
			const siblings = getSiblingButtons(evt.target);
			switch (keyCode) {
				case keycodes.HOME: {
					evt.preventDefault();
					siblings[0]?.focus();
					break;
				}
				case keycodes.END: {
					evt.preventDefault();
					siblings[siblings.length - 1]?.focus();
					break;
				}
				case keycodes.LEFT:
				case keycodes.UP: {
					evt.preventDefault();
					const currentIndex = siblings.indexOf(evt.target);
					if (currentIndex !== -1) {
						const previous = siblings[currentIndex - 1];
						if (previous) {
							previous.focus();
						}
					}
					break;
				}
				case keycodes.RIGHT:
				case keycodes.DOWN: {
					evt.preventDefault();
					const currentIndex = siblings.indexOf(evt.target);
					if (currentIndex !== -1) {
						const next = siblings[currentIndex + 1];
						if (next) {
							next.focus();
						}
					}
					break;
				}
				default: {
					//
				}
			}
		}
	};

	return (
		<div
			role='button'
			tabIndex={0}
			onClick={() => toggleExpanded(isExpanded ? '' : uniqueId)}
			onKeyDown={handleKeyPress}
			className={className}
			aria-expanded={isExpanded}
			data-accordion-component='AccordionItemButton'
		>
			{children}
		</div>
	);
};

export default AccordionItemButton;
