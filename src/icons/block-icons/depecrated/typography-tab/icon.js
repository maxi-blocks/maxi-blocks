import * as React from 'react';

const { __ } = wp.i18n;

function GxTypographyTab(props) {
    return (
        <svg
            width='1.29rem'
            height='22px'
            data-name='Layer 1'
            viewBox='0 0 22.45 21.2'
            {...props}
        >
            <title>typography</title>
            <path
                d='M1 1v5.4h3.2V5a.81.81 0 01.3-.65.81.81 0 01.65-.3H9.3V15.8A1.37 1.37 0 018 17.15H6.6v3.05h9.25v-3.05h-1.3a1.37 1.37 0 01-1.35-1.35V4.05h4.15a.91.91 0 01.65.3.87.87 0 01.25.65v1.4h3.2V1z'
                stroke='#4d525e'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                fill='none'
            />
            <path fill='none' d='M0 0h22.45v21.2H0z' />
        </svg>
    );
}

export default GxTypographyTab;
