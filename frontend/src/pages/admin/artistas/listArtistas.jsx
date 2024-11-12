import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../../components/AdminMenu";

const ListArtistas = () => {
    const [artistas, setArtistas] = useState([]);

    useEffect(() => {
        getListArtistas();
        document.title = "Lista de Artistas";
    }, []);

    const getListArtistas = async () => {
        axios.get("http://localhost:3000/artista")
            .then(res => {
                setArtistas(res.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const deleteArtista = async (id) => {
        const confirm = window.confirm("¿Estás seguro de querer eliminar este artista?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/artista/${id}`)
            .then(() => {
                getListArtistas();
            })
            .catch(error => {
                console.error(error);
            });
    }
    return ( 
        <>
            <NavAdminMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Lista de Artistas</Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre</th>
                                            <th>Oyentes</th>
                                            <th>Genero</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {artistas.map((artista) => (
                                            <tr key={artista.id}>
                                                <td>
                                                    <img src={`http://localhost:3000/artista/image/${artista.id}`} alt={artista.nombre} style={{width: "50px"}} />
                                                </td>
                                                <td>{artista.nombre}</td>
                                                <td>{artista.oyentes}</td>
                                                <td>{artista.genero.nombre}</td>
                                                <td>
                                                    <Link to={`/admin/artistas/formulario/${artista.id}`} className="btn btn-primary">Editar</Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => deleteArtista(artista.id)}>Eliminar</Button>
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
 
export default ListArtistas;