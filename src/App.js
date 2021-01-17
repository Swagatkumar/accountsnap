import { useEffect, useState } from 'react';
import { Route } from 'react-router';
import './App.css';
import Accounts from './components/Accounts';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import { auth } from './firebase';
import { resetBalanceList, setAccountIdList, setAccountObj, setBalanceList, setCash, setTotal } from './redux/bankSectionSlice';

function App() {

  const [user, setUser] = useState(null)
  const [uid, setUid] = useState('uid')
  const dispatch = useDispatch()

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
      dispatch(setAccountIdList(undefined))
      dispatch(resetBalanceList({}))
      dispatch(setAccountObj(null))
      dispatch(setCash(undefined))
      dispatch(setTotal(undefined))
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
