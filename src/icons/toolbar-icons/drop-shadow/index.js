/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarDropShadow = (
    <SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <Path
            fill='none'
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M17.8 22.3h4.3V4h-2.3v16h-4.3m4.3-16V1.7H2V20h13.2M4.3 20v2.3h13.3'
        />
    </SVG>
);

export default toolbarDropShadow;
