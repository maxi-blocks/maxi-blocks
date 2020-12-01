/**
 * WordPress dependencies
 */
const { Component, render } = wp.element;
const { subscribe } = wp.data;

import stylesGenerator from '../../extensions/styles/stylesGenerator';

import { isEqual } from 'lodash';

/**
 * Component
 */
class BlockStyles extends Component {
	state = {
		styles: '',
	};

	render() {
		subscribe(() => {
			const newStyles = stylesGenerator();

			if (!isEqual(newStyles, this.state.styles))
				this.setState({ styles: newStyles });
		});

		return <style id='testing-styles'>{this.state.styles}</style>;
	}
}

if (document.body.classList.contains('maxi-blocks--active')) {
	const wrapper = document.createElement('div');
	wrapper.id = 'maxi-blocks__styles';

	document.head.appendChild(wrapper);

	render(<BlockStyles />, wrapper);
}
