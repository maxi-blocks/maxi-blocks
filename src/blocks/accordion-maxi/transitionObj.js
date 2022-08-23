import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		'header line': {
			title: 'Header line',
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__line',
			hoverProp: 'header-line-status-hover',
			limitless: true,
		},
		'content line': {
			title: 'Content line',
			target: ' > .maxi-pane-block > .maxi-pane-block__content-wrapper > .maxi-pane-block__line-container .maxi-pane-block__line',
			hoverProp: 'content-line-status-hover',
			limitless: true,
		},
		'pane title': {
			title: 'Pane title',
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__title',
			property: 'typography',
			limitless: true,
			prefix: 'title-',
		},
		'icon colour': {
			title: 'Icon colour',
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__icon svg > *',
			hoverProp: 'icon-status-hover',
			limitless: true,
		},
		'icon width': {
			title: 'Icon width',
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__icon svg',
			property: ['width', 'height'],
			hoverProp: 'icon-status-hover',
		},
		'icon background': {
			title: 'Icon background',
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__icon',
			property: 'background',
			hoverProp: 'icon-status-hover',
		},
		'icon border': {
			title: 'Icon border',
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__icon',
			property: 'border',
			hoverProp: 'icon-status-hover',
		},
	},
};

export default transitionObj;
