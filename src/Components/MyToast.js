import {useState} from "react";
import {Col, Row, Toast} from "react-bootstrap";

export default function MyToast(props) {
    const [showA, setShowA] = useState(true);
    const toggleShowA = () => setShowA(!showA);

    return (
        <Row>
            <Col md={6} className="mb-2">
                <Toast show={showA} onClose={toggleShowA} animation={false} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Success.</strong>
                        <small>1 sec ago</small>
                    </Toast.Header>
                    <Toast.Body>{props.messageToShow}</Toast.Body>
                </Toast>
            </Col>

        </Row>
    );
}