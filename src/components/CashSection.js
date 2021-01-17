import { IconButton, Tooltip } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { db } from '../firebase';
import { setCash } from '../redux/bankSectionSlice'
import { decrypt, encrypt } from './CipherConstants';

function CashSection({uid}) {

    const [amount, setAmount] = useState()
    const [isEditAmount, setIsEditAmount] = useState(false)
    const [editAmount, setEditAmount] = useState()
    const dispatch = useDispatch()


    useEffect(() => {
        
        const ref = db.collection(uid).doc("cash").onSnapshot(snapshot=>{
            if(!snapshot.exists){
                snapshot.ref.set({
                    amount: encrypt("0")
                })
            }
            if(snapshot.data()){
                setAmount(decrypt(snapshot.data().amount))
            }
        })

        return ref

    }, [uid]);

    useEffect(() => {
        if(amount){
            dispatch(setCash(amount))
        }
    }, [amount,dispatch])

    const openEditAmount = () => {
        setIsEditAmount(true)
    }

    const closeBox = () => {
        setIsEditAmount(false)
    }

    const onEditAmount = () => {
        if(!isNaN(parseFloat(editAmount))){
            db.collection(uid).doc("cash").update({
                amount: encrypt(parseFloat(editAmount).toFixed(2))
            }).then(()=>{
                setEditAmount('')
            })
        }
    }

    return (
        <div className="cash-section">
            <div className="card-header cash-header">
                <span>Cash Amount: {amount}</span>
                <div>
                    <Tooltip title="Edit Balance">
                        <IconButton aria-label="add" style={{outline:"none"}} onClick={openEditAmount}>
                            <Edit className="text-success" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="cash-body">
                <div className={isEditAmount?"body-left-body d-block":"body-left-body d-none"}>
                    <br/>
                    <AmountField changeEvent={value=>{setEditAmount(value)}} fieldValue={editAmount} />
                    <br/>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <button type="submit" onClick={onEditAmount} style={{marginLeft:"10%"}} className="btn btn-info" >Edit Balance</button>
                        <CloseButton clickEvent={closeBox} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function CloseButton({clickEvent}) {
    return (
        <button type="submit" onClick={()=>{clickEvent()}} style={{marginRight:"10%"}} className="btn btn-danger" >Cancel</button>
    )
}

function AmountField({changeEvent,fieldValue}) {
    return (
        <input type="number" step="0.01" value={fieldValue} onChange={e=>{changeEvent(e.target.value)}} required className="form-control" placeholder="Enter Balance" />
    )
}

export default CashSection
