/**
 * Layouts Provider for the Layout Block.
 *
 * Provides layouts, sections, and favorites to other components
 * using React's Context API.
 */

import React, { createContext, Component } from 'react';

const { apiFetch } = wp;

export const MaxiContext = createContext({
	layouts: '',
	sections: '',
	all: '',
});

export default class MaxiProvider extends Component {
	state = {
		layouts: '',
		sections: '',
		all: '',
	}
	render() {
		return (
				<MaxiContext.Provider value={{
					layouts: this.state.layouts,
					sections: this.state.sections,
					all: this.state.all,
				}}>
					{this.props.children}
				</MaxiContext.Provider>
		);
	}
}
