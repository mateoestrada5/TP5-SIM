import React from 'react';
import { TbReload } from "react-icons/tb";

const ReloadButton = ({setSimulationData}) => {
    const handleReload = () => {
        setSimulationData([]);
    };

    return (
        <button
            className="p-3 bg-zinc-700 text-white rounded-full text-xl hover:bg-zinc-600 transition cursor-pointer hover:rotate-360 duration-400 ease-in-out"
            onClick={handleReload}
        >
            <TbReload />
        </button>

    );
};

export default ReloadButton;