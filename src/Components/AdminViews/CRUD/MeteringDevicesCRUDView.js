import React, {useEffect, useState} from "react";
import SingleSelect from "../../SingleSelect";
import {Button, Col, Form, Row} from "react-bootstrap";
import validateAccountData from "../../Validators/AccountsFormValidator";
import {RegisterButton} from "../../LoginForm";
import AddMeteringDeviceButton from "../../AddMeteringDeviceButton";

export default function MeteringDevicesCRUDView(props){

    const [meteringDevices,setMeteringDevices]=useState([]);
    const [selectedMeteringDeviceFromDropdown,setSelectedMeteringDeviceFromDropdown] = useState("");

    const [selectedMeteringDevice,setSelectedMeteringDevice] = useState(
        {
            id:"",
            description:"",
            address:"",
            max_hour_energy_cons:"",
            clientUsername:""
        }
    )

    const [newDescription,setNewDescription] = useState("")
    const [newAddress,setNewAddress] = useState("")
    const [newmax_hour_energy_cons,setNewmax_hour_energy_cons] = useState("")
    const [newClient,setNewClient] = useState("")

    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");

    const initializeForm = () => {

        console.log(meteringDevices);

        let meteringDevice = meteringDevices.find(meteringDevice => meteringDevice.description===selectedMeteringDeviceFromDropdown);
        console.log(selectedMeteringDeviceFromDropdown);
        setSelectedMeteringDevice(meteringDevice);

        setNewDescription(meteringDevice.description);
        setNewAddress(meteringDevice.address);
        setNewmax_hour_energy_cons(meteringDevice.max_hour_energy_cons);
        setNewClient(meteringDevice.clientUsername);
        setErrorMessageForLabel("");

    }

    const changesOccurredInFormData = () =>{
        return newDescription !== selectedMeteringDevice.description ||
            newAddress !== selectedMeteringDevice.address ||
            newmax_hour_energy_cons !== selectedMeteringDevice.max_hour_energy_cons ||
            newClient !== selectedMeteringDevice.clientUsername;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let changesOccurredStatus = changesOccurredInFormData();
        console.log(newClient);
        if(changesOccurredStatus===true) {
            let d = {
                id: selectedMeteringDevice.id,
                description:newDescription,
                address:newAddress,
                max_hour_energy_cons:newmax_hour_energy_cons,
                clientUsername:newClient
            }
            let response = await fetch("http://localhost:8081/oeupb/updateMeteringDevice", {
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
            })
        }
        else{
            setErrorMessageForLabel("No changes.");
        }
    }

    const handleDelete = () =>{
        fetch("http://localhost:8081/oeupb/deleteMeteringDevice/"+selectedMeteringDevice.id,{
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
                setMeteringDevices(meteringDevices.filter(meteringDevice=>meteringDevice.id!==meteringDevice.id));
                setSelectedMeteringDeviceFromDropdown("");
            }
        )
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    const getDevices = () =>{
        if(meteringDevices.length===0) {
            fetch("http://localhost:8081/oeupb/getMeteringDevices")
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
                        setMeteringDevices(data);
                    }

                })
                .catch(error => {
                    console.error('There was an error!', error);
                })
        }
    }

    useEffect(getDevices,[]);

    useEffect(()=>{
        if(selectedMeteringDeviceFromDropdown!=="") {
            initializeForm();
        }
    },[selectedMeteringDeviceFromDropdown])

    return (
        <>
            {meteringDevices.length>0 &&
                <SingleSelect parentFunction={setSelectedMeteringDeviceFromDropdown} inputStrings={meteringDevices.map(el => el.description)}/>
            }
            <br/>
            {selectedMeteringDeviceFromDropdown!==""&&
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalDescription">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="Description" value={newDescription}
                                          onChange={(e) => setNewDescription(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalAddress">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="New address" value={newAddress}
                                          onChange={(e) => setNewAddress(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalmax_hour_energy_cons">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="Maximum hourly energy consumption" value={newmax_hour_energy_cons}
                                          onChange={(e) => setNewmax_hour_energy_cons(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalClient">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="Client" value={newClient}
                                          onChange={(e) => setNewClient(e.target.value)}/>
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
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalAdd">
                <Col mb={2}>
                    <AddMeteringDeviceButton/>
                </Col>
            </Form.Group>
        </>
    );
}