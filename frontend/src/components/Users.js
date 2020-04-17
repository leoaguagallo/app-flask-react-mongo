import React, { useState, useEffect } from 'react'

//BACKED
const API = process.env.REACT_APP_BACKED

export const Users = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // to get_users funtion
    const [users, setUsers] = useState([])
    // to update_user funtion
    const [editing_flag, setEditing_flag] = useState(false)
    const [id_backup, setId_backup] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault(); //cancel page restart

        if (!editing_flag) { // >>> CREATE USERS <<<
            /*
            * Consume Backend App
            */
            const res = await fetch(`${API}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ //sent a string to the server
                    name,
                    email,
                    password
                })
            })
            const data = await res.json();
            console.log(data)
        } else { // >>> EDIT USERS <<<
            /*
            * Consume Backend App
            */
            const res = await fetch(`${API}/users/${id_backup}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ //sent a string to the server
                    name,
                    email,
                    password
                })
            })
            const data = await res.json();
            console.log(data)

            //restore variables
            setEditing_flag(false)
            setId_backup('')
    
        }


        await get_users() //update of information
        //clear form
        setName('')
        setEmail('')
        setPassword('')
    }

    const get_users = async () => {
        const res = await fetch(`${API}/users`)
        const data = await res.json();
        setUsers(data)
    }

    useEffect(() => {
        get_users()
    }, [])

    const delete_user = async (id) => {
        //confirmacion
        const user_response = window.confirm('Are you sure you want to delete it?')
        if (user_response) {
            const res = await fetch(`${API}/users/${id}`, {
                method: 'DELETE'
            })
            await res.json()
            await get_users() //update of information
        }
    }

    const update_user = async (id) => {
        const res = await fetch(`${API}/users/${id}`)
        const data = await res.json()
        console.log(data)

        //-> id backup
        setId_backup(id)
        //->change form status
        setEditing_flag(true)

        //->llenar el formulario
        setName(data.name)
        setEmail(data.email)
        setPassword(data.password)
    }


    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body" >
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={e => setName(e.target.value)}
                            value={name}
                            className="form-control"
                            placeholder="Name"
                            autoFocus
                        />
                        <input
                            type="email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            className="form-control"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className="form-control"
                            placeholder="Password"
                        />

                    </div>

                    <button className="btn btn-primary btn-block">
                        { editing_flag ? 'Update' : 'Create' }
                    </button>

                </form>
            </div>
            <div className="col-md-6">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary btn-sm btn-block"
                                        onClick={(e) => update_user(user._id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm btn-block"
                                        onClick={(e) => delete_user(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}