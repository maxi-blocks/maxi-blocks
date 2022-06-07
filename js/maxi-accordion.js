class Accordion {
	openPane = -1;
	constructor(el) {
		this.accordion = el;
		this.uniqueID = el.id;
		this.paneIcon = maxiAccordion[0][this.uniqueID].paneIcon;
		this.paneIconActive = maxiAccordion[0][this.uniqueID].paneIconActive;
		this.accordionLayout = maxiAccordion[0][this.uniqueID].accordionLayout;
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
			this.accordion.children,
			e.currentTarget.parentNode
		);
		const pane = this.accordion.children[index];
		if (this.openPane === index) {
			pane.querySelector('.maxi-pane-block__content').style.display =
				'none';
			pane.querySelector('.maxi-pane-block__icon').innerHTML =
				this.paneIcon;
			this.openPane = -1;
			if (this.accordionLayout === 'boxed')
				pane.removeChild(pane.querySelector('hr'));
			else pane.removeChild(pane.querySelectorAll('hr')[1]);
		} else {
			pane.querySelector('.maxi-pane-block__content').style.display =
				'block';
			pane.querySelector('.maxi-pane-block__icon').innerHTML =
				this.paneIconActive;

			if (this.accordionLayout === 'boxed') {
				pane.insertBefore(
					document.createElement('hr'),
					pane.querySelector('.maxi-pane-block__content')
				);
			} else
				pane.insertBefore(
					document.createElement('hr'),
					pane.querySelector('.maxi-pane-block__content').nextSibling
				);

			if (this.openPane !== -1) {
				this.accordion.children[this.openPane].querySelector(
					'.maxi-pane-block__content'
				).style.display = 'none';
				this.accordion.children[this.openPane].querySelector(
					'.maxi-pane-block__icon'
				).innerHTML = this.paneIcon;
				if (this.accordionLayout === 'boxed')
					this.accordion.children[this.openPane].removeChild(
						this.accordion.children[this.openPane].querySelector(
							'hr'
						)
					);
				else
					this.accordion.children[this.openPane].removeChild(
						this.accordion.children[this.openPane].querySelectorAll(
							'hr'
						)[1]
					);
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
