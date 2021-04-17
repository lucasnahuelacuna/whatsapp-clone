import { Avatar, IconButton } from '@material-ui/core'
import { useRouter } from 'next/router'
import React, { useState, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from './Message'
import firebase from 'firebase'
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'

const ChatScreen = ({ chat, messages }) => {
    const [input, setInput] = useState('')
    const endOfMessageRef = useRef(null)
    const [user] = useAuthState(auth)
    const router = useRouter()
    const [messagesSnapshot] = useCollection(
        db.collection('chats')
          .doc(router.query.id)
          .collection('messages')
          .orderBy('timestamp')
    )
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    )

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                    <Message 
                        key={message.id}
                        user={message.data().user}
                        message={{
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime(),
                        }}
                    />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    const sendMessage = (e) => {
        e.preventDefault()

        //Update the last seen...
        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        })

        setInput('')
        scrollToBottom()
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(chat.users, user)

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : (
                                '30 minutes ago'
                            )}
                        </p>
                    ) : (
                        <p>Loading last active ...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>

            <InputContainer>
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button 
                    hidden 
                    disabled={!input}
                    type='submit'
                    onClick={sendMessage}
                >
                    Send Message
                </button>
                <IconButton>
                    <MicIcon />
                </IconButton>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    align-items: center;
    padding: 11px;
    border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
        margin-top: 0;
    }

    > p {
        font-size: 14px;
        color: gray;
        margin: 7px 0px;
    }
`

const HeaderIcons = styled.div``

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`

const EndOfMessage = styled.div`
    margin-bottom: 25px;
`

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`

const Input = styled.input`
    flex: 1;
    outline: none;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`