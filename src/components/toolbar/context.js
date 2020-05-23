/**
 * WordPress dependencies
 */
const { createContext } = wp.elements;

/**
 * Context
 */
const Context = createContext( {
	name: '',
	isSelected: false,
	focusedElement: null,
	setFocusedElement: noop,
	clientId: null,
} );
const { Provider, Consumer } = Context;

export { Provider as ToolbarProvider };