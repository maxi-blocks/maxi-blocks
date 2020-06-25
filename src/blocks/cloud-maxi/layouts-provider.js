/**
 * Layouts Provider for the Layout Block.
 *
 * Provides layouts, sections, and favorites to other components
 * using React's Context API.
 */

import React, { createContext, Component } from 'react';

const { apiFetch } = wp;

export const LayoutsContext = createContext({
	layouts: '',
	sections: '',
	all: '',
});

export default class LayoutsProvider extends Component {
	state = {
		layouts: '',
		sections: '',
		all: '',
	}

	async componentDidMount() {

		
		async components => {
			let layouts   = [];
			let sections  = [];

			Object.values( components ).forEach( function( item ) {
				if ( item.type === 'layout' ) {
					layouts.push( item );
				} else {
					sections.push( item );
				}

			} );

			this.setState( {
				all: components,
				layouts: layouts,
				sections: sections,
			} );
		} 
	}

	render() {
		return (
				<LayoutsContext.Provider value={{
					layouts: this.state.layouts,
					sections: this.state.sections,
					all: this.state.all,
				}}>
					{this.props.children}
				</LayoutsContext.Provider>
		);
	}
}
