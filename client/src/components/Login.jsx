import React, { useState } from 'react'
import { Progress, Text, Input, InputGroup, show, InputRightElement, Button } from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {login} from '../loginSlice'
import { useNavigate } from 'react-router-dom';


export default function Login() {

    const logoStyle = "pt-2 font-logo font-bold text-2xl"
    const [show, setShow] = useState(false)
    const dispatch = useDispatch()
    const [error,setError] = useState("")
    const [resRecieved,setResRecieved] = useState()
    const navigate = useNavigate();

    const [form, setForm] = useState({
        first: "",
        password: ""
    })

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        })
    }

    const handleLogin = () => {
        setError("")
        setResRecieved(false)
        axios.post('api/user/login', form)
            .then((res) => {
                setResRecieved(true)
                const accessToken = res.data;
                dispatch(login({isLoggedIn:true,accessToken}))
                navigate('/')
            })
            .catch((err)=>{
                if(err.response.status===400){
                    setError(err.response.data)
                    setResRecieved(true)
                }
            })
    }
    return (
        <div className="p-4 text-center mt-36 m-auto w-96 border-gray-700 border-2 ">
            <Text className={logoStyle}>flick.gg</Text>
            <div className="flex flex-col gap-y-5">
                <Input id="first" value={form.first} onChange={handleFormChange} placeholder="Email or username" />
                <InputGroup size="md">
                    <Input
                        id="password"
                        value={form.password}
                        onChange={handleFormChange}
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Button onClick={handleLogin} colorScheme="blue" w="100%">Login</Button>
                <Text>{error}</Text>
                {resRecieved===false && <Progress size="xs" isIndeterminate/>}
                <p className="text-gray-800 text-sm">Don't have an account? <Link to="/signup" className="underline">Signup here</Link></p>
            </div>
        </div>
    )
}
