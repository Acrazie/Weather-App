'use client'
import NavBar from "./components/Navbar/Navbar"
import HomePage from "./components/Pages/HomePage"
import SignIn from "./components/Pages/SignIn"

export default function Home() {
  return (
    <main>
      <NavBar/>
      {/* <SignIn/> */}
      <HomePage/>
    </main>
  )
}
