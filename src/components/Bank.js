import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, makeStyles, Modal, Tooltip } from '@material-ui/core';
import { CloseOutlined, Delete } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { setBalanceList } from '../redux/bankSectionSlice';
import { decrypt } from './CipherConstants';

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

function Bank({uid,accountId,onDelete,onEditAmount}) {

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [bankObj, setBankObj] = useState(null)
    const [value, setValue] = useState('')
    const dispatch = useDispatch()
    
    useEffect(() => {
        const ref = db.collection(uid).doc("bank-accounts").collection(accountId).doc("account").onSnapshot(snapshot=>{
            if(snapshot.data()){
                setBankObj(snapshot.data())
            }
        })
        return ref
    },[uid,accountId])

    useEffect(() => {
        if(bankObj){
            dispatch(setBalanceList([accountId,decrypt(bankObj.balance)]))
        }
    }, [bankObj,accountId,dispatch])

    const openModal = () => {
        setIsModalOpen(true)
    }

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setIsDeleteModalOpen(false)
    }

    const editAmount = () => {
        if(!isNaN(parseFloat(value))){
            onEditAmount(value,accountId,decrypt(bankObj.balance))
        }
        setValue('')
        handleModalClose()
    }


    const editBankName = () => {
        if(isNaN(parseFloat(value))&&value!==''){
            db.collection(uid).doc("bank-accounts").collection(accountId).doc("account").update({
                bankName: value
            })
        }
        setValue('')
        handleModalClose()
    }

    if(bankObj){
        return(
            <div className="shadow-sm mb-3 bg-white rounded">
                <div className="card-header">
                    <span style={{fontWeight:"500"}} className="text-warning">Account Id: </span><b>{bankObj.accountId}</b>
                </div>
                <div className="card-body">
                    <div>
                        <span>Bank Name: </span>{bankObj.bankName}
                    </div>
                    <div>
                        <span>Balance: </span>{decrypt(bankObj.balance)}
                    </div>
                    <div>
                    <Tooltip title="Edit Account">
                    <IconButton aria-label="add" style={{outline:"none"}} onClick={openModal}>
                        <EditIcon color="primary" />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Account">
                    <IconButton aria-label="delete" style={{outline:"none"}} onClick={openDeleteModal} >
                        <Delete color="secondary" />
                    </IconButton>
                    </Tooltip>
                    </div>
                </div>
                <Modal
                    open={isModalOpen}
                    onClose={handleModalClose}
                >
                    <div style={modalStyle} className={classes.paper}>
                        <div className="body-left-header">
                            <span>Edit Account</span>
                            <button type="button" className="btn btn-danger px-0 py-0" onClick={handleModalClose}>
                                <CloseOutlined />
                            </button>
                        </div>
                        <div className="body-left-body form-outline">
                            <input type="text" onChange={e=>{setValue(e.target.value)}} required className="form-control" placeholder="Bank name or balance" />
                            <button type="submit" onClick={editBankName} className="btn btn-info" ><EditIcon/> Bank name</button>
                            <button type="submit" onClick={editAmount} className="btn btn-success" ><EditIcon/> Balance</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    open={isDeleteModalOpen}
                    onClose={handleModalClose}
                >
                    <div style={modalStyle} className={classes.paper}>
                        <div className="body-left-header">
                            <span>Are you sure want to delete this account</span>
                        </div>
                        <div className="body-left-body form-outline">
                            <button  type="submit" className="btn btn-danger" onClick={()=>{onDelete(accountId,decrypt(bankObj.balance))}}>Delete</button>
                            <button type="submit" className="btn" onClick={handleModalClose}>Cancel</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
    return (
        <div>
        </div>
    )
}

export default Bank
