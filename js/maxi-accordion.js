class Accordion {
	openPane = -1;
	constructor(el) {
		this.accordion = el;
		this.uniqueID = el.id;
		Array.from(el.querySelectorAll('.maxi-pane-block__header')).forEach(
			header => {
				header.addEventListener('click', this.paneClick.bind(this));
				header.querySelector('.maxi-pane-block__icon').innerHTML =
					maxiAccordion[0][this.uniqueID].paneIcon;
			}
		);
	}

	paneClick(e) {
		const index = Array.prototype.indexOf.call(
			this.accordion.children,
			e.currentTarget.parentNode
		);
		if (this.openPane === index) {
			this.accordion.children[index].querySelector(
				'.maxi-pane-block__content'
			).style.display = 'none';
			this.accordion.children[index].querySelector(
				'.maxi-pane-block__icon'
			).innerHTML = maxiAccordion[0][this.uniqueID].paneIcon;
			this.openPane = -1;
		} else {
			this.accordion.children[index].querySelector(
				'.maxi-pane-block__content'
			).style.display = 'block';
			this.accordion.children[index].querySelector(
				'.maxi-pane-block__icon'
			).innerHTML = maxiAccordion[0][this.uniqueID].paneIconActive;

			if (this.openPane !== -1) {
				this.accordion.children[this.openPane].querySelector(
					'.maxi-pane-block__content'
				).style.display = 'none';
				this.accordion.children[this.openPane].querySelector(
					'.maxi-pane-block__icon'
				).innerHTML = maxiAccordion[0][this.uniqueID].paneIcon;
			}
			this.openPane = index;
		}
	}
}

document.addEventListener('DOMContentLoaded', () =>
	Array.from(document.getElementsByClassName('maxi-accordion-block')).forEach(
		el => new Accordion(el)
	)
);
