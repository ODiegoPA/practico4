import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import NavMainMenu from "../../components/MainMenu";
import "./genero.css";

const MainGeneros = () => {
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        loadGeneros();
        document.title = "Spotify";
    }, []);

    const loadGeneros = async () => {
        axios.get("http://localhost:3000/genero")
        .then((response) => {
            setGeneros(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (
        <>
            <NavMainMenu />
            <Container className="container-custom mt-3">
                <Row>
                    {generos.map((genero) => (
                        <Col key={genero.id} md={4} sm={6} xs={12} className="mb-3">
                            <Link to={`/spotify/genero/${genero.id}`} className="text-decoration-none">
                                <div className="genre-card">
                                    <Image 
                                        src={`http://localhost:3000/genero/image/${genero.id}`} 
                                        alt={genero.nombre} 
                                        fluid 
                                        className="genre-image"
                                    />
                                    <h5 className="genre-name">{genero.nombre}</h5>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default MainGeneros;
