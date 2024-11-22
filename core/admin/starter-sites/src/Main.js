import React from 'react';
import './Main.css';

import CloudLibrary from './library';

const Main = ({ type }) => {
    return (
        <div className='Main maxi-library-modal'>
            <CloudLibrary
                cloudType={type}
                url=''
                title='Starter sites'
                prefix=''
                cardId=''
            />
        </div>
    );
};

export default Main;
