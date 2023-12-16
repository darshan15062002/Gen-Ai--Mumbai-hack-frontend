import React, { useEffect, useState } from 'react';

import ideabg8 from '../../assets/ideabg8.png'
import { BsFillCaretLeftFill } from 'react-icons/bs';
import './AddQuiz.scss'
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../api/authApi';
import { AddQuiz } from '../../Components/Pages/AddQuiz/AddQuiz';
import { Table } from '../../Components/Pages/Table/Table';


const Admin = () => {
    const navigate = useNavigate()
    const [noOfUsers, setNoOfUsers] = useState()
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('name')
    const [searchPage, setSearchPage] = useState(1)

    const handleSearch = (e) => {
        e.preventDefault()
        setLoading(true)
        getAllUsers(searchPage, query === 'location' ? "city" : query, search).then((res) => {
            setLoading(false)
            setNoOfUsers(res.userCount);
            setUsers(res.users)
        }).catch((err) => {
            setLoading(false)
        })

    }

    useEffect(() => {
        setLoading(true)
        getAllUsers(page).then((res) => {
            setLoading(false)
            setNoOfUsers(res.userCount);
            setUsers(res.users)
        })
    }, [page, setPage]);



    return (
        <div className='bg-slate-200 pt-16 h-full pb-6'>
            <AddQuiz className='bg-white' />
        </div>


    );
};

export default Admin;
