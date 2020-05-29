/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const SvgComponent = (
    <SVG x="0px" y="0px" viewBox="0 0 24 24" xmlSpace="preserve">
        <Path
            d="M3.2 6.5c-.1 0-.2 0-.2-.1-.1-.1-.2-.2-.2-.3V3.5c0-.1 0-.2.1-.3.1 0 .2-.1.3-.1"
            fill="none"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeMiterlimit={10}
            transform="matrix(.96898 0 0 .96898 .4 .85) matrix(1.03201 0 0 1.03201 -.4 -.85)"
        />
        <Path
            d="M2.9 23.5l.3-1.2c.3 0 .7 0 1.3-.1.5-.1 1-.1 1.3-.2.4-.1.7-.4 1-.6.2-.3.4-.6.5-1L11 4.3v-.6-.3c0-.5-.3-.8-.8-1.1C9.8 2 9 1.8 8 1.7L8.3.5h12.8l-.3 1.2c-.3 0-.8.1-1.3.2s-.9.2-1.2.3c-.4.1-.8.4-1 .7s-.4.6-.4 1L13.2 20c0 .2-.1.4-.1.5v.4c0 .5.3.9.8 1.1.5.2 1.3.4 2.3.5l-.3 1.2h-13z"
            fill="#fff"
        />
    </SVG>
);

export default SvgComponent;