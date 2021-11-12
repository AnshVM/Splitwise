import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../loginSlice'
import {
    Avatar,
    Input,
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
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
import CreateExpense from './CreateExpense'
import { socket } from '../App'


const getBalances = (accessToken, setBalances) => {
    axios.get('/api/balance', {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })
        .then((res) => {
            res.data = res.data.map((balance) => { return { ...balance, expenses: balance.expenses.reverse() } })
            setBalances(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
}

function PaymentSettledAlert({ firstname, isAlertOpen, onAlertClose }) {


    const cancelRef = React.useRef()

    return (
        <>
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Balance settled
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Your balances with {firstname} have been settled
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button colorScheme="blue" ref={cancelRef} onClick={onAlertClose}>
                                Ok
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

function PayBack({ setFirstname, max, balanceId, setBalances, balance, setIsAlertOpen}) {
    const accessToken = useSelector((state) => state.loginState.accessToken)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)

    const handlePayBack = () => {
        const amountPaid = document.getElementById('amount').value
        setIsLoading(true)
        axios.put('/api/balance/' + balanceId, { amountPaid, firstname: balance.firstname }, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res) => {
                setIsLoading(false)
                onClose()
                if (res.data === "Balance settled") {
                    setFirstname(balance.firstname)
                    setIsAlertOpen(true)
                }
                getBalances(accessToken, setBalances)
                socket.emit("UPDATED_BALANCES", balance.userId)
            })
            .catch((err) => {
                console.log(err)
            })
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

function ExpenseListItem({ expense, balance }) {

    let amountStyle = ""
    if (expense.expenseAmount < 0) {
        amountStyle = "text-red-500 font-semibold"
    }
    if (expense.expenseAmount > 0) {
        amountStyle = "text-green-500 font-semibold"
    }

    if (expense.expenseName === "") {
        if (expense.expenseAmount < 0) {
            expense.expenseName = `You were paid by ${balance.firstname}`
        }
        if (expense.expenseAmount > 0) {
            expense.expenseName = `${balance.firstname} was paid by you`
        }
    }

    return (
        <div className="flex flex-row justify-between px-4">
            <p>{expense.expenseName}</p>
            <p className={amountStyle}>{expense.expenseAmount > 0 && "+"}{expense.expenseAmount}</p>
        </div>
    )
}

function BalanceListItem({ balance, balances, setBalances, setIsAlertOpen, isAlertOpen, onAlertClose, setFirstname }) {


    let amountStyle = ""
    if (balance.amount < 0) {
        amountStyle = "text-red-500 font-semibold text-lg"
    }
    if (balance.amount > 0) {
        amountStyle = "text-green-500 font-semibold text-lg"
    }

    return (
        <div className="border-b-2">
            <div className="flex flex-row justify-between p-2 ">
                <div className="flex flex-row gap-x-2">
                    <Avatar name={`${balance.firstname} ${balance.lastname}`} />
                    <div className="flex flex-col">
                        <p className="font-bold">{balance.firstname} {balance.lastname}</p>
                        <p className="text-sm">@{balance.username}</p>
                    </div>
                </div>
                <div className="flex flex-row-reverse gap-x-4 pb-0 mb-0">
                    <CreateExpense getBalances={getBalances} setBalances={setBalances} userId={balance.userId} firstname={balance.firstname} />
                    {balance.amount < 0 && <PayBack setFirstname={setFirstname} setIsAlertOpen={setIsAlertOpen} isAlertOpen={isAlertOpen} onAlertClose={onAlertClose} firstname={balance.firstname} balance={balance} balances={balances} setBalances={setBalances} max={balance.amount} balanceId={balance._id} />}
                    <p className={amountStyle + " pt-2"}>{balance.amount > 0 && "+"}{balance.amount}</p>
                </div>
            </div>
            <p className="font-bold text-gray-600 ml-4">Balance History</p>
            {balance.expenses.map((expense) => <ExpenseListItem key={expense.id} expense={expense} balance={balance} />)}
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
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const onAlertClose = () => setIsAlertOpen(false)
    const [firstname, setFirstname] = useState("")
    
    if(socket){
    socket.on('UPDATED_BALANCES', () => {
        console.log(accessToken)
        getBalances(accessToken, setBalances)
    })
}

    console.log(isAlertOpen)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }


    const handleSearch = () => {
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
        getBalances(accessToken, setBalances)
    }, [accessToken])

    useEffect(() => {
        getBalances(accessToken, setBalances)
    }, [])

    const handleLogout = () => {
        axios.get('/api/user/logout', {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res) => {
                console.log(res.data)
                dispatch(login({ isLoggedIn: false, accessToken: undefined }))
                navigate('/login')
            })
            .catch((err) => console.log(err))
    }


    return (
        <div className="mt-10 flex flex-col md:w-4/5 lg:w-2/3 m-auto ">
            <h1 className="font-bold text-2xl text-center">🏄‍♂️  Splitwise</h1>
            <div className="lg:pl-40">
                <div >
                    <Input className="mt-5" w="66.66%" value={query} onChange={(e) => { setQuery(e.target.value) }} id="search" onKeyPress={handleKeyPress} variant="outline" placeholder="Search" />
                    <Button className="bottom-1 ml-2" onClick={handleSearch} colorScheme="blue">Search</Button>
                    <Button onClick={handleLogout} className="bottom-1 ml-2">Logout</Button>
                </div>
                <div className="flex flex-col mt-1 lg:w-2/3" >
                    {balances && balances.map((balance) => <BalanceListItem setFirstname={setFirstname} setIsAlertOpen={setIsAlertOpen} isAlertOpen={isAlertOpen} onAlertClose={onAlertClose} balances={balances} setBalances={setBalances} key={balance._id} balance={balance} />)}
                </div>
            </div>
            <PaymentSettledAlert isAlertOpen={isAlertOpen} onAlertClose={onAlertClose} firstname={firstname} />
        </div>
    )
}
