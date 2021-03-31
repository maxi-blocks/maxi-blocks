/**
 * Layouts Provider for the Layout Block.
 *
 * Provides layouts, sections, and favorites to other components
 * using React's Context API.
 */

import React, { createContext, Component } from 'react';

export const MaxiContext = createContext({
	layouts: '',
	sections: '',
	all: '',
});

export default class MaxiProvider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			layouts: '',
			sections: '',
			all: '',
		};
	}

	async componentDidMount() {
		async components => {
			const layouts = [];
			const sections = [];

			Object.values(components).forEach(function (item) {
				if (item.type === 'layout') {
					layouts.push(item);
				} else {
					sections.push(item);
				}
			});

			this.setState({
				all: components,
				layouts,
				sections,
			});
		};
	}

	render() {
		return (
			<MaxiContext.Provider
				value={{
					layouts: this.state.layouts,
					sections: this.state.sections,
					all: this.state.all,
				}}
			>
				{this.props.children}
			</MaxiContext.Provider>
		);
	}
}
