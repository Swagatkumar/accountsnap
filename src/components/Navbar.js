import React from 'react'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

function Navbar({user, onLogout}) {
    return (
        <div className="nav">
            <Link to="/">
                <span style={{fontSize:"20px",color:"lightgrey"}}>
                    <span className="text-warning" style={{fontWeight:"630"}}>Account Snap</span> | 
                </span>
                <span style={{color:"lightgreen"}}> {user.email?user.email:user.phoneNumber}</span>
            </Link>
            <div style={{display:"flex",alignItems:"center"}}>
                <span className="nav-links">
                <Button variant="outlined" color="primary">
                    <Link to="/income"><span className="text-success">Incomes</span></Link>
                </Button>
                </span>
                <span className="nav-links">
                <Button variant="outlined" color="primary">
                    <Link to="/expense"><span className="text-info">Expenses</span></Link>
                </Button>
                </span>
                <Button className="btn btn-danger   " variant="contained" onClick={onLogout}>Logout</Button>
            </div>
        </div>
    )
}

export default Navbar
