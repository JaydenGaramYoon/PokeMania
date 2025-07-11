import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './src/components/Home/Home';
import Layout from './src/components/Layout/Layout';
import Favourites from './src/components/Favourites/Favourites';
import Talktalk from './src/components/Talktalk/Talktalk';
import Game from './src/components/Game/Game';
import Login from './src/components/Login/Login';

const MainRouter = () => {
    return (<div>
        <Layout />
        <main>
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/talktalk" element={<Talktalk />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
        </main>
    </div>
    )
}
export default MainRouter