import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {login} from '../loginSlice'
import {
    Avatar,
    Input,
    Button,
} from "@chakra-ui/react"
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    NumberInputField,
    NumberInput,
    Progress
} from "@chakra-ui/react"

function PayBack({ max, balanceId, balances, setBalances }) {
    const accessToken = useSelector((state) => state.loginState.accessToken)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)

    const handlePayBack = () => {
        const amountPaid = document.getElementById('amount').value
        setIsLoading(true)
        axios.put('/api/balance/' + balanceId, { amountPaid }, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res) => {
                if(res.data==="Payment settled"){
                    setBalances((prevBalances)=>(
                        prevBalances.filter((bal)=>bal._id!==balanceId)
                    ))
                    return 
                }
                setBalances((prevBalances) => (
                    prevBalances.map((bal)=>{
                        return bal._id===res.data._id ? {...bal,amount:-res.data.balance} : bal
                    })
                ))
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err.response.data)
            })
        onClose()
    }

    return (
        <>
            <Button onClick={onOpen} className="pb-0 mb-0" colorScheme="green">Pay back</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Clear Expenses</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <NumberInput>
                            <NumberInputField id="amount" max={max} placeholder="Amount" size="lg" />
                        </NumberInput>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handlePayBack} colorScheme="blue">Pay</Button>
                        {isLoading && <Progress size="xs" isIndeterminate />}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

function BalanceListItem({ balance, balances, setBalances }) {

    let amountStyle = ""
    if (balance.amount < 0) {
        amountStyle = "text-red-500 font-semibold text-lg"
    }
    if (balance.amount > 0) {
        balance.amount = "+" + balance.amount
        amountStyle = "text-green-500 font-semibold text-lg"
    }

    return (
        <div className="flex flex-row justify-between p-2 border-b-2">
            <div className="flex flex-row gap-x-2">
                <Avatar name={`${balance.firstname} ${balance.lastname}`} />
                <div className="flex flex-col">
                    <p className="font-bold">{balance.firstname} {balance.lastname}</p>
                    <p className="text-sm">@{balance.username}</p>
                </div>
            </div>
            <div className="flex flex-row-reverse gap-x-4 pb-0 mb-0">
                {balance.amount < 0 && <PayBack balances={balances} setBalances={setBalances} max={balance.amount} balanceId={balance._id} />}
                <p className={amountStyle + " pt-2"}>{balance.amount}</p>
            </div>

        </div>
    )
}


export default function MainPage({ query, setQuery }) {

    const navigate = useNavigate()
    const location = useLocation()
    const accessToken = useSelector((state) => state.loginState.accessToken)
    const [searchResults, setSearchResults] = useState()
    const [balances, setBalances] = useState() //fname,lname,name,balance
    const dispatch = useDispatch()

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }


    const handleSearch = () => {
        const query = document.getElementById('search').value
        axios.get('/api/user/search/' + query, {
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

    const handleLogout = () => {
        axios.get('/api/user/logout',{
            headers:{
                Authorization:"Bearer "+accessToken
            }
        })
        .then((res)=>{
            console.log(res.data)
            dispatch(login({isLoggedIn:false,accessToken:undefined}))
            navigate('/login')
        })
        .catch((err)=>console.log(err))
    }
    

    return (
        <div className="mt-10 flex flex-col w-2/3 m-auto ">
            <h1 className="font-bold text-2xl text-center">🏄‍♂️  Splitwise</h1>
            <div className="pl-40">
                <div>
                    <Input value={query} onChange={(e) => { setQuery(e.target.value) }} className="pt-2" id="search" onKeyPress={handleKeyPress} variant="outline" className="mt-5" w="66.66%" placeholder="Search" />
                    <Button className="bottom-1 ml-2" onClick={handleSearch} colorScheme="blue">Search</Button>
                    <Button onClick={handleLogout} className="bottom-1 ml-2">Logout</Button>
                </div> 
                <div className="flex flex-col mt-1 w-2/3" >
                    {balances && balances.map((balance) => <BalanceListItem balances={balances} setBalances={setBalances} key={balance._id} balance={balance} />)}
                </div>
            </div>
        </div>
    )
}
