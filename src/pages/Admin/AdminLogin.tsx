import React, { useEffect, useState } from 'react'
import { login } from '../../ApiCalls/userApis'
import { useCookies, Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import validator from 'validator';
interface ILoginCredentials {
    email: string,
    password: string
}
const AdminLogin = () => {
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState(false)
    const [credentials, setCredentials] = useState<ILoginCredentials>({
        email: '',
        password: ''
    })

    useEffect(() => {



        if (localStorage.getItem('token')) {
            navigate('/admin/home')
        }
    }, [])
    const handleAdminLogin = (e: any) => {
        e.preventDefault()
        if (!credentials.email || !credentials.password) {
            console.log("Email and password can not be empty")
        } else if (!validator.isEmail(credentials.email)) {


            console.log("Email is incorrect.")

        } else if (credentials.password.length < 8) {
            console.log("Not a valid password")
        } else {

            login(credentials)
                .then((resp: any) => {

                    if (resp.user && resp.user.role == 'admin') {
                        localStorage.setItem('token', resp.token)

                        navigate('/admin/home')
                    } else {
                        alert("You are not admin")
                    }
                })
                .catch((e: any) => {
                    if (e.response) {
                        if (e.response.data) {
                            alert(e.response.data.message)
                        }
                    } else {
                        alert('Something went wrong while login')
                    }
                    setCredentials({
                        email: '',
                        password: ''
                    })
                })
        }
    }
    return (
        <div >
            <div className='my-20'>

                <p className='text-center font-semibold lg:text-3xl my-5 md:text-2xl xl:text-4xl text-xl'>Admin Login</p>
                <div className='flex flex-col justify-center '>
                    <div className='flex justify-center my-2'>

                        <input
                            value={credentials.email}
                            onChange={(e: any) => setCredentials({
                                ...credentials,
                                email: e.target.value
                            })}
                            type="text" placeholder='Email' className='px-3 py-2 w-2/5  bg-gray-100 outline-0 border-solid border border-gray-300 rounded' />
                    </div>
                    <div className='flex justify-center items-center my-2'>


                        <input
                            value={credentials.password}
                            onChange={(e: any) => setCredentials({
                                ...credentials,
                                password: e.target.value
                            })}
                            type={showPass ? 'text' : 'password'} placeholder='Password' className='px-3 py-2 w-2/5 ml-7  bg-gray-100 outline-0 border-solid border border-gray-300 rounded' />

                        {showPass ?
                            <svg onClick={() => setShowPass(!showPass)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 hover:cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                            :

                            <svg onClick={() => setShowPass(!showPass)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 hover:cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        }

                    </div>
                    <div className='flex justify-center my-2'>

                        <button onClick={handleAdminLogin} className='text-center bg-blue-500 text-white w-2/5  py-2 rounded font-semibold hover:bg-blue-300'>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin