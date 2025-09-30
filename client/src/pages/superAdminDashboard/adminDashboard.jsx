// src/components/AdminDashboard.jsx
import React, { useState } from 'react'
import Sidebar from './Sidebar'

const Home = () => <div>Welcome to the Super Admin Home!</div>
const Settings = () => <div>Settings Page (Coming Soon)</div>
const LoggedOut = () => <div className='p-4'>You are being logged out...</div>

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home')

  let content
  if (activeTab === 'home') content = <Home />
  else if (activeTab === 'settings') content = <Settings />
  else if (activeTab === 'logout') content = <LoggedOut />

  return (
    <div className='flex min-h-screen'>
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />
      <main className='flex-1 p-8'>{content}</main>
    </div>
  )
}
