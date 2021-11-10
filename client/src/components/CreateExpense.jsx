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
import { useState } from 'react'
import { useSelector } from 'react-redux'

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


export default function CreateExpense({ firstname, userId }) {
    const accessToken = useSelector((state) => state.loginState.accessToken)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [menuState, setMenuState] = useState("Split by")
    const navigate = useNavigate()
    const [error,setError] = useState("")

    const [form, setForm] = useState({
        name: "",
        amount: 0,
        percentageShare: 0,
        exactShare: 0
    })

    const handleCreateExpense = () => {

        const name = form.name
        const negativeBalanceUser = userId;
        let balance=0;
        const totalAmount = form.amount

        if(totalAmount<=0){
            setError("Invalid total amount")
            return
        }

        if (menuState === "Percentage share") {
            const share = form.percentageShare;
            if(share<=0 || share>=100){
                setError("Percentage should be between 0 and 100")
                return
            }
            balance = totalAmount - (share / 100) * totalAmount
        }
        else if (menuState === "Exact share") {
            if(form.exactShare>=totalAmount || form.exactShare<=0){
                setError("Invalid exact share")
                return
            }
            balance = totalAmount - form.exactShare
        }
        else if (menuState === "Split equally") {
            balance = totalAmount / 2
        }

        axios.post('/api/balance/', { name, negativeBalanceUser, amount:balance }, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res) => {
                console.log(res.data)
                setMenuState("Split by")
                setForm({
                    name: "",
                    amount: 0,
                    percentageShare: 0,
                    exactShare: 0
                })
                onClose()
            })
            .catch((err) => {
                console.log(err.response.data)
            })
            navigate('/')
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
                        <p className="text-center font-semibold text-gray-600">{error}</p>
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