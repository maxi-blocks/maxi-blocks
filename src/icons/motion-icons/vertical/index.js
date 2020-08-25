/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const motionVertical = (
    <SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <Path
            d='M1.4 7L7 1.3l5.7 5.6M7 1.3l.1 13.9M22.6 17L17 22.7l-5.7-5.6m5.7 5.6l-.1-13.9'
            fill='none'
            stroke='#232533'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </SVG>
);

export default motionVertical;
