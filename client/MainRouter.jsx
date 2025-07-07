import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import Layout from './components/Layout';
import Favourites from './src/Favourites';
import Talktalk from './src/Talktalk';
import Game from './src/Game';
import Profile from './src/Profile';

const MainRouter = () => {
    return (<div>
        <Layout />
        <main>
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/talktalk" element={<Talktalk />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
        </main>
    </div>
    )
}
export default MainRouter