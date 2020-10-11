import React from 'react';

const Button = ({ label = null, children = null, disabled = false, onClick = () => { } }) => {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 
            text-white font-bold py-2 px-4 border 
            border-blue-700 rounded"
            onClick={onClick}
            disabled={disabled}
        >
            {label || children}
        </button>
    );
};

export default Button;