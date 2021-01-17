import React, { useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Add, CloseRounded } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { setBalanceList, setCash, setTotal } from '../redux/bankSectionSlice';
import { decrypt, encrypt } from './CipherConstants';

function Accounts({uid,type,link}) {

    const [accountObj, setAccountObj] = useState(null)
    const [accountList, setAccountList] = useState([])
    const accountIdList = useSelector(state => state.bankSection.accountIdList)

    useEffect(() => {
        const ref = db.collection(uid).doc(type).onSnapshot(snapshot=>{
            if(!snapshot.exists){
                snapshot.ref.set({
                    accountList: []
                })
            }
            setAccountObj(snapshot.data())
        })
        return ref
    }, [uid,type])

    useEffect(() => {
        if(accountObj){
            setAccountList(accountObj.accountList)
        }
    }, [accountObj])

    if(accountIdList){
    return (
        <>
            <div className="body-right">
                <div className="body-left-header">
                    <span>{type} Accounts</span>
                </div>
                <div className="body-left-body">
                    {accountList.length===0?<div>No {type} Accounts to show.</div>:<table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        {accountList.map(account=><AccountLink key={account} uid={uid} type={type} accountTitle={account} link={link} />)}
                    </table>}
                </div>
            </div>

            <div className="body-left">
                <Route exact path={link} render={()=>
                    <AddAccountForm  uid={uid} type={type} accountList={accountList} />
                } />
                <Route path={`${link}/account`} render={(props)=>
                    <Account {...props} uid={uid} type={type} />
                } />
            </div>
        </>
    )
    }
    return <Redirect to="/" />
}

function AddAccountForm({uid,type,accountList}) {

    const [title, setTitle] = useState("");
    const [remark, setRemark] = useState("");

    const submitHandler = (e) => {
        e.preventDefault()

        db.collection(uid).doc(type).collection(encrypt(title)).doc("account").set({
            title: encrypt(title),
            remark: encrypt(remark)
        }).then(()=>{
            db.collection(uid).doc(type).set({
                accountList: [...accountList,encrypt(title)]
            })
        })
    }

    return (
        <>
            <div className="body-left-header">
                <span>Add a New {type} Account</span>
            </div>
            <div className="body-left-body px-5 py-5">
                <form onSubmit={submitHandler}>
                    <div className="px-5 py-3"><input type="text" onChange={e=>{setTitle(e.target.value)}} className="form-control" placeholder="Enter Account Title" required /></div>
                    <div className="px-5 py-3"><input type="text" onChange={e=>{setRemark(e.target.value)}} className="form-control" placeholder="Enter Any Remark" /></div>
                    <div className="px-5 py-3">
                        <button type="submit" className="btn btn-success">Add {type}</button>
                        <button type="reset" className="btn btn-info">Reset</button>
                    </div>
                </form>
            </div>
        </>
    )
}

function AccountLink({uid,type,accountTitle,link}) {

    const [accountObj, setAccountObj] = useState(null);

    useEffect(() => {
        const ref = db.collection(uid).doc(type).collection(accountTitle).doc("account")
        
        ref.onSnapshot(snapshot=>{
            if(snapshot.data()){
                setAccountObj(snapshot.data())
            }
        })
        return ref
    }, [uid,accountTitle,type]);

    return (
        <tbody>
            {accountObj&&<tr><td><Link to={{pathname:`${link}/account`, state:{
                title: decrypt(accountObj.title)
            }}}><div>{decrypt(accountObj.title)}</div></Link></td>
            <td><Link to={{pathname:`${link}/account`, state:{
                title: decrypt(accountObj.title)
            }}}><div>{decrypt(accountObj.remark)}</div></Link></td></tr>}
        </tbody>
    )
}

