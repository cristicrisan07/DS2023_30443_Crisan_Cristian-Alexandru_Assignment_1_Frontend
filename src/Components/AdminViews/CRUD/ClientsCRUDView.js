import React,{useEffect, useState} from "react";
import SingleSelect from "../../SingleSelect";
import {Button, Col, Form, Row} from "react-bootstrap";
import validateAccountData from "../../Validators/AccountsFormValidator";
import {RegisterButton} from "../../LoginForm";

export default function ClientsCRUDView (props) {

    const [clients,setClients]=useState([]);
    const [selectedUsernameFromDropdown,setSelectedUsernameFromDropdown] = useState("");

    const [selectedClient,setSelectedClient]=useState(
        {
            username:"",
            password:"",
            email:"",
            firstName:"",
            lastName:""
        }
    );

    const [newPassword,setNewPassword] = useState("")
    const [newEmail,setNewEmail] = useState("")
    const [newFirstName,setNewFirstName] = useState("")
    const [newLastName,setNewLastName] = useState("")

    const [show, setShow] = useState(false);

    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");

    const initializeForm = () => {

        console.log(clients);

        let client = clients.find(client => client.username===selectedUsernameFromDropdown);
        setSelectedClient(client);

        setNewEmail(client.email);
        setNewLastName(client.lastName);
        setNewFirstName(client.firstName);
        setErrorMessageForLabel("");

    }

    const changesOccurredInFormData = () =>{
        return newPassword !== "" || newPassword !== selectedClient.password || newEmail !== selectedClient.email || newLastName !== selectedClient.lastName || newFirstName !== selectedClient.firstName;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let changesOccurredStatus = changesOccurredInFormData();
        if(changesOccurredStatus===true) {
            let passwordToCheck= newPassword;
            if(newPassword==="")
                passwordToCheck="valid password";
            let status = validateAccountData(selectedClient.username, passwordToCheck, newEmail, newFirstName, newLastName, false);
            if (status === "valid") {
                let d = {
                    username: selectedClient.username,
                    email: newEmail,
                    password: newPassword,
                    firstName: newFirstName,
                    lastName: newLastName,
                }
                let response = await fetch("http://localhost:8081/oeupb/updateClient", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(d)
                }).then(function (res) {
                    return res.text();
                }).then(function (res) {
                        console.log(res)
                        setErrorMessageForLabel(res);
                    }
                )
            } else {
                setErrorMessageForLabel(status);
            }
        }
        else{
            setErrorMessageForLabel("No changes.");
        }
    }

    const handleDelete = () =>{
        fetch("http://localhost:8081/oeupb/deleteClient/"+selectedClient.username,{
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        })
            .then(function (res) {
                return res.text();
            }).then(function (res) {
            setErrorMessageForLabel(res);
            setClients(clients.filter(client=>client.username!==selectedClient.username));
            setSelectedUsernameFromDropdown("");
            }
        )
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    const getClients = () =>{
        if(clients.length===0){
            fetch("http://localhost:8081/oeupb/getClients")
                .then(async response => {
                    const data = await response.json();
                    //check for response
                    if (!response.ok) {
                        //get error message from body or default to response statusText
                        if (data.name === "") return false;
                        else {
                            return Promise.reject("Some weird error.");
                        }
                    } else {
                        setClients(data);
                    }

                })
                .catch(error => {
                    console.error('There was an error!', error);
                })
        }
    }

    //don't move up
    //"Cannot invoke getClients before initialization" thrown.
    useEffect(getClients,[]);

    useEffect(()=>{
        if(selectedUsernameFromDropdown!=="") {
            initializeForm();
        }
        },[selectedUsernameFromDropdown])

    return (
        <>
            {   clients.length > 0 &&
                         <SingleSelect parentFunction={setSelectedUsernameFromDropdown} inputStrings={clients.map(el => el.username)}/>
            }
            <br/>
            {selectedUsernameFromDropdown!==""&&
                <Form>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                        <Col mb={2}>
                            <Form.Control type="email" placeholder="Email" value={newEmail}
                                          onChange={(e) => setNewEmail(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="New password" value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalFirstName">
                        <Col mb={2}>
                            <Form.Control type="firstname" placeholder="First_name" value={newFirstName}
                                          onChange={(e) => setNewFirstName(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalLastName">
                        <Col mb={2}>
                            <Form.Control type="lastname" placeholder="Last_name" value={newLastName}
                                          onChange={(e) => setNewLastName(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    {
                        errorMessageForLabel !== "" &&
                        <>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalLabel">

                                <Col mb={2}>
                                    <Form.Label className="HomepageLabel">{errorMessageForLabel}</Form.Label>
                                </Col>
                            </Form.Group>
                        </>
                    }
                    <Button className="HomepageButton right-margin-sm" onClick={(e) => handleSubmit(e)}>
                        Update
                    </Button>
                    <Button className="HomepageButton" onClick={(e) => handleDelete(e)}>
                        Delete
                    </Button>

                </Form>
            }
            <br/>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                <Col mb={2}>
            <RegisterButton isAdmin={false}/>
                </Col>
            </Form.Group>
        </>

    );
}