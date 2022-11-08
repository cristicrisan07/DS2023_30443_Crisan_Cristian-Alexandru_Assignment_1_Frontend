import {Button, ButtonToolbar, Card, Col, Container, Row} from "react-bootstrap";

import React, {useEffect, useState} from "react";
import SingleSelect from "./SingleSelect";

    //DO NOT delete category==null even though it is a warning
export default function FoodMenu (props) {

    const[category,setCategory]=useState("All")
    const [availableCategories,setAvailableCategories]= useState([]);
    const [nbavailcat,setnbavailcat]=useState(-1);
    const getCategories = () =>{
        fetch("http://localhost:8081/oeupb/getFoodCategories")
            .then(async response => {
                const data = await response.json();
                //check for response
                if (!response.ok) {
                    //get error message from body or default to response statusText
                    if(data.length===0)  return Promise.reject("Could not fetch data about the food categories.");
                    else{
                        return Promise.reject("Some weird error.");
                    }
                }
                else{

                    setnbavailcat(data.length);
                    data.map(el => setAvailableCategories(availableCategories => [...availableCategories,el]));
                    setAvailableCategories(availableCategories => [...availableCategories,"All"])
                }


            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    useEffect(()=>{
        if(nbavailcat===-1){
            getCategories();
        }
    },[nbavailcat])

    useEffect(()=>{

            console.log(category);

    },[category])
    return (
        <>
        <Row className="mb-3">
            <Col sm={3}>
                <Button className="HomepageButton" disabled={true}> View only:</Button>
            </Col>
            <Col sm={3}>
                <SingleSelect parentFunction={setCategory} inputStrings={availableCategories}/>
            </Col>
        </Row>
            <br/>
        <Container style={{overflowY:"scroll",maxHeight:'400px',width:'520px'}}>

            <Row style={{width:'500px'}} md={3} className="g-4">
            {props.foodList.filter(el=> (category===null||category.label==="All"||el.category===category.label)).map(el => (
                <Col>

                    <Card className="cardA" style={{ width: '15rem' }}>

                        <Card.Body>{el.name}</Card.Body>
                        <Card.Footer>{el.category}</Card.Footer>
                    </Card>

                </Col>
            ))}
        </Row>
        </Container>
        </>
    )
}
