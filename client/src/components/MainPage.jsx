import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    Avatar,
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    NumberInput,
    NumberInputField,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuIcon,
    MenuCommand,
    MenuDivider,
    Chev
} from "@chakra-ui/react"

import { ChevronDownIcon } from '@chakra-ui/icons'


function ExpenseForm({ expenseType, firstname, form, setForm }) {

    if (expenseType === "Percentage share") {

        return (
            <>
                <FormControl className="mt-4" id="name">
                    <FormLabel>Name</FormLabel>
                    <Input placeHolder="Eg. Electricity bill" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }) }} />
                </FormControl>

                <FormControl id="amount">
                    <FormLabel>Total Amount</FormLabel>
                    <NumberInput>
                        <NumberInputField value={form.amount} onChange={(e) => { setForm({ ...form, amount: e.target.value }) }} />
                    </NumberInput>
                </FormControl>

                <FormControl id="userPercentageShare">
                    <FormLabel>Your percentage share</FormLabel>
                    <NumberInput>
                        <NumberInputField value={form.percentageShare} onChange={(e) => { setForm({ ...form, percentageShare: e.target.value }) }} />
                    </NumberInput>
                </FormControl>
            </>
        )
    }
    else if (expenseType === "Exact share") {
        return (
            <>

                <FormControl className="mt-4" id="name">
                    <FormLabel>Name</FormLabel>
                    <Input placeHolder="Eg. Electricity bill" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }) }} />
                </FormControl>

                <FormControl className="mt-4" id="thisUserShare">
                    <FormLabel>Total amount</FormLabel>
                    <NumberInput>
                        <NumberInputField value={form.amount} onChange={(e) => { setForm({ ...form, amount: e.target.value }) }} />
                    </NumberInput>
                </FormControl>

                <FormControl id="otherUserShare">
                    <FormLabel>Your share</FormLabel>
                    <NumberInput>
                        <NumberInputField value={form.exactShare} onChange={(e) => { setForm({ ...form, exactShare: e.target.value }) }} />
                    </NumberInput>
                </FormControl>
            </>
        )
    }

    else if (expenseType === "Split equally") {
        return (
            <>
                <FormControl className="mt-4" id="name">
                    <FormLabel>Name</FormLabel>
                    <Input placeHolder="Eg. Electricity bill" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }) }} />
                </FormControl>

                <FormControl className="mt-4" id="amount">
                    <FormLabel>Total Amount</FormLabel>
                    <NumberInput>
                        <NumberInputField value={form.amount} onChange={(e) => { setForm({ ...form, amount: e.target.value }) }} />
                    </NumberInput>
                </FormControl>
            </>
        )
    }
    else return (<></>)
}


function CreateExpense({ firstname, userId }) {
    const accessToken = useSelector((state) => state.loginState.accessToken)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [menuState, setMenuState] = useState("Split by")
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: "",
        amount:0,
        percentageShare:0,
        exactShare:0
    })

    const handleCreateExpense = () => {

        const name = form.name
        const negativeBalanceUser = userId;
        var balance;
        const totalAmount = form.amount
        console.log(form)
        if (menuState === "Percentage Share") {
            const share = form.percentageShare;
            console.log('HERE')
            balance = totalAmount - (share / 100) * totalAmount
        }
        else if (menuState === "Exact share") {
            balance = totalAmount - form.exactShare
        }
        else if (menuState === "Split equally") {
            balance = totalAmount / 2
        }

        console.log(balance)

        axios.post('/api/balance/', {name,negativeBalanceUser,balance},{
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res) => {
                console.log(res.data)
                setMenuState("Split by")
                setForm({
                    name: "",
                    amount:0,
                    percentageShare:0,
                    exactShare:0
                })
                onClose()
            })
            .catch((err) => {
                console.log(err.response.data)
            })
        
    }


return (
    <>
        <Button onClick={onOpen}>Create expense</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Expense</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            {menuState}
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => setMenuState("Percentage share")}>Percentage share</MenuItem>
                            <MenuItem onClick={() => setMenuState("Exact share")}>Exact share</MenuItem>
                            <MenuItem onClick={() => setMenuState("Split equally")}>Split equally</MenuItem>
                        </MenuList>
                    </Menu>

                    <ExpenseForm form={form} setForm={setForm} firstname={firstname} expenseType={menuState} />

                </ModalBody>

                <ModalFooter>
                    <Button mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateExpense} colorScheme="blue">Create Expense</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    </>
)
}

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


function BalanceListItem({ user }) {
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

export default function MainPage() {

    const accessToken = useSelector((state) => state.loginState.accessToken)
    const [searchResults, setSearchResults] = useState()

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
            })
            .catch((err) => {
                console.log(err.response.data)
            })
    }

    useEffect(()=>{
        axios.get('/api/balance',{
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res)=>{
                console.log(res.data)
            })
            .catch((err)=>{
                console.log(err)
            })
    })

    return (
        <div className="mt-10 flex flex-col w-2/3 m-auto">
            <h1 className="font-bold text-2xl text-center">🏄‍♂️  Splitwise</h1>
            <div className="pl-40">
                <div>
                    <Input className="pt-2" id="search" onKeyPress={handleKeyPress} variant="outline" className="mt-5" w="66.66%" placeholder="Search" />
                    <Button className="bottom-1 ml-2" onClick={handleSearch} colorScheme="blue">Search</Button>
                </div>
                <div className="flex flex-col gap-5 mt-5 w-2/3" >
                    {searchResults && searchResults.map((user) => <UserListItem key={user._id} user={user} />)}
                </div>
            </div>

        </div>
    )
}
