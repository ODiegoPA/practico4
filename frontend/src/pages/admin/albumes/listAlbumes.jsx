import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../../components/AdminMenu";
import '../background.css'

const ListAlbumes = () => {
    const [albumes, setAlbumes] = useState([]);

    useEffect(() => {
        getListAlbumes();
        document.title = "Lista de Albumes";
    }, []);

    const getListAlbumes = async () => {
        axios.get("http://localhost:3000/album")
            .then(res => {
                setAlbumes(res.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const deleteAlbum = async (id) => {
        const confirm = window.confirm("¿Estás seguro de querer eliminar este album?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/album/${id}`)
            .then(() => {
                getListAlbumes();
            })
            .catch(error => {
                console.error(error);
            });
    };
    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Lista de Albumes</Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre</th>
                                            <th>Ano</th>
                                            <th>Artista</th>
                                            <th>Anadir Cancion</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {albumes.map((album) => (
                                            <tr key={album.id}>
                                                <td>
                                                    <img src={`http://localhost:3000/album/image/${album.id}`} alt={album.name} style={{ width: "50px" }} />
                                                </td>
                                                <td>{album.nombre}</td>
                                                <td>{album.ano}</td>
                                                <td>{album.artista.nombre}</td>
                                                <td>
                                                    <Link to={`/admin/canciones/formulario?albumId=${album.id}`} className="btn btn-success">Anadir Cancion</Link>
                                                </td>
                                                <td>
                                                    <Link to={`/admin/albumes/formulario/${album.id}`} className="btn btn-primary">Editar</Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => deleteAlbum(album.id)}>Eliminar</Button>
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
}
export default ListAlbumes;