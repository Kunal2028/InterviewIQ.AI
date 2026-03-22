import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin, BsArrowRight } from "react-icons/bs";
import { HiOutlineLogout, HiSparkles } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

function Navbar() {
  const { userData } = useSelector((state) => state.user)
  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const creditRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (creditRef.current && !creditRef.current.contains(e.target)) {
        setShowCreditPopup(false)
      }

      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserPopup(false)
      }
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowCreditPopup(false)
        setShowUserPopup(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true })
      dispatch(setUserData(null))
      setShowCreditPopup(false)
      setShowUserPopup(false)
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='relative z-[9999] px-4 pt-5'>
        <motion.div
          initial={{ opacity: 0, y: -35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='mx-auto w-full max-w-7xl overflow-visible'
        >
          <div className='relative overflow-visible rounded-[28px] border border-white/70 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-5 md:px-8 py-4 flex items-center justify-between'>

            <div
              onClick={() => navigate("/")}
              className='flex items-center gap-3 cursor-pointer'
            >
              <div className='relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200'>
                <BsRobot size={20} />
                <span className='absolute -top-1 -right-1 bg-white text-green-600 rounded-full p-1 shadow'>
                  <HiSparkles size={10} />
                </span>
              </div>

              <div>
                <h1 className='text-lg md:text-xl font-bold tracking-tight text-gray-900'>
                  InterviewIQ.AI
                </h1>
                <p className='hidden md:block text-xs text-gray-500'>
                  Practice smarter with AI
                </p>
              </div>
            </div>

            <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-600'>
              <button
                onClick={() => navigate("/")}
                className='hover:text-green-600 transition'
              >
                Home
              </button>

              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return
                  }
                  navigate("/interview")
                }}
                className='hover:text-green-600 transition'
              >
                Interview
              </button>

              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return
                  }
                  navigate("/history")
                }}
                className='hover:text-green-600 transition'
              >
                History
              </button>

              <button
                onClick={() => navigate("/pricing")}
                className='hover:text-green-600 transition'
              >
                Pricing
              </button>
            </div>

            <div className='flex items-center gap-3 md:gap-4 relative overflow-visible'>

              <button
                onClick={() => navigate("/resume-analyser")}
                className='hidden md:flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:scale-105 transition'
              >
                <HiSparkles size={16} />
                Resume Analysis
                <BsArrowRight size={14} />
              </button>

              {!userData && (
                <button
                  onClick={() => setShowAuth(true)}
                  className='hidden sm:flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-green-400 hover:text-green-600 transition'
                >
                  Sign In
                </button>
              )}

              <div className='relative' ref={creditRef}>
                <button
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true)
                      return
                    }
                    setShowCreditPopup(!showCreditPopup)
                    setShowUserPopup(false)
                  }}
                  className='flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-green-400 hover:text-green-600 transition'
                >
                  <span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600'>
                    <BsCoin size={16} />
                  </span>
                  <span>{userData?.credits || 0}</span>
                </button>

                {showCreditPopup && (
                  <div className='absolute right-0 top-full mt-3 w-72 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl z-[9999]'>
                    <div className='mb-3 flex items-center gap-2 text-green-600'>
                      <BsCoin size={18} />
                      <p className='font-semibold'>Credits Balance</p>
                    </div>

                    <p className='text-sm text-gray-600 leading-6 mb-4'>
                      You have <span className='font-semibold text-gray-900'>{userData?.credits || 0}</span> credits available.
                      Buy more credits to continue premium interview practice.
                    </p>

                    <button
                      onClick={() => {
                        setShowCreditPopup(false)
                        navigate("/pricing")
                      }}
                      className='w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 transition'
                    >
                      Buy More Credits
                    </button>
                  </div>
                )}
              </div>

              <div className='relative' ref={userRef}>
                <button
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true)
                      return
                    }
                    setShowUserPopup(!showUserPopup)
                    setShowCreditPopup(false)
                  }}
                  className='flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white font-semibold shadow-lg'
                >
                  {userData
                    ? userData?.name?.slice(0, 1).toUpperCase()
                    : <FaUserAstronaut size={16} />
                  }
                </button>

                {showUserPopup && (
                  <div className='absolute right-0 top-full mt-3 w-56 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl z-[9999]'>
                    <div className='pb-3 border-b border-gray-100'>
                      <p className='text-sm text-gray-500'>Signed in as</p>
                      <p className='text-base font-semibold text-gray-900 truncate'>
                        {userData?.name}
                      </p>
                    </div>

                    <div className='pt-3 flex flex-col'>
                      <button
                        onClick={() => {
                          setShowUserPopup(false)
                          navigate("/history")
                        }}
                        className='w-full text-left rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition'
                      >
                        Interview History
                      </button>

                      <button
                        onClick={() => {
                          setShowUserPopup(false)
                          navigate("/resume-analyser")
                        }}
                        className='w-full text-left rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition'
                      >
                        Resume Analyzer
                      </button>

                      <button
                        onClick={() => {
                          setShowUserPopup(false)
                          navigate("/pricing")
                        }}
                        className='w-full text-left rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition'
                      >
                        Buy Credits
                      </button>

                      <button
                        onClick={handleLogout}
                        className='w-full text-left rounded-lg px-3 py-2.5 text-sm flex items-center gap-2 text-red-500 hover:bg-red-50 transition'
                      >
                        <HiOutlineLogout size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </>
  )
}

export default Navbar;