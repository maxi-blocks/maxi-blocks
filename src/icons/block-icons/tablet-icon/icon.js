import * as React from "react";

function TabletIcon(props) {
  return (
    <svg width="30px" height="30px" {...props}>
      <path
        fill="#0F121B"
        paintOrder="stroke fill markers"
        fillRule="evenodd"
        d="M16.51 1.889H3.255c-1.203 0-2.18.982-2.18 2.19v19.827c0 1.208.977 2.19 2.18 2.19H16.51c1.202 0 2.18-.982 2.18-2.19V4.079c0-1.208-.978-2.19-2.18-2.19zm0 23.494H3.255c-.81 0-1.47-.663-1.47-1.477V4.079c0-.814.66-1.477 1.47-1.477H16.51c.81 0 1.47.663 1.47 1.477v18.757H4.467a.356.356 0 000 .713H17.98v.357c0 .814-.66 1.477-1.47 1.477zM3.26 22.836h-.126a.356.356 0 000 .713h.125a.356.356 0 000-.713zm6.622 1.053a.577.577 0 000 1.154.577.577 0 000-1.154zm0 .713a.136.136 0 010-.272.136.136 0 010 .272zM8.515 4.007h2.734a.356.356 0 000-.713H8.515a.356.356 0 000 .713z"
      />
    </svg>
  )
}

export default TabletIcon;