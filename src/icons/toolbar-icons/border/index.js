/**
 * WordPress dependencies
 */
const { SVG, Path, G } = wp.primitives;

const toolbarBorder = (
    <SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14.8 15.1'>
        <G data-name='Layer 2'>
            <Path
                fill='#fff'
                d='M4 13.1H2v-2.5a1 1 0 00-2 0v3.5a1 1 0 001 1h3a1 1 0 100-2zM4 0H1a1 1 0 00-1 1v3.4a1 1 0 002 0V2h2a1 1 0 000-2zm9.8 0h-3.1a1 1 0 000 2h2.1v2.4a1 1 0 102 0V1a1 1 0 00-1-1zm0 9.6a1 1 0 00-1 1v2.5h-2.1a1 1 0 000 2h3.1a1 1 0 001-1v-3.5a1 1 0 00-1-1z'
                data-name='Layer 1'
            />
        </G>
    </SVG>
);

export default toolbarBorder;
