const headerPrefix = 'header-';
const contentPrefix = 'content-';

const transitionObj = {
	pane: {
		border: {
			title: 'Border',
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'top', 'left'],
		},
		'box shadow': {
			title: 'Box shadow',
			target: '',
			property: 'box-shadow',
		},
		'background / layer': {
			title: 'Background / Layer',
			target: ' > .maxi-background-displayer > div',
			property: 'background',
			limitless: true,
		},
	},
	header: {
		border: {
			title: 'Border',
			target: ' .maxi-pane-block__header',
			property: 'border',
			prefix: headerPrefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-pane-block__header',
			property: 'box-shadow',
			prefix: headerPrefix,
		},
		background: {
			title: 'Background',
			target: ' .maxi-pane-block__header',
			property: 'background',
			prefix: headerPrefix,
		},
	},
	content: {
		border: {
			title: 'Border',
			target: ' .maxi-pane-block__content',
			property: 'border',
			prefix: contentPrefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-pane-block__content',
			property: 'box-shadow',
			prefix: contentPrefix,
		},
		background: {
			title: 'Background',
			target: ' .maxi-pane-block__content',
			property: 'background',
			prefix: contentPrefix,
		},
	},
};

export default transitionObj;
