/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const largeMode = (
	<SVG width={32} height={27} x='0px' y='0px' viewBox='0 0 20 20'>
		<Path d='M19.5 2.1c-.3-.3-.7-.5-1.1-.4H1.5C.7 1.7 0 2.4 0 3.2v10.9c0 .8.7 1.5 1.5 1.5h5.3v1.2h-.3c-.4 0-.8.3-.8.8s.3.8.8.8h7.1c.4 0 .8-.3.8-.8s-.3-.8-.8-.8h-.4v-1.2h5.2c.4 0 .8-.1 1.1-.4.3-.3.5-.7.5-1.1V3.2c0-.4-.2-.8-.5-1.1zm-7.8 14.7H8.3v-1.2h3.3v1.2zm6.7-2.7H1.5V3.2h17l-.1 10.9z' />
		<Path d='M7.9 12.3h4.2c.4 0 .8-.3.8-.8s-.3-.8-.8-.8H8.6V5.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v5.7c0 .3.4.7.8.7z' />
	</SVG>
);

export default largeMode;