function Account({uid,type,location}) {

    const {title} = location.state
    const [summaryList, setSummaryList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState(new Date())
    const [dateChange, setDateChange] = useState(false);
    const months = ["01","02","03","04","05","06","07","08","09","10","11","12"]
    const [amount, setAmount] = useState(0);
    const [mode, setMode] = useState("In Cash");
    const [narration, setNarration] = useState("");
    const accountIdList = useSelector(state => state.bankSection.accountIdList)
    const balanceList = useSelector(state => state.bankSection.balanceList)
    const total = useSelector(state => state.bankSection.total)
    const cash = useSelector(state => state.bankSection.cash)
    const dispatch = useDispatch()

    useEffect(() => {
        const ref = db.collection(uid).doc(type).collection(encrypt(title)).orderBy("date","desc").onSnapshot(snapshot=>{
            setSummaryList(snapshot.docs)
        })
        return ref
    }, [uid,type,title]);

    useEffect(() => {
        if(!dateChange){
            let dateRef = setInterval(() => {
                setDate(new Date())
            }, 1000);
            return () => {
                clearInterval(dateRef)
            }
        }
    })

    

    const stringify = () => date.getFullYear()+"-"+months[date.getMonth()]+"-"+String(date.getDate()).padStart(2,'0')+"T"+String(date.getHours()).padStart(2,'0')+":"+String(date.getMinutes()).padStart(2,'0')

    const submitHandler = (e) => {
        e.preventDefault()
        db.collection(uid).doc(type).collection(encrypt(title)).add({
            amount: encrypt(parseFloat(amount).toFixed(2)),
            mode: encrypt(mode),
            narration: encrypt(narration),
            date
        }).then(()=>{
            if(mode==="In Cash"){
                if(type==="Expense"){
                    const afterExpense = (parseFloat(cash)-parseFloat(amount)).toFixed(2)
                    db.collection(uid).doc("cash").update({
                        amount: encrypt(afterExpense)
                    }).then(()=>{
                        dispatch(setCash(afterExpense))
                    })
                }else{
                    const afterIncome = (parseFloat(cash)+parseFloat(amount)).toFixed(2)
                    db.collection(uid).doc("cash").update({
                        amount: encrypt(afterIncome)
                    }).then(()=>{
                        dispatch(setCash(afterIncome))
                    })
                }
            }else{
                if(type==='Expense'){
                    const afterExpenseBalance = (parseFloat(balanceList[mode])-parseFloat(amount)).toFixed(2)
                    db.collection(uid).doc("bank-accounts").collection(encrypt(mode)).doc("account").update({
                        balance: encrypt(afterExpenseBalance)
                    }).then(()=>{
                        dispatch(setBalanceList([mode,afterExpenseBalance]))
                        const afterExpenseTotal = (parseFloat(total)-parseFloat(amount)).toFixed(2)
                        db.collection(uid).doc("bank-accounts").update({
                            total: encrypt(afterExpenseTotal)
                        }).then(()=>{
                            dispatch(setTotal(afterExpenseTotal))
                        })
                    })
                }else{
                    const afterIncomeBalance = (parseFloat(balanceList[mode])+parseFloat(amount)).toFixed(2)
                    db.collection(uid).doc("bank-accounts").collection(encrypt(mode)).doc("account").update({
                        balance: encrypt(afterIncomeBalance)
                    }).then(()=>{
                        dispatch(setBalanceList([mode,afterIncomeBalance]))
                        const afterIncomeTotal = (parseFloat(total)+parseFloat(amount)).toFixed(2)
                        db.collection(uid).doc("bank-accounts").update({
                            total: encrypt(afterIncomeTotal)
                        }).then(()=>{
                            dispatch(setTotal(afterIncomeTotal))
                        })
                    })
                }
            }
        })
        setShowForm(false)
    }

    const timeStampToDate = (timeStamp) => {
        const dateTime = timeStamp.toDate()
        return dateTime.toDateString()+" "+dateTime.toLocaleTimeString()
    }
    
    if(accountIdList){
    return (
        <>
            <div className="body-left-header">
                <Link to={`/${type}`}><ArrowBackIosRoundedIcon/></Link>
                <span className={showForm?"d-none":"d-block"}>{title}</span>
                <span className={showForm?"d-block":"d-none"}>Add a new {type} under {title}</span>
                <Button style={{outline:"none"}} className={showForm?"d-none":"d-block text-info"}><Add onClick={()=>{setShowForm(true)}}/></Button>
                <Button style={{outline:"none"}} className={showForm?"d-block text-danger":"d-none"}><CloseRounded onClick={()=>{setShowForm(false)}}/></Button>
            </div>
            <div className="body-left-body">
                <div className={showForm?"d-none":"d-block"}>{ summaryList.length===0?<div>No {type} to show under {title}.</div>:
                    
                    
                    <table className="table table striped">
                        <tbody>
                        <tr><th>Date-Time</th><th>Mode</th><th>Amount</th><th>Narration</th></tr>
                        {summaryList.map(summary=>summary.id!=="account"&&<tr key={summary.id}>
                            <td>{timeStampToDate(summary.data().date)}</td>
                            <td>{decrypt(summary.data().mode)}</td>
                            <td>{decrypt(summary.data().amount)}</td>
                            <td>{decrypt(summary.data().narration)}</td>
                        </tr>)}
                        </tbody>
                    </table> }


                </div>
                <div className={showForm?"d-block py-5 px-5":"d-none"}>
                    <form onSubmit={submitHandler}>
                        <input type="datetime-local" value={stringify()} className="form-control" onChange={e=>{
                            setDateChange(true);
                            setDate(new Date(e.target.value))
                        }} /><br/>
                        <select onChange={e=>{setMode(e.target.value)}} value={mode} className="form-select form-control" aria-label="Default select example">
                            <option defaultValue="In Cash">In Cash</option>
                            {accountIdList.map(id=><option value={id} key={id}>{id}</option>)}
                        </select><br/>
                        <input type="number" step="0.01" onChange={e=>{setAmount(e.target.value)}} className="form-control" placeholder="Enter Amount" /><br/>
                        <textarea className="form-control" onChange={e=>{setNarration(e.target.value)}} placeholder="Narration" style={{resize:"none"}} ></textarea><br/>
                        <center>
                            <Button type="submit" style={{outline:"none"}} className="bg-dark text-white mr-5">Add</Button>
                            <Button type="reset" style={{outline:"none"}} onClick={()=>{
                                setDateChange(false)
                                setMode("In Cash")
                            }} className="bg-info text-white">reset</Button>
                        </center>
                    </form>
                </div>
            </div>
        </>
    )
    }
    return <Redirect to="/" />
}

export default Accounts
