class Accordion {
	openPanes = [];
	constructor(el) {
		this.accordion = el;
		this.uniqueID = el.id;
		this.paneIcon = maxiAccordion[0][this.uniqueID].paneIcon;
		this.paneIconActive = maxiAccordion[0][this.uniqueID].paneIconActive;
		this.accordionLayout = maxiAccordion[0][this.uniqueID].accordionLayout;
		this.autoPaneClose = maxiAccordion[0][this.uniqueID].autoPaneClose;
		Array.from(el.querySelectorAll('.maxi-pane-block__header')).forEach(
			header => {
				header.addEventListener('click', this.paneClick.bind(this));
				header.querySelector('.maxi-pane-block__icon').innerHTML =
					this.paneIcon;
			}
		);
	}

	paneClick(e) {
		const index = Array.prototype.indexOf.call(
			this.accordion.children[0].children,
			e.currentTarget.parentNode
		);

		const pane = this.accordion.children[0].children[index];
		if (this.openPanes.includes(index)) {
			pane.setAttribute('aria-expanded', false);
			pane.querySelector('.maxi-pane-block__icon').innerHTML =
				this.paneIcon;
			for (var i = 0; i < this.openPanes.length; i++)
				if (this.openPanes[i] === index) this.openPanes.splice(i, 1);
		} else {
			pane.setAttribute('aria-expanded', true);
			pane.querySelector('.maxi-pane-block__icon').innerHTML =
				this.paneIconActive;

			if (this.openPanes.length > 0 && this.autoPaneClose) {
				let index = this.openPanes[0];
				this.openPanes = [];
				this.accordion.children[index].setAttribute(
					'aria-expanded',
					false
				);
				this.accordion.children[index].querySelector(
					'.maxi-pane-block__icon'
				).innerHTML = this.paneIcon;
			}
			this.openPanes.push(index);
		}
	}
}

document.addEventListener('DOMContentLoaded', () =>
	Array.from(document.querySelectorAll('.maxi-accordion-block')).forEach(
		el => new Accordion(el)
	)
);
