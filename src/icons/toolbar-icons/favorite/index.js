/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarFavorite = (
    <SVG x='0px' y='0px' viewBox='0 0 24 24' xmlSpace='preserve'>
        <Path
            d='M12.1 22.6c1.1-.9 3.4-3.8 7.1-8.5 2.3-3.3 3.5-5.4 3.6-6.3 0-.2.1-.3.1-.5 0-1.6-.6-3-1.7-4.2C20.1 2 18.7 1.4 17 1.4s-3 .6-4.1 1.7c-.3.3-.6.6-.9 1-.2-.3-.5-.7-.8-1C10 2 8.6 1.4 7 1.4S4 2 2.8 3.1C1.7 4.3 1.1 5.7 1.1 7.3v.5c.1.9 1.4 3 3.7 6.3 3.7 4.7 6 7.6 7.1 8.5'
            fill='none'
            stroke='#fff'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </SVG>
);

export default toolbarFavorite;
