/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const accordion = (
	<SVG
		version='1.1'
		id='ga_layer_accordion'
		x='0px'
		y='0px'
		viewBox='0 0 24 24'
		space='preserve'
	>
		<style>
			{
				'.st0{fill:none;stroke:var(--maxi-primary-color);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}'
			}
			{'.ga_layer_accordion {enable-background:new 0 0 24 24;}'}
		</style>
		<g transform='matrix( 1, 0, 0, 1, -0.05,-1.9) '>
			<g>
				<Path
					id='gx_accordion_STROKES'
					className='st0'
					d='M20.3,5.1v1h1 M20.3,6.1v1 M21.3,21.7h-1v1 M21.3,17.5h-1v1 M20.3,16.5v1h-1
       M20.3,20.7v1h-1 M2.5,9.4h19.1v5.2H2.5V9.4z M2.7,21.7h14.5 M2.7,17.5h14.5 M2.7,6.1h14.5 M19.3,6.1h1'
				/>
			</g>
		</g>
	</SVG>
);

export default accordion;
