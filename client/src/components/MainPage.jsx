import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    Avatar,
    Input,
    Button,
} from "@chakra-ui/react"
import CreateExpense from './CreateExpense'
import axios from 'axios'
import { useNavigate,useLocation } from 'react-router-dom'

function UserListItem({ user }) {
    return (
        <div className="flex flex-row justify-between border-b-2 pb-2">
            <div className="flex flex-row gap-2">
                <Avatar name={`${user.firstname} ${user.lastname}`} />
                <div className="flex flex-col">
                    <p className="font-bold">{user.firstname} {user.lastname}</p>
                    <p className="text-gray-700 text-sm">@{user.username}</p>
                </div>
            </div>
            <CreateExpense userId={user._id} firstname={user.firstname} />
        </div>
    )
}


function BalanceListItem({ balance }) {

    let amountStyle = ""
    if (balance.amount < 0) {
        amountStyle = "text-red-500 font-semibold text-lg"
    }
    if (balance.amount > 0) {
        balance.amount = "+" + balance.amount
        amountStyle = "text-green-500 font-semibold text-lg"
    }

    return (
        <div className="flex flex-row justify-between border-b-2 p-2 cursor-pointer hover:bg-gray-200">
            <div className="flex flex-row gap-2">
                <Avatar name={`${balance.firstname} ${balance.lastname}`} />
                <div className="flex flex-col">
                    <p className="font-bold">{balance.firstname} {balance.lastname}</p>
                    <p className="text-gray-700 text-sm">@{balance.username}</p>
                </div>
            </div>
            <p className={amountStyle}>{balance.amount}</p>
        </div>
    )
}


export default function MainPage({query,setQuery}) {

    const navigate = useNavigate()
    const location = useLocation()
    const accessToken = useSelector((state) => state.loginState.accessToken)
    const [searchResults, setSearchResults] = useState()
    const [balances, setBalances] = useState() //fname,lname,name,balance

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }


    const handleSearch = () => {
        const query = document.getElementById('search').value
        axios.get('/api/user/' + query, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res) => {
                setSearchResults(res.data)
                navigate('/search')
            })
            .catch((err) => {
                console.log(err.response.data)
            })

    }

    useEffect(() => {
        axios.get('/api/balance', {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res) => {
                setBalances(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])


    return (
        <div className="mt-10 flex flex-col w-2/3 m-auto">
            <h1 className="font-bold text-2xl text-center">🏄‍♂️  Splitwise</h1>
            <div className="pl-40">
                <div>
                    <Input value={query} onChange={(e)=>{setQuery(e.target.value)}} className="pt-2" id="search" onKeyPress={handleKeyPress} variant="outline" className="mt-5" w="66.66%" placeholder="Search" />
                    <Button className="bottom-1 ml-2" onClick={handleSearch} colorScheme="blue">Search</Button>
                </div>
                <div className="flex flex-col gap-5 mt-5 w-2/3" >
                    {balances && balances && balances.map((balance) => <BalanceListItem key={balance._id} balance={balance} />)}
                </div>
            </div>
        </div>
    )
}
