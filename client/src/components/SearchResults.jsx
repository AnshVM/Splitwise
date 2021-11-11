import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    Avatar,
    Input,
    Button,
} from "@chakra-ui/react"
import CreateExpense from './CreateExpense'
import axios from 'axios'

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

export default function SearchResults({query,setQuery}) {

    const accessToken = useSelector((state) => state.loginState.accessToken)
    const [searchResults, setSearchResults] = useState()

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSearch = () => {
        console.log('HERE:'+query)
        axios.get('/api/user/search/' + query, {
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

    useEffect(()=>{handleSearch()},[])

    return (
        <div className=" flex flex-col lg:w-2/3 md:mx-auto lg:mx-auto mt-10">
            <h1 className="font-bold text-2xl text-center">🏄‍♂️  Splitwise</h1>
            <div className="px-5 lg:pl-40">
                <div>
                    <Input value={query} onChange={(e)=>{setQuery(e.target.value)}}  className="pt-2" id="search" onKeyPress={handleKeyPress} variant="outline" className="mt-5" w="66.66%" placeholder="Search" />
                    <Button className="bottom-1 ml-2" onClick={handleSearch} colorScheme="blue">Search</Button>
                </div>
                <div className="flex flex-col gap-5 mt-5 lg:w-2/3" >
                    {searchResults && searchResults.map((user) => <UserListItem key={user._id} user={user} />)}
                </div>
            </div>

        </div>
    )
}
