import { Dot, Jugador, SnakeType } from "../types/types";

export const getRandomCoordinates = (snakeDots?: SnakeType) => {
    let min = 1;
    let max = 98;
    let x;
    let y;
    do {
        x = Math.floor((Math.random() * (max - min + 1) + min) / 4) * 4;
        y = Math.floor((Math.random() * (max - min + 1) + min) / 4) * 4;
    } while (invalidDot([x, y], snakeDots));
    return [x, y];
};

export const invalidDot = (dot: Dot, snakeDots?: SnakeType) => {
    snakeDots?.forEach(snakeDot => {
        if (dot[0] === snakeDot[0] && dot[1] === snakeDot[1]) {
            console.log(dot)
            return true;
        }
    });
    return false;
};

export const allDots = (jugadores?: Array<Jugador>) => {
    let allDots: Array<Dot> = [];
    jugadores?.forEach(jugador => {
        allDots = [...allDots, ...jugador.dots];
    });
    return allDots;
};

export const ordenarJugadores = (jugadoresDesordenados: Array<Jugador>) => {
    const jugadores = [...jugadoresDesordenados];
    jugadores.sort(function (a, b) {
        if (a.puntos > b.puntos) {
            return -1;
        }
        if (a.puntos < b.puntos) {
            return 1;
        }
        return 0;
    });
    return [...jugadores];
}