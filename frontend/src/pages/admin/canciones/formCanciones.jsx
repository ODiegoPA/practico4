import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form } from "react-bootstrap";
import NavAdminMenu from '../../../components/AdminMenu';

const FormCanciones = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const initialAlbumId = searchParams.get("albumId") || "";
    const [nombre, setNombre] = useState("");
    const [albumId, setAlbumId] = useState(initialAlbumId);
    const [listaAlbumes, setListaAlbumes] = useState([]);
    const [file, setFile] = useState("");

    const onChangeAudio = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        if (id) {
            getCancionesById();
        }
        document.title = "Formulario de Canciones";
        getListaAlbumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getCancionesById = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/cancion/${id}`);
            setNombre(res.data.nombre);
            setAlbumId(res.data.albumId);
        } catch (error) {
            console.error(error);
        }
    };

    const getListaAlbumes = async () => {
        try {
            const res = await axios.get("http://localhost:3000/album");
            setListaAlbumes(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const guardarCancion = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("albumId", albumId);
    
        if (file) {
            formData.append("file", file);
        }
    
        if (id){
            axios.put(`http://localhost:3000/cancion/${id}`, formData)
                .then(() => {
                    navigate("/admin/canciones", { state: { updated: true } }); // Pasar el estado de actualización
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.post("http://localhost:3000/cancion", formData)
                .then(() => {
                    navigate("/admin/canciones");
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Formulario de Canciones</Card.Title>
                                <Form onSubmit={guardarCancion}>
                                    <Form.Group controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group controlId="albumId">
                                        <Form.Label>Album</Form.Label>
                                        <Form.Control as="select" value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
                                            <option value="">Selecciona un album</option>
                                            {listaAlbumes.map((album) => (
                                                <option key={album.id} value={album.id}>{album.nombre}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="file">
                                        <Form.Label>Audio (Formato mp3)</Form.Label>
                                        <Form.Control type="file" accept=".mp3" onChange={onChangeAudio} />
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

export default FormCanciones;
