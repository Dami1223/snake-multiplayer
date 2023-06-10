import React from 'react';
import { FoodProps } from '../types/types';

const Food = (props: FoodProps) => {
    const style = {
        left: `${props.dot[0]}%`,
        top: `${props.dot[1]}%`
    };
    return (
        <div className='snake-food' style={style}></div>
    );
};

export default Food;