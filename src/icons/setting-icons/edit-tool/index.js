/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const editTool = (
	<SVG height={512} viewBox='0 0 467.765 467.765' width={512}>
		<Path d='M175.412 175.412h29.235v116.941h-29.235v58.471h116.941v-58.471h-29.235V175.412h29.235v29.235h58.471v-87.706H116.941v87.706h58.471z' />
		<Path d='M467.765 87.706V0h-87.706v29.235H87.706V0H0v87.706h29.235v292.353H0v87.706h87.706V438.53h292.353v29.235h87.706v-87.706H438.53V87.706zm-87.706 292.353H87.706V87.706h292.353z' />
	</SVG>
);

export default editTool;
