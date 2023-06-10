import React from "react";
import { Dot, SnakeProps } from "../types/types";

const Snake = (props: SnakeProps) => {
    return (
        <div>
            {props.snakeDots.map((dot: Dot, i) => {
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`
                };
                return (
                    <div className={`snake-dot-${props.color}`} key={i} style={style}></div>
                )
            })}
        </div>
    )
}

export default Snake;