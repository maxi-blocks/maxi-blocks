/* eslint-disable no-undef */
class Accordion {
	constructor(el) {
		this.openPanes = [];
		this.accordion = el;
		this.uniqueID = el.id;

		let parsedMaxiAccordion;

		if (typeof maxiAccordion[0][this.uniqueID] === 'string') {
			try {
				parsedMaxiAccordion = JSON.parse(
					maxiAccordion[0][this.uniqueID]
				);
			} catch (e) {
				console.error('Invalid JSON string', e);
				return;
			}
		} else if (
			typeof maxiAccordion[0][this.uniqueID] === 'object' &&
			maxiAccordion[0][this.uniqueID] !== null
		) {
			parsedMaxiAccordion = maxiAccordion[0][this.uniqueID];
		} else {
			console.error(
				'maxiAccordion[0][this.uniqueID] is neither an object nor a string'
			);
			return;
		}
		({
			paneIcon: this.paneIcon,
			paneIconActive: this.paneIconActive,
			accordionLayout: this.accordionLayout,
			autoPaneClose: this.autoPaneClose,
			isCollapsible: this.isCollapsible,
		} = parsedMaxiAccordion);

		this.panes = Array.from(
			el.querySelectorAll(
				`.maxi-pane-block[data-accordion="${this.uniqueID}"]`
			)
		);

		this.init();
	}

	init() {
		this.panes.forEach(pane => {
			const header = pane.querySelector(
				':scope > .maxi-pane-block__header'
			);
			const contentWrapper = pane.querySelector(
				':scope > .maxi-pane-block__content-wrapper'
			);
			header.addEventListener('click', this.paneClick.bind(this));
			header.querySelector('.maxi-pane-block__icon').innerHTML =
				this.paneIcon;
			contentWrapper.addEventListener('transitionend', e => {
				// Don't clear styles when child's transition ends
				if (e.target !== e.currentTarget) return;
				this.cleanAnimationStyles(contentWrapper);
			});
		});
	}

	/* eslint-disable class-methods-use-this */
	cleanAnimationStyles(contentWrapper) {
		contentWrapper.style.overflow = null;
		contentWrapper.style.maxHeight = null;
	}
	/* eslint-enable class-methods-use-this */

	triggerAnimation(pane, isClose = false) {
		const contentWrapper = pane.querySelector(
			'.maxi-pane-block__content-wrapper'
		);

		if (isClose) {
			contentWrapper.style.maxHeight = `${contentWrapper.scrollHeight}px`;
			setTimeout(() => {
				contentWrapper.style.maxHeight = 0;
			}, 0);
		} else {
			contentWrapper.style.overflow = 'hidden';
			contentWrapper.style.maxHeight = `${contentWrapper.scrollHeight}px`;
		}
		// If animationDuration === 0, the transitionend listener is not triggered,
		// so need to clear styles here
		if (this.animationDuration === 0) {
			this.cleanAnimationStyles(contentWrapper);
		}
	}

	closePane(pane) {
		this.triggerAnimation(pane, true);
		pane.setAttribute('aria-expanded', false);
		pane.querySelector('.maxi-pane-block__icon').innerHTML = this.paneIcon;
		this.openPanes.splice(this.openPanes.indexOf(pane.id), 1);
	}

	openPane(pane) {
		this.triggerAnimation(pane);
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
