import Head from 'next/head'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen'
import Sidebar from '../../components/Sidebar'
import { auth, db } from '../../firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'

const Chat = ({ messages, chat }) => {
    const [user] = useAuthState(auth)

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <BackgroundDecoration />
            <ContainerApp>
                <Sidebar />
                <ChatContainer>
                    <ChatScreen chat={chat} messages={messages} />
                </ChatContainer>
            </ContainerApp>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id)

    //Prep the messages on the server
    const messagesRes = await ref.collection('messages')
                                 .orderBy('timestamp', 'asc')
                                 .get()
    
    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
    }))

    //Prep the chats
    const chatRes = await ref.get()
    const chat = {
        id: chatRes.id,
        ...chatRes.data(),
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        }
    }
}

const Container = styled.div`
  background-color: #dadbd5;
  width: 100vw;
  height: 100vh;
  position: relative;
`

const BackgroundDecoration = styled.div`
  height: 20vh;
  background-color: #009788;
`

const ContainerApp = styled.div`
  display: flex;
  width: 90%;
  height: 94%;
  margin: auto;
  position: absolute;
  top: 3%;
  left: 5%;
  z-index: 50;
  box-shadow: 0px 0px 5px 2px rgba(150,150,150,0.75);
  -webkit-box-shadow: 0px 0px 5px 2px rgba(150,150,150,0.75);
  -moz-box-shadow: 0px 0px 5px 2px rgba(150,150,150,0.75);
`

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100%;

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`