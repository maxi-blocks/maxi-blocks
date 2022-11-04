/**
 * WordPress dependencies
 */
import { getScrollContainer } from '@wordpress/dom';

const getBoundaryElement = (node, className) =>
	className
		? document.defaultView.frameElement?.querySelector(className) ||
		  getScrollContainer(node)?.querySelector(className) ||
		  document.body?.querySelector(className)
		: document.defaultView.frameElement ||
		  getScrollContainer(node) ||
		  document.body;

export default getBoundaryElement;
