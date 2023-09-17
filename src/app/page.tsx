'use client';

import { checkSession, login, register } from "./userLogic";
import { useState } from "react";

export default async function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loggedUser, setLoggedUser] = useState('');

  const handleLogin = async () => {
    console.log('login');
    await login({ username, password });
    await handleCheckSession();
  };

  const handleRegister = async () => {
    console.log('register');
    await register({ username, password });
  };

  const handleCheckSession = async () => {
    console.log('check session');
    const user = await checkSession();
    setLoggedUser(user);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <form>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-4"
            type="button"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
      </div>
      <div>
        <p className="text-gray-700 text-sm font-bold mb-2 mt-4">
          {loggedUser && `Logged in as ${loggedUser}` || 'No user logged in'}
        </p>
      </div>
    </main>
  );
}
