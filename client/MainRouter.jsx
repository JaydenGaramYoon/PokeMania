import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import Layout from './components/Layout';
import Favourites from './src/Favourites';
import Talktalk from './src/Talktalk';
const MainRouter = () => {
    return (<div>
        <Layout />
        <main>
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/talktalk" element={<Talktalk />} />
                </Routes>
        </main>
    </div>
    )
}
export default MainRouter