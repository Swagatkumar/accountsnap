import React from 'react'
import { useSelector } from 'react-redux'

function Total() {

    const cash = useSelector(state => state.bankSection.cash)
    const bank = useSelector(state => state.bankSection.total)

    return (
        <div>
            <h3><b style={{color:"gray"}}>Total: {(parseFloat(bank)+parseFloat(cash)).toFixed(2)}</b></h3>
        </div>
    )
}

export default Total
