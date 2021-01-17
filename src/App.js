import { useEffect, useState } from 'react';
import { Route } from 'react-router';
import './App.css';
import Accounts from './components/Accounts';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import { auth } from './firebase';

function App() {

  const [user, setUser] = useState(null)
  const [uid, setUid] = useState('uid')

  useEffect(() => {
    const authObserver = auth.onAuthStateChanged((user) => {
      setUser(user)
      if(user){
        setUid(user.uid)
      }
    })
    return authObserver
  },[]);

  const logoutClicked = () => {
    auth.signOut().then(()=>{
      setUid("uid")
    }).catch(()=>{
      console.log("Trouble logging out")
    })
  }
  
  if(user){
    return (
      <div className="app">
        <Navbar user={user} onLogout={logoutClicked} />
        <div className="body">
          <Route exact path="/" render={() => (
            <Dashboard uid={uid} />
          )} />
          <Route path="/income" render={() => (
            <Accounts type="Income" uid={uid} link="/income" />
          )} />
          <Route path="/expense" render={() => (
            <Accounts type="Expense" uid={uid} link="/expense" />
          )} />
        </div>
      </div>
    )
  }
  return (
    <div className="app">
      <header className="App-header">
        <h1>Welcome to <span style={{color:"orange"}}>Account Snap</span></h1>
        <h2>Signup/Login</h2>
        <Signup />
      </header>
    </div>
  );
}

export default App;
