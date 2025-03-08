/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const accordionIcon = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill='var(--maxi-primary-color)'
		className='maxi-accordion-icon'
	>
		<Path d='M23 0H1a1.08 1.08 0 0 0-1 1v7.1V23a.94.94 0 0 0 1 1h22a.94.94 0 0 0 1-1V8.1 1a1.08 1.08 0 0 0-1-1zM2 2h20v5.1H2V2zm0 20V9.1h20V22H2zM20.7 3.5h-.1v-.1a.94.94 0 0 0-1-1 .94.94 0 0 0-1 1v.1h-.1a.94.94 0 0 0-1 1 .94.94 0 0 0 1 1h.1v.1a.94.94 0 0 0 1 1 .94.94 0 0 0 1-1v-.1h.1a.94.94 0 0 0 1-1c0-.6-.5-1-1-1zm-6.4 0H3.9a.94.94 0 0 0-1 1 .94.94 0 0 0 1 1h10.3a.94.94 0 0 0 1-1c0-.6-.4-1-.9-1zm0 7.8H3.9a.94.94 0 0 0-1 1 .94.94 0 0 0 1 1h10.3a.94.94 0 0 0 1-1c0-.6-.4-1-.9-1zM10 14.7H4a.94.94 0 0 0-1 1 .94.94 0 0 0 1 1h6a.94.94 0 0 0 1-1c0-.6-.5-1-1-1zm0 3.5H4a.94.94 0 0 0-1 1 .94.94 0 0 0 1 1h6a.94.94 0 0 0 1-1c0-.6-.5-1-1-1z' />
	</SVG>
);

export default accordionIcon;
