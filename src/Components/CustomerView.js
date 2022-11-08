import React, {useEffect, useState} from "react";
import {Button, ButtonToolbar, Card, Col, Row} from "react-bootstrap";
import AddRestaurantModalWithButton from "./AddRestaurantModalWithButton";
import AddFoodButtonWithModal from "./AddFoodButtonWithModal";
import MyToast from "./MyToast";
import FoodMenu from "./FoodMenu";
import SingleSelect from "./SingleSelect";

const CustomerView = (props) => {
    const [viewMenu,setViewMenu]=useState(false);
    const [food,setFood]=useState([]);
    const [showToast,setshowToast]=useState(false);
    const [messageForToast,setmessageForToast]=useState("");
    const [restaurant,setRestaurant]=useState(null);
    const [availableRestaurants,setavailableRestaurants]=useState([]);
    const [nbavailres,setnbavailres]=useState(-1);
    const getRestaurants = () =>{
        fetch("http://localhost:8081/oeupb/getRestaurants")
            .then(async response => {
                const data = await response.json();
                //check for response
                if (!response.ok) {
                    //get error message from body or default to response statusText
                    if(data.length===0)  return Promise.reject("Could not fetch data about the restaurants.");
                    else{
                        return Promise.reject("Some weird error.");
                    }
                }
                else{

                    setnbavailres(data.length);
                    console.log(data);
                    data.map(el => setavailableRestaurants(availableRestaurants => [...availableRestaurants,el.name]));
                }


            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }
    useEffect(()=>{
        if(messageForToast!==""){
            setshowToast(true);
        }
    },[messageForToast])
    const getFood = () =>{
        console.log("restaurant name: "+ restaurant.label);
        fetch("http://localhost:8081/oeupb/getFood/" + restaurant.label)
            .then(async response => {
                const data = await response.json();
                //check for response
                if (!response.ok) {
                    //get error message from body or default to response statusText
                    if(data.length===1&&data[0].name==="")  {
                        setmessageForToast("This restaurant hasn't added any dishes yet.");
                        setViewMenu(false);
                        return Promise.reject("Could not fetch data about the food.");
                    }
                    else{
                        return Promise.reject("Some weird error.");
                    }
                }
                else{
                    setFood(data);
                }


            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }
    useEffect(()=>{
        if(nbavailres===-1){
            getRestaurants();
        }
    },[nbavailres])
    useEffect(()=>{
        console.log(restaurant);
        if(restaurant!==null){
            getFood();
            }
    },[restaurant])
    useEffect(()=>{
        if(food.length>0){
            setViewMenu(true);
        }
    },[food])
    return (
        <>
            <Row>

                <Col>
                    <Card body className="cardA" style={{ width: '30rem' }}>
                        welcome {props.username} .
                    </Card>
                </Col>

                <Col md={7} className="mb-2">
                    {
                        showToast&&
                        <MyToast messageToShow={messageForToast}/>
                    }
                </Col>
            </Row>
            <br/>
            <Row>
                <Col sm={3}>
                    <Button className="HomepageButton" disabled={true}> Select restaurant:</Button>
                </Col>
                <Col sm={3}>
                    <SingleSelect parentFunction={setRestaurant} inputStrings={availableRestaurants}/>
                </Col>
            </Row>
            <br/>
                {
                    viewMenu&&
                    <FoodMenu foodList={food}/>
                }

        </>
    );
};

export default CustomerView;