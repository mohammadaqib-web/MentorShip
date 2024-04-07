import React from 'react'
import Navbar from '../components/navbar'
import Hero from '../components/hero'
import Benefits from '../components/benefits'
import Domains from '../components/domains'
import TopMentors from '../components/topMentors'
import Footer from '../components/footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Benefits/>
      <Domains/>
      <TopMentors/>
      <Footer/>
    </div>
  )
}

export default Home