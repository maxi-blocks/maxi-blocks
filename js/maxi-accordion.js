class Accordion {
	constructor(el) {
		this.openPanes = [];
		this.accordion = el;
		this.uniqueID = el.id;
		this.paneIcon = maxiAccordion[0][this.uniqueID].paneIcon;
		this.paneIconActive = maxiAccordion[0][this.uniqueID].paneIconActive;
		this.accordionLayout = maxiAccordion[0][this.uniqueID].accordionLayout;
		this.autoPaneClose = maxiAccordion[0][this.uniqueID].autoPaneClose;
		this.isCollapsible = maxiAccordion[0][this.uniqueID].isCollapsible;
		this.panes = Array.from(
			el.querySelectorAll(':scope > .maxi-pane-block')
		);

		this.events();
	}

	events() {
		this.panes.forEach(pane => {
			const header = pane.querySelector(
				':scope > .maxi-pane-block__header'
			);
			const content = pane.querySelector(
				':scope > .maxi-pane-block__content'
			);
			header.addEventListener('click', this.paneClick.bind(this));
			header.querySelector('.maxi-pane-block__icon').innerHTML =
				this.paneIcon;
			content.addEventListener('transitionend', () => {
				content.style.overflow = null;
			});
		});
	}

	closePane(pane) {
		const content = pane.querySelector('.maxi-pane-block__content');
		content.style.maxHeight = 0;
		pane.setAttribute('aria-expanded', false);
		pane.querySelector('.maxi-pane-block__icon').innerHTML = this.paneIcon;
		this.openPanes.splice(this.openPanes.indexOf(pane.id), 1);
	}

	openPane(pane) {
		const content = pane.querySelector('.maxi-pane-block__content');
		content.style.overflow = 'hidden';
		content.style.maxHeight = content.scrollHeight + 'px';
		pane.setAttribute('aria-expanded', true);
		pane.querySelector('.maxi-pane-block__icon').innerHTML =
			this.paneIconActive;

		if (this.autoPaneClose) {
			this.openPanes.forEach(id => {
				const pane = this.accordion.querySelector(`#${id}`);
				this.closePane.call(this, pane);
			});
		}
		this.openPanes.push(pane.id);
	}

	paneClick(e) {
		const pane = e.currentTarget.parentNode;

		if (this.openPanes.includes(pane.id)) {
			if (!this.isCollapsible && this.openPanes.length <= 1) return;
			this.closePane.call(this, pane);
		} else {
			this.openPane.call(this, pane);
		}
	}
}

document.addEventListener('DOMContentLoaded', () =>
	Array.from(document.querySelectorAll('.maxi-accordion-block')).forEach(
		el => new Accordion(el)
	)
);
