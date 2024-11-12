import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form } from "react-bootstrap";
import NavAdminMenu from '../../../components/AdminMenu';

const FormGeneros = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [file, setFile] = useState("");

    const onChangePhoto = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        if (!id) return;
        getGeneroById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getGeneroById = async () => {
        axios.get(`http://localhost:3000/genero/${id}`)
            .then(res => {
                setNombre(res.data.nombre);
            })
            .catch(error => {
                console.error(error);
            });
    };
    const guardarGenero = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", nombre);
        if (file) {
            formData.append("file", file);
        }
        if (id) {
            axios.put(`http://localhost:3000/genero/${id}`, formData)
                .then(() => {
                    navigate("/admin/generos");
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.post("http://localhost:3000/genero", formData)
                .then(() => {
                    navigate("/admin/generos");
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Formulario de Generos</Card.Title>
                                <Form onSubmit={guardarGenero}>
                                    <Form.Group className="mb-3" controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control required type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="imagen">
                                        <Form.Label>Imagen</Form.Label>
                                        <Form.Control type="file" onChange={onChangePhoto} />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Guardar
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FormGeneros;