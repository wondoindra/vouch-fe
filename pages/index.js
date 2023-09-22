import Head from 'next/head';
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import NorthIcon from '@mui/icons-material/North'

import styles from '../styles/Home.module.css';

let socket

export default function Home() {
  const [connected, setConnected] = useState(false)
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState([])
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')

  const initializeSocket = async () => {
    socket = io('http://localhost:8080')

    socket.on('new-message', data => {
      updateChat(data)
    })
  }

  useEffect(() => {
    initializeSocket()
  }, [])

  const updateChat = (data) => {
    setChats(oldChats => [...oldChats, data])
  }

  const joinRoom = () => {
    if (!username || !roomId) return
    setConnected(true)
  }

  const sendMessage = () => {
    socket.emit('send-message', { username, message })
    updateChat({ username, message })
    setMessage('')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing <code>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
        <div>
          {connected ? (
            <div>
              <div>
                {chats.map((chat, index) => (
                  <div key={`${index}`}>
                    <div>{chat.username}</div>
                    <div>{chat.message}</div>
                  </div>
                ))}
              </div>
              <div>
                <TextField
                  placeholder='Message here ..'
                  variant='outlined'
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <IconButton
                  onClick={sendMessage}
                >
                  <NorthIcon />
                </IconButton>
              </div>
            </div>
          ) : (
            <div>
              <TextField
                placeholder='Username'
                variant='outlined'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <TextField
                placeholder='RoomID'
                variant='outlined'
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
              />
              <Button
                variant='contained'
                onClick={joinRoom}
              >
                Join
              </Button>
            </div>
          )}
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
