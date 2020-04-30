/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const fourColumns = (
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
    <Path className="st0" d="M88 1H112V35H88z" />
    <Path className="st0" d="M0 1H24V35H0z" />
    <Path className="st0" d="M29.3 1H53.3V35H29.3z" />
    <Path className="st0" d="M58.7 1H82.7V35H58.7z" />
  </SVG>
);

export default fourColumns;
