import React from 'react';
import Goku from '@assets/goku.gif';
import './Loader.css';

export const Loader = (): React.JSX.Element => {
    return (
        <React.Fragment>
            <div className="loader__image-container">
                <img src={Goku} className="loader__image" alt="loading image" />
                <span>Loading</span>
            </div>
        </React.Fragment>
    );
}
