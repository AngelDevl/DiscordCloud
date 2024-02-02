import React from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import UploadFiles from './UploadFiles.js';
import GetFiles from './GetFiles.js'


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<UploadFiles/>} />
                <Route path='/files' element={<GetFiles/>} />
            </Routes>
        </BrowserRouter>
    );
  }
  