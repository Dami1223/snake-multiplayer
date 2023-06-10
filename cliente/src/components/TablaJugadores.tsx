import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { Jugador, TablaJugadoresProps } from '../types/types'
import { ordenarJugadores } from '../utils/utils';

const TablaJugadores = (props: TablaJugadoresProps) => {
    const [jugadores, setJugadores] = useState<Array<Jugador>>([]);

    useEffect(() => {
        setJugadores(ordenarJugadores(props.jugadores));
    }, [props.jugadores]);

    return (
        <Table >
            <thead>
                <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th>Puntos</th>
                </tr>
            </thead>
            <tbody>
                {jugadores.map((jugador, i) => (
                    <tr key={jugador.id} className={`tr-${jugador.color}`}>
                        <th>{i + 1}</th>
                        <th>{jugador.nombre}</th>
                        <th >{jugador.puntos}</th>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default TablaJugadores