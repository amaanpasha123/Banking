 import HeaderBox from '@/components/HeaderBox'
import TotalBalance from '@/components/TotalBalance'
import React from 'react'
 
 const Home = () => {
  const loggedIn = {firstname : "Amaan"}
   return (
     <section className='home'>
      <div className='home-content'>
          <header className='home-header'>
            <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstname || "Guest"}
            subtext="Access and managed your account and transaction efficiently"
            />
          </header>
          <TotalBalance
          accounts={[]}
          totalBanks = {1}
          totalCurrentBalance = {1256}
           />
      </div>
     </section>
   )
 }
 
export default Home