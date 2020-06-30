/**
 * Gutenberg Extra extension class
 * 
 * @deprecated Waiting for refactoring components to remove this file
 */

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const {
    dispatch,
    select,
} = wp.data;

/**
 * Class
 */
export default class MaxiComponent extends Component {
    saveAndSend(value) {
        this.props.onChange(JSON.stringify(value));
    } 
}