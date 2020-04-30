/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const fiveColumns = (
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
    <Path className="st0" d="M93.1 1H112V35H93.1z" />
    <Path className="st0" d="M70.4 1H88.2V35H70.4z" />
    <Path className="st0" d="M0 1H18.7V35H0z" />
    <Path className="st0" d="M23.8 1H41.6V35H23.8z" />
    <Path className="st0" d="M47.1 1H64.9V35H47.1z" />
  </SVG>
);

export default fiveColumns;
