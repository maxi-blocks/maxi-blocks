class Accordion {
	openPane = -1;
	constructor(el) {
		this.accordion = el;
		Array.from(
			el.getElementsByClassName('maxi-pane-block__header')
		).forEach(header =>
			header.addEventListener('click', this.paneClick.bind(this))
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
			this.openPane = -1;
		} else {
			this.accordion.children[index].querySelector(
				'.maxi-pane-block__content'
			).style.display = 'block';

			if (this.openPane !== -1) {
				this.accordion.children[this.openPane].querySelector(
					'.maxi-pane-block__content'
				).style.display = 'none';
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
