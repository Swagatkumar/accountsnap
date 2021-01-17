import { Modal } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import React from 'react'

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


function EditAccount() {
    return (
        <div>
            
        </div>
    )
}

function DeleteAccount() {
    return (
        <div>
            
        </div>
    )
}

function AddAccount({open,handleClose,submitHandler}) {
    return (
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
                        <input type="number" onChange={e=>{setBalance(e.target.value)}} required className="form-control" placeholder="Current Balance" />
                        <label className="form-label text-danger" htmlFor="form1">*Enter the balance in the account to track</label>
                        <center><button type="submit" className="btn btn-success">Add Account</button></center>
                    </form>
                </div>
            </div>
        </Modal>
    )
}

export {AddAccount,EditAccount,DeleteAccount}