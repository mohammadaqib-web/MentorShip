import React from 'react';

function Loader() {
    return (
        <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">...</span>
        </div>
    );
}

export default Loader;