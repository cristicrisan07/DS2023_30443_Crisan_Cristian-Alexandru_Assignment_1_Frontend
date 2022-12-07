import logo from './znet.jpg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from "react-bootstrap";
import LoginForm from "./Components/LoginForm";
import React, {useState} from "react";
import AdminViewIndex from "./Components/AdminViews/AdminViewIndex";
import CustomerView from "./Components/CustomerView";


function App() {

  const[isLoggedIn,setLogin]=useState(false)
  const[isAdmin,setAdmin]=useState(false)
  const[username,setUsername]=useState("")


  return (
    <div className="App" >
        <header className="App-header">
            <link rel="stylesheet" href={"https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"}/>
            <script src={"https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"}/>
            <script src={"https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"}/>

            <img src={logo} className="App-logo" alt="logo" />
        </header>

        <body className={!isLoggedIn ? "App-body-for-login" : "App-body-for-user-view"}>
        <Container>
            {!isLoggedIn &&
                <LoginForm login={setLogin} isAdmin={setAdmin} setLoggedInIdentity={setUsername}/>
            }

            {isAdmin && isLoggedIn &&
                <AdminViewIndex username={username}/>
            }
            {!isAdmin && isLoggedIn &&
                <CustomerView username={username}/>
            }

        </Container>
        </body>
    </div>
  );
}

export default App;
