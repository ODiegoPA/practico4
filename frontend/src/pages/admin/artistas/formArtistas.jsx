import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form } from "react-bootstrap";
import NavAdminMenu from '../../../components/AdminMenu';

const FormArtistas = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [oyentes, setOyentes] = useState("");
    const [generoId, setGeneroId] = useState("");
    const [file, setFile] = useState("");
    const [listaGeneros, setListaGeneros] = useState([]);

    const onChangePhoto = (e) => {
        setFile(e.target.files[0]);
    }

    useEffect(() => {
        if (id) {
            getArtistaById();
        }
        document.title = "Formulario de Artistas";
        getListaGeneros();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getArtistaById = async () => {
        axios.get(`http://localhost:3000/artista/${id}`)
            .then(res => {
                setNombre(res.data.nombre);
                setOyentes(res.data.oyentes);
                setGeneroId(res.data.generoId);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const getListaGeneros = async () => {
        axios.get("http://localhost:3000/genero")
            .then(res => {
                setListaGeneros(res.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const guardarArtista = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("oyentes", oyentes);
        formData.append("generoId", generoId);
        if (file) {
            formData.append("file", file);
        }
        if (id) {
            axios.put(`http://localhost:3000/artista/${id}`, formData)
                .then(() => {
                    navigate("/admin/artistas");
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.post("http://localhost:3000/artista", formData)
                .then(() => {
                    navigate("/admin/artistas");
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
                                <Card.Title>Formulario de Artistas</Card.Title>
                                <Form onSubmit={guardarArtista}>
                                    <Form.Group className="mb-3" controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control required type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="oyentes">
                                        <Form.Label>Oyentes</Form.Label>
                                        <Form.Control required type="number" placeholder="Oyentes" value={oyentes} onChange={(e) => setOyentes(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="generoId">
                                        <Form.Label>Genero</Form.Label>
                                        <Form.Select required value={generoId} onChange={(e) => setGeneroId(e.target.value)}>
                                            <option value="">Selecciona un genero</option>
                                            {listaGeneros.map((genero) => (
                                                <option key={genero.id} value={genero.id}>{genero.nombre}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="file">
                                        <Form.Label>Foto</Form.Label>
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
 
export default FormArtistas;