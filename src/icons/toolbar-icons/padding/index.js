/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarPadding = (
    <SVG x='0px' y='0px' viewBox='0 0 24 24' xmlSpace='preserve'>
        <Path
            d='M22.1 7.4V2h-4.8m4.8 15v5.4h-4.8m1.3-13.3V5.7h-3.1M5.8 9.1V5.7h3M2.3 7.4V2h4.8M5.8 15.3v3.5h3M2.3 17v5.4h4.8m11.5-7.1v3.5h-3.1'
            fill='none'
            stroke='#fff'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </SVG>
);

export default toolbarPadding;
