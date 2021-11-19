export const selectorsButton = {
	canvas: ['', ':hover'],
	button: ['.maxi-button-block__button', '.maxi-button-block__button:hover'],
	content: [
		'.maxi-button-block__content',
		'.maxi-button-block__content:hover',
	],
	canvasBackground: ['', ':hover'],
	icon: [
		'.maxi-button-block__icon',
		'.maxi-button-block__icon svg',
		'.maxi-button-block__icon svg > *',
		'.maxi-button-block__icon svg path',
		'.maxi-button-block__icon:hover',
		'.maxi-button-block__icon:hover svg',
		'.maxi-button-block__icon:hover svg > *',
		'.maxi-button-block__icon:hover svg path',
	],
	canvasBefore: [':before', ':hover:before'],
	canvasAfter: [':after', ':hover:after'],
	buttonBefore: [
		'.maxi-button-block__button:before',
		'.maxi-button-block__button:hover:before',
	],
	buttonAfter: [
		'.maxi-button-block__button:after',
		'.maxi-button-block__button:hover:after',
	],
};

export const selectorsMap = {};
