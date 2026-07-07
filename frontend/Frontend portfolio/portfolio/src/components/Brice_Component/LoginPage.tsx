"use client";

import React from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* CARD */}
      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-[#003F7F] mb-6">
          Login
        </h2>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 mt-1 border border-[#ADADAD] rounded-[30px]"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 mt-1 border border-[#ADADAD] rounded-[30px]"
          />
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right mb-6">
          <button className="text-xs text-[#003F7F] hover:underline">
            Forgot password?
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button className="w-full bg-[#003F7F] text-white py-2 rounded-[30px] 
        text-sm font-medium hover:bg-[#002f60] transition">
          Login
        </button>

      </div>
    </div>
  );
}
