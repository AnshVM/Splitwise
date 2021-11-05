import React, { useState } from 'react'
import { Progress, Text, Input, InputGroup, show, InputRightElement, Button } from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Singup() {

    const logoStyle = "font-logo font-bold text-2xl mb-4"
    const [show, setShow] = useState(false)
    const [resRecieved,setResRecieved] = useState();
    const [error,setError] = useState("");

    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: ""
    })

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        })
    }

    const signup = (body) => {
        setError("");
        setResRecieved(false);
        axios.post('/api/user',body)
            .then((res)=>{
                console.log(res.data)
                setResRecieved(true)
            })
            .catch((err)=>{
                setResRecieved(true);
                if(err.response.status===400){
                    setError(err.response.data)
                }
            })
    }

    return (
        <div className="p-4 text-center mt-36 m-auto w-96 border-gray-700 border-2 ">
            <Text className={logoStyle}>Splitwise</Text>
            <div className="flex flex-col gap-y-5">
                <div className="flex flex-row gap-x-2">
                    <Input value={form.firstname} onChange={handleFormChange} id="firstname" placeholder="First Name" />
                    <Input value={form.lastname} onChange={handleFormChange} id="lastname" placeholder="Last Name" />
                </div>
                <Input value={form.username} onChange={handleFormChange} id="username" placeholder="Username" />
                <Input value={form.email} onChange={handleFormChange} id="email" placeholder="Email" />

                <InputGroup size="md">
                    <Input
                        value={form.password}
                        onChange={handleFormChange}
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                        id="password"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Button onClick={() => signup(form)} colorScheme="blue" w="100%">Signup</Button>
                {resRecieved===false && <Progress size="xs" isIndeterminate/>}
                <Text>{error}</Text>
                <p className="text-gray-800 text-sm">Already have an account? <Link to="/login" className="underline">Login here</Link></p>
            </div>
        </div>
    )
}
