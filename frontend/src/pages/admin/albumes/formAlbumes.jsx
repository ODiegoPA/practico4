import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form } from "react-bootstrap";
import NavAdminMenu from '../../../components/AdminMenu';

const FormAlbumes = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [ano, setAno] = useState("");
    const [artistaId, setArtistaId] = useState("");
    const [listaArtistas, setListaArtistas] = useState([]);
    const [file, setFile] = useState("");


    const onChangePhoto = (e) => {
        setFile(e.target.files[0]);
    };
    
    useEffect(() => {
        if (id) {
            getAlbumesById();
        }
        document.title = "Formulario de Albumes";
        getListaArtistas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getAlbumesById = async () => {
        axios.get(`http://localhost:3000/album/${id}`)
            .then(res => {
                setNombre(res.data.nombre);
                setAno(res.data.ano);
                setArtistaId(res.data.artistaId);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getListaArtistas = async () => {
        axios.get("http://localhost:3000/artista")
            .then(res => {
                setListaArtistas(res.data);
            })
            .catch(error => {
                console.error(error);
            });
    };
    const guardarAlbum = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("ano", ano);
        formData.append("artistaId", artistaId);

        if (file) {
            formData.append("file", file);
        }
        if (id) {
            axios.put(`http://localhost:3000/album/${id}`, formData)
                .then(() => {
                    navigate("/admin/albumes");
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.post("http://localhost:3000/album", formData)
                .then(() => {
                    navigate("/admin/albumes");
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
    return ( 
        <>
            <NavAdminMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Formulario de Albumes</Card.Title>
                                <Form onSubmit={guardarAlbum}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Año</Form.Label>
                                        <Form.Control type="text" placeholder="Año" value={ano} onChange={(e) => setAno(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Artista</Form.Label>
                                        <Form.Select value={artistaId} onChange={(e) => setArtistaId(e.target.value)}>
                                            <option>Selecciona un artista</option>
                                            {listaArtistas.map((artista) => (
                                                <option key={artista.id} value={artista.id}>{artista.nombre}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
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
export default FormAlbumes;