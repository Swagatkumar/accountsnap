import React from 'react'
import BankSection from './BankSection'
import CashSection from './CashSection'
import Total from './Total'

function Dashboard({uid,listOfBanks}) {
    return (
        <>
            <BankSection uid={uid} />
            <div className="body-right">
                <CashSection uid={uid} />
                <Total />
            </div>
        </>
    )
}

export default Dashboard
