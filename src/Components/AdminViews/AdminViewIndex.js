import React, {useEffect, useState} from "react";
import {Tab, Tabs} from "react-bootstrap";
import SingleSelect from "../SingleSelect";
import ClientsCRUDView from "./CRUD/ClientsCRUDView";
import MeteringDevicesCRUDView from "./CRUD/MeteringDevicesCRUDView";


const AdminViewIndex = (props) => {
    const [showToast,setshowToast]=useState(false)
    const [messageForToast,setmessageForToast]=useState("");
    const [viewMenu,setViewMenu]=useState(false);

    useEffect(()=>{
        if(messageForToast!==""){
            setshowToast(true);
        }
    },[messageForToast])
        const [key, setKey] = useState('clients');
    return (

        <Tabs
            id="uncontrolled-tab-example"
            activeKey={key}
            transition={false}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            <Tab eventKey="clients" title="Clients">
                <ClientsCRUDView/>
            </Tab>
            <Tab eventKey="metering-devices" title="MeteringDevices">
                <MeteringDevicesCRUDView/>
            </Tab>

        </Tabs>


    );
};

export default AdminViewIndex;