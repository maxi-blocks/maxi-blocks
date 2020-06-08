/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarDropShadow = (
    <SVG
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 24 24"
        xmlSpace="preserve"
    >
        <style>{".st0{fill:#fff}"}</style>
        <Path
            className="st0"
            d="M8.8 18.8c.3.3.7.4 1 .4s.7-.1 1-.4l9-9L10.3.3 8.4 2.4 9.9 4l-7 7c-.6.6-.6 1.5 0 2.1.1-.1 5.9 5.7 5.9 5.7zM12 6.1l3.8 3.8-2.2 2.1H6.1L12 6.1zM20 19.3c1.2 0 2.2-1 2.2-2.2S20 13.5 20 13.5s-2.2 2.4-2.2 3.6 1 2.2 2.2 2.2zM1.8 20.7h20.4v2.9H1.8v-2.9z"
        />
    </SVG>
);

export default toolbarDropShadow;