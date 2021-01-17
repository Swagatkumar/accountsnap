import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, Modal, Tooltip } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import Bank from './Bank';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountIdList, setTotal } from '../redux/bankSectionSlice';
import { decrypt, encrypt } from './CipherConstants';

//Design for modal box
function getModalStyle() {
    const top = 50 ;
    const left = 50 ;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 320,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: "5px"
    },
}));


//Component Bank section
function BankSection({uid}) {

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [isModalOpen, setIsModalOpen] = useState(false)  
    const [accountId, setAccountId] = useState("")
    const [bankName, setBankName] = useState("")
    const [balance, setBalance] = useState(0)
    const [accountObj, setAccountObj] = useState(null)
    const accountIdList = useSelector(state => state.bankSection.accountIdList)
    const total = useSelector(state => state.bankSection.total)
    const dispatch = useDispatch()

    useEffect(() => {
        const ref = db.collection(uid).doc("bank-accounts").onSnapshot(snapshot=>{
            if(!snapshot.exists){
                snapshot.ref.set({
                    accountIdList:[],
                    total: encrypt("0")
                })
            }
            setAccountObj(snapshot.data())
        })
        return ref
    },[uid,dispatch]);

    useEffect(() => {
        if(accountObj){
            dispatch(setAccountIdList(accountObj.accountIdList.map(id=>decrypt(id))))
            if(accountObj.total!==undefined){
                dispatch(setTotal(decrypt(accountObj.total)))
            }
        }
    }, [accountObj,dispatch])

    const openModal = () => {
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
    }

    const deleteAccountClicked = (accountIdRef,bal) => {
        const ref = db.collection(uid).doc("bank-accounts").collection(encrypt(accountIdRef)).doc("account")
        ref.delete().then(()=>{
            db.collection(uid).doc("bank-accounts").update({
                accountIdList: accountIdList.filter(accountIds=>accountIds!==accountIdRef).map(id=>encrypt(id)),
                total: encrypt((parseFloat(total)-parseFloat(bal)).toFixed(2))
            })
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const list = [...accountIdList.map(id=>encrypt(id)),encrypt(accountId)]
        db.collection(uid).doc("bank-accounts").set({
            accountIdList: list
        })
        db.collection(uid).doc("bank-accounts").collection(encrypt(accountId)).doc("account").set({
            accountId: encrypt(accountId),
            bankName: encrypt(bankName),
            balance: encrypt(parseFloat(balance).toFixed(2))
        }).then(()=>{
            db.collection(uid).doc("bank-accounts").update({
                total: encrypt((parseFloat(total)+parseFloat(balance)).toFixed(2))
            })
        })
        handleModalClose()
    }

    const onEditAmount = (value,id,bal) => {
        const val = parseFloat(value)-parseFloat(bal)
        db.collection(uid).doc("bank-accounts").collection(encrypt(id)).doc("account").update({
            balance: encrypt(parseFloat(value).toFixed(2))
        }).then(()=>{
            db.collection(uid).doc("bank-accounts").update({
                total: encrypt((parseFloat(total)+parseFloat(val)).toFixed(2))
            })
        })
    }

    return (
        <div className="body-left">
            <div className="body-left-header">
                <span>Bank Accounts: {total}</span>
                <Tooltip title="Add a new bank account">
                    <button type="button" className="btn btn-primary px-0 py-0" onClick={openModal}>
                        <AddIcon />
                    </button>
                </Tooltip>
            </div>
            <div className="body-left-body">
                {accountIdList!==undefined?accountIdList.length===0?<div>No Bank Account Exist</div>:
                accountIdList.map(account=><Bank onDelete={deleteAccountClicked} uid={uid} accountId={account} key={account} onEditAmount={onEditAmount} />):
                <div>No Bank Account Exist</div>}
            </div>
            <Modal
                open={isModalOpen}
                onClose={handleModalClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="body-left-header">
                        <span>Add a new Bank Account</span>
                        <button type="button" className="btn btn-danger px-0 py-0" onClick={handleModalClose}>
                            <CloseOutlined />
                        </button>
                    </div>
                    <div className="body-left-body form-outline">
                        <form onSubmit={submitHandler}>
                            <input type="text" onChange={e=>{setAccountId(e.target.value)}} required className="form-control" placeholder="Account Id" />
                            <label className="form-label text-danger" htmlFor="form1">*any id to identify, example-SBI_123</label>
                            <input type="text" onChange={e=>{setBankName(e.target.value)}} required className="form-control" placeholder="Bank Name" />
                            <label className="form-label text-danger" htmlFor="form1">*don't enter any branch name</label>
                            <input type="number" step="0.01" onChange={e=>{setBalance(e.target.value)}} required className="form-control" placeholder="Current Balance" />
                            <label className="form-label text-danger" htmlFor="form1">*Enter the balance in the account to track</label>
                            <center><button type="submit" className="btn btn-success">Add Account</button></center>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default BankSection
