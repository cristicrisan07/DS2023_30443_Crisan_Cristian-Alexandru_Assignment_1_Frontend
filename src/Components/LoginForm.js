import React, {Component, useState} from "react";
import {Button, ButtonToolbar, Col, Container, Form, Modal, Row} from "react-bootstrap";
import AccountsFormValidator from "./Validators/AccountsFormValidator";
import validateAccountData from "./Validators/AccountsFormValidator";

class LoggingButton extends Component {
    // This syntax ensures `this` is bound within handleClick.
    // Warning: this is *experimental* syntax.
    constructor(props) {
        super(props);
        this.state={
            request: "http://localhost:8081/oeupb/loginManager/"
        }

    }
    validateLoginData = (props) =>{
        if (this.props.username==="") {
            props.parentFunction("You must provide a username.");

            return false;
        }
        if (this.props.password==="") {
            props.parentFunction("You must provide a password.");
            return false;
        }
        return true;
    }
    fetchRequest = () => {
        //GET request using fetch with error handling
        fetch(this.state.request
            + this.props.username + "/" + this.props.password)
            .then(async response => {
                const data = await response.json();
                //check for response
                if (!response.ok) {
                    //get error message from body or default to response statusText
                    if(data.username==="")  return Promise.reject("Wrong credentials.");
                    else{
                        return Promise.reject("Some weird error.");
                    }
                }
                else{
                    this.props.login(true);

                    console.log(data.username + " " + data.email);
                }

            })
            .catch(error => {

                this.props.parentFunction(error.toString());
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);

            })
    }
    handleClick = () => {
        if (this.validateLoginData(this.props)) {
            if(!this.props.checked) {
                console.log(this.props.username + " " + this.props.password + " " + this.state.request)
                this.setState({request:"http://localhost:8081/oeupb/loginClient/"},this.fetchRequest)
            }
            else{
                this.setState({request:"http://localhost:8081/oeupb/loginManager/"},this.fetchRequest)
            }

        }
    }


    render() {
        return (
            <Button className="HomepageButton" onClick={this.handleClick}>
                Sign in
            </Button>
        );
    }
}


export function RegisterButton(props) {
    const [show, setShow] = useState(false);
    const [isChecked, setChecked] = useState(props.isAdmin);
    const handleChecked = () => {setChecked(!isChecked);seterrorMessageForLabel("")}
    const initializeModal = () => {
        setChecked(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("")
    }
    const handleClose = () => {setShow(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("")
    }
    const handleShow = () => {setShow(true);seterrorMessageForLabel("")}
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [firstname,setFirstName] = useState("")
    const [lastname,setLastName] = useState("")
    const [errorMessageForLabel,seterrorMessageForLabel]=useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()
        let status=validateAccountData(username,password,email,firstname,lastname,isChecked);
        if (status==="valid") {
            if(isChecked){
                let d = {
                    username: username,
                    email: email,
                    password: password
                }
                let response = await fetch("http://localhost:8081/oeupb/addManager", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(d)
                }).then(function (res) {
                    return res.text();
                }).then(function (da) {
                    console.log(da);
                    if(da!=="The account has been successfully created."){
                        seterrorMessageForLabel(da);
                    }
                    else{
                        handleClose();
                    }
                })

            }
            else{
                let d = {
                    username: username,
                    email: email,
                    password: password,
                    firstName: firstname,
                    lastName: lastname
                }
                let response = await fetch("http://localhost:8081/oeupb/addClient", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(d)
                }).then(function (res) {
                    return res.text();
                }).then(function (da) {
                    console.log(da)
                    if(da!=="The account has been successfully created."){
                        seterrorMessageForLabel(da);
                    }
                    else{
                            handleClose();}
                })

            }
        }
        else{
            seterrorMessageForLabel(status);
        }
    }

    return (
        <>
            <Button className="HomepageButton" onClick={handleShow}>
                Register
            </Button>


            <Modal className="ModalStyle" style={{opacity:1}} show={show} onShow={initializeModal} onHide={handleClose}
                   {...props}
                   size="sm"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>One account.<br></br>Endless possibilities.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Administrator account" onClick={handleChecked} className="HomepageLabel"/>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalUsername">

                                <Col sm={2}>
                                    <Form.Control type="username" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">

                                <Col sm={2}>
                                    <Form.Control type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword" >

                                <Col sm={2}>
                                    <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                                </Col>
                            </Form.Group>
                            {isChecked===false&&
                                <>
                                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalFirstName">

                                        <Col sm={2}>
                                            <Form.Control type="firstname" placeholder="First_name" onChange={(e)=>setFirstName(e.target.value)}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalLastName">

                                        <Col sm={2}>
                                            <Form.Control type="lastname" placeholder="Last_name" onChange={(e)=>setLastName(e.target.value)}/>
                                        </Col>
                                    </Form.Group>
                                </>
                            }
                            {
                                errorMessageForLabel!==""&&
                                <>
                                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalLabel">

                                        <Col sm={2}>
                                            <Form.Label>{errorMessageForLabel}</Form.Label>
                                        </Col>
                                    </Form.Group>
                                </>

                            }
                            <Button className="HomepageButton" onClick={(e) => handleSubmit(e)}>
                                Submit
                            </Button>
                        </Form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

        </>
    );
}
const LoginForm = (props) => {

    const [labelMessage,setlabelMessage]=useState("");
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [isChecked,setChecked]=useState(false);
    const handleChecked = () => {setChecked(!isChecked);setlabelMessage("")}
    const login = () =>{
        props.login(true);
        props.setLoggedInIdentity(username);
        isChecked ? props.isAdmin(true) : props.isAdmin(false)
    }
    return (
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalUsername">

                <Col sm={2}>
                    <Form.Control type="username" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                </Col>
                <Form.Group as={Col} className="lg-3" controlId="formCheckBox">
                    <Col sm={4}>
                        <Form.Check type="checkbox" label="Administrator account" onChange={handleChecked} className="HomepageLabel"/>
                    </Col>
                </Form.Group>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">

                <Col sm={2}>
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col sm={2}>
                    <ButtonToolbar>
                        <LoggingButton username={username} password={password}  parentFunction={setlabelMessage} checked={isChecked} login={login}/>
                        <RegisterButton isAdmin={true}/>
                    </ButtonToolbar>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formLabel">

                <Col sm={2}>
                    <Form.Label className={"HomepageLabel"}>{labelMessage}</Form.Label>
                </Col>
            </Form.Group>
        </Form>
    );
};

export default LoginForm;