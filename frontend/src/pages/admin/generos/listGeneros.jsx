import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../../components/AdminMenu";

const ListGeneros = () => {
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        getListGeneros();
        document.title = "Lista de Generos";
    }, []);

    const getListGeneros = async () => {
        axios.get("http://localhost:3000/genero")
            .then(res => {
                setGeneros(res.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const deleteGenero = async (id) => {
        const confirm = window.confirm("¿Estás seguro de querer eliminar este genero?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/genero/${id}`)
            .then(() => {
                getListGeneros();
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
                                <Card.Title>Lista de Generos</Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generos.map((genero) => (
                                            <tr key={genero.id}>
                                                <td>
                                                    <img src={`http://localhost:3000/genero/image/${genero.id}`} alt={genero.nombre} style={{ width: "50px" }} />
                                                </td>
                                                <td>{genero.nombre}</td>
                                                <td>
                                                    <Link to={`/admin/generos/formulario/${genero.id}`} className="btn btn-primary">Editar</Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => deleteGenero(genero.id)}>Eliminar</Button>
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

export default ListGeneros;
