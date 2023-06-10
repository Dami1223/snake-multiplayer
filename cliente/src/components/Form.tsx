import { Button, Container, Form, Stack } from "react-bootstrap";
import React from 'react'
import { FormProps } from "../types/types";

const FormComponent = (props: FormProps) => {

    const onChangeNombre = (event: any) => {
        props.setJugador({ ...props.jugador, nombre: event.target.value })
    };

    const onChangeColor = (event: any) => {
        props.setJugador({ ...props.jugador, color: event.target.value })
    };

    return (
        <Container className='containerForm' fluid >
            <Form onSubmit={props.onSubmit}>
                <Stack gap={4}>
                    <Form.Group className="mb-3" >
                        <Form.Label>Ingrasa Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Nombre" onChange={e => onChangeNombre(e)} value={props.jugador.nombre} />
                    </Form.Group>
                    <Form.Select aria-label="Default select example" value={props.jugador.color} onChange={e => onChangeColor(e)}>
                        <option value="red">Rojo</option>
                        <option value="green">Verde</option>
                        <option value="aqua">Agua</option>
                        <option value="black">Negro</option>
                        <option value="pink">Rosa</option>
                        <option value="orange">Naranja</option>
                        <option value="gray">Gris</option>
                        <option value="yellow">Amarillo</option>
                        <option value="brown">Marron</option>
                        <option value="blueviolet">Violeta</option>
                        <option value="turquoise">Turquesa</option>
                        <option value="skyblue">Celeste</option>
                    </Form.Select>
                    <Button variant="primary" type="submit">
                        Jugar
                    </Button>
                </Stack>
            </Form>
        </Container>
    )
};

export default FormComponent;
