/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const sixColumns = (
  <SVG
    width="24"
    height="7"
    id="Layer_1"
    x="0px"
    y="0px"
    viewBox="0 0 112 36"
    xmlSpace="preserve"
  >
    <style>
      {
        ".st0{fill:none;stroke:#464a53;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"
      }
    </style>
    <Path className="st0" d="M98 1H112V35H98z" />
    <Path className="st0" d="M78.4 1H92.4V35H78.4z" />
    <Path className="st0" d="M58.8 1H72.8V35H58.8z" />
    <Path className="st0" d="M39.2 1H53.2V35H39.2z" />
    <Path className="st0" d="M0 1H14V35H0z" />
    <Path className="st0" d="M19.6 1H33.6V35H19.6z" />
  </SVG>
);

export default sixColumns;