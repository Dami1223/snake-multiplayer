import { FormEventHandler } from "react";

export type FoodProps = {
    dot: Dot;
};

export type SnakeProps = {
    snakeDots: SnakeType;
    color: string;
};

export type Dot = Array<number>;

export type SnakeType = Array<Dot>;

export type AxisEnum = '' | 'Y' | 'X';
export type DirectionEnum = '' | 'UP' | 'DOWN' | 'RIGHT' | 'LEFT';

export type BoardProps = {
    addScore: Function;
    jugador: Jugador;
    jugadores: Array<Jugador>;
};

export type ChatProps = {
    jugador: Jugador;
};

export type SocketMensaje = {
    nombre: string;
    mensaje: string;
};

export type FormProps = {
    onSubmit: FormEventHandler<HTMLFormElement>;
    jugador: Jugador;
    setJugador: Function;
};

export type Jugador = {
    nombre: string;
    color: string;
    puntos: number;
    id?: string;
    dots: Array<Array<number>>;
};

export type TablaJugadoresProps = {
    jugadores: Array<Jugador>;
};