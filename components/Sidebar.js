import { Avatar, Button, IconButton } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat';


const Sidebar = () => {
    const [user] = useAuthState(auth)
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [chatsSnapshot] = useCollection(userChatRef)
    
    const createChat = () => {
        const input = prompt('Please enter an email address for the user you wish to chat with')

        if(!input) {
            return null
        }

        if(EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
            //We need to add the chat into the DB 'chats' collection if doesn't already exists and is valid
            db.collection('chats').add({
                users: [user.email, input],
            })
        }

    }

    const chatAlreadyExists = (recipientEmail) => {
        const chatExists = !!chatsSnapshot?.docs.find(
                        chat => chat.data().users.find(user => user === recipientEmail)?.length > 0
                     )
        return chatExists
    }

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon /> 
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchContainer>
                    <SearchIcon />
                    <SearchInput placeholder='Search in chats' />
                </SearchContainer>
            </Search>

            <SidebarButton onClick={createChat}>
                START A NEW CHAT
            </SidebarButton>

            {/* List of Chats */}
            {chatsSnapshot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
            ))}
        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    /*height: 100vh;*/
    height: 100%;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    background-color: white;

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;
`

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: #ededed;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`

const IconsContainer = styled.div`

`

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px;
    border-radius: 25px;
`

const Search = styled.div`
    padding: 15px;
    border-radius: 2px;
    background-color: #f6f6f6;
`

const SearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
    margin-left: 5px;
`

const SidebarButton = styled.button`
    width: 100%;
    border: none;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid #eee;
    background-color: white;
    padding: 5px 0;
    outline: none;

    :hover {
        background-color: rgba(74, 223, 130, 0.15);
    }
`