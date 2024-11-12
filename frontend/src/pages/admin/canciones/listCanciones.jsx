import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import NavAdminMenu from "../../../components/AdminMenu";

const ListCanciones = () => {
    const [canciones, setCanciones] = useState([]);
    const location = useLocation();

    useEffect(() => {
        getListCanciones();
        document.title = "Lista de Canciones";
    }, []);

    useEffect(() => {
        // Verificar si el estado `updated` está presente en la ubicación
        if (location.state && location.state.updated) {
            getListCanciones();
        }
    }, [location.state]);

    const getListCanciones = async () => {
        try {
            const res = await axios.get("http://localhost:3000/cancion");
            setCanciones(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCancion = async (id) => {
        const confirm = window.confirm("¿Estás seguro de querer eliminar esta canción?");
        if (!confirm) {
            return;
        }
        try {
            await axios.delete(`http://localhost:3000/cancion/${id}`);
            getListCanciones();
        } catch (error) {
            console.error(error);
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
                                <Card.Title>Lista de Canciones</Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre</th>
                                            <th>Álbum</th>
                                            <th>Canción</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {canciones.map((cancion) => (
                                            <tr key={cancion.id}>
                                                <td>
                                                    <img 
                                                        src={`http://localhost:3000/album/image/${cancion.albumId}`} 
                                                        alt={cancion.album.nombre} 
                                                        style={{ width: "50px" }} 
                                                    />
                                                </td>
                                                <td>{cancion.nombre}</td>
                                                <td>{cancion.album.nombre}</td>
                                                <td>
                                                    <audio controls>
                                                        <source 
                                                            src={`http://localhost:3000/cancion/audio/${cancion.id}`} 
                                                            type="audio/mpeg" 
                                                        />
                                                    </audio>
                                                </td>
                                                <td>
                                                    <Link 
                                                        to={`/admin/canciones/formulario/${cancion.id}`}
                                                        className="btn btn-primary"
                                                    >
                                                        Editar
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="danger" 
                                                        onClick={() => deleteCancion(cancion.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListCanciones;
