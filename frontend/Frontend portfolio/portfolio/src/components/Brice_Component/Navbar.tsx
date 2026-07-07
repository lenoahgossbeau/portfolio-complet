'use client';
import React, { useState } from 'react'
import Image from 'next/image'


import { TfiWorld } from "react-icons/tfi";
import { FaChevronDown } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";

import Hamburger from 'hamburger-react';


export default function Navbar() {

    // Hamburger menu useState 
    const [open, setOpen] = useState(false);

  return (
    <nav className='bg-white-100 text-white border-b border-[#ADADAD]'>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-sm">
            {/* left side */}
            <div>
                <div className='font-semibold text-lg text-[#5F5F5F] ml-5'>Inchtech Admin</div>
            </div>

            {/* center */}
            <div className='hidden md:flex gap-8'>
                <a href="#home" className='text-[#000000] flex items-center gap-[2px] hover:text-[#363636]'> 
                    <span className="w-[10px] h-[10px] bg-[#8A9DB4] rounded-full"/>
                    DashBoard
                </a>
            </div>

            {/* Right side */}
            <div>
                <button className='hidden md:flex items-center cursor-pointer hover:text-[#363636]'>
                    <TfiWorld className='text-[#5F5F5F] mr-1 '/>
                    <span className='text-[#5F5F5F] pr-[2px] '>EN</span>
                    {/*<FaChevronDown className='text-[#5F5F5F]'/>*/}
                </button>
            </div>


            <button 
            className="md:hidden text-[#5F5F5F]  focus:outline-none rounded-lg cursor-pointer">
                {/*<GiHamburgerMenu className='hover:text-[#363636] w-[22] h-[22]' />*/}
                <Hamburger size={22} toggled={open} toggle={setOpen}/>
            </button>
        </div>

        {open && (
                    <div className='md:hidden flex w-full justify-center py-12 shadow-lg border-t border-[#ADADAD]'>
                        <ul className='flex flex-col items-center space-y-4'>
                            <li><a href="#home" className='text-[#5F5F5F] hover:text-[#333]'>Dashboard</a></li>
                            <li>
                                <button className='flex items-center cursor-pointer hover:text-[#363636]'>
                                    <TfiWorld className='text-[#5F5F5F] mr-1 '/>
                                    <span className='text-[#5F5F5F] pr-[2px] '>EN</span>
                                </button> 
                            </li>
                        </ul>
                    </div>
                )}

    </nav>
  )
}