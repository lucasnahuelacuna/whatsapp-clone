import { Avatar, Button, IconButton } from '@material-ui/core'
import React, { useState } from 'react'
import styled from 'styled-components'
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat';
import { useRouter } from 'next/router'


const Sidebar = () => {
    const [user] = useAuthState(auth)
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [chatsSnapshot] = useCollection(userChatRef)
    const [popupIsOpen, setPopupIsOpen] = useState(false)
    const [popupInput, setPopupInput] = useState('')
    const router = useRouter()

    
    const createChat = () => {
        //const input = prompt('Please enter an email address for the user you wish to chat with')

        if(!popupInput) {
            setPopupIsOpen(false)
            return null
        }

        if(EmailValidator.validate(popupInput) && popupInput !== user.email && !chatAlreadyExists(popupInput)) {
            //We need to add the chat into the DB 'chats' collection if doesn't already exists and is valid
            db.collection('chats').add({
                users: [user.email, popupInput],
            })
        }

        setPopupIsOpen(false)
        setPopupInput('')
    }

    const closePopup = () => {
        setPopupInput('')
        setPopupIsOpen(false)
    }

    const chatAlreadyExists = (recipientEmail) => {
        const chatExists = !!chatsSnapshot?.docs.find(
                        chat => chat.data().users.find(user => user === recipientEmail)?.length > 0
                     )
        return chatExists
    }
    
    const signOut = () => {
        auth.signOut().then(() => {
            router.push('/') 
        })
    }

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={signOut} />

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

            <SidebarButton onClick={() => setPopupIsOpen(true)}>
                START A NEW CHAT
            </SidebarButton>

            {/* List of Chats */}
            {chatsSnapshot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
            ))}

            {popupIsOpen && (
                <Popup>
                    <p>Please enter an email address for the user you wish to chat with:</p>
                    <input
                        value={popupInput}
                        onChange={e => setPopupInput(e.target.value)} 
                        type="text"
                    />
                    <PopupContainerButtons>
                        <PopupButton onClick={closePopup}>
                            Cancel
                        </PopupButton>
                        <PopupButton onClick={createChat}>
                            Accept
                        </PopupButton>
                    </PopupContainerButtons>
                </Popup>
            )
            }
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
    cursor: pointer;

    :hover {
        background-color: rgba(74, 223, 130, 0.15);
    }
`

const Popup = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f6f6f6;
    border-radius: 10px;
    position: fixed;
    width: 30vw;
    top: 25vh;
    left: 35vw;
    z-index: 50;
    border-bottom: 4px solid #4adf84;
    box-shadow: 5px 5px 15px -2px rgba(103,103,103,0.75);
-webkit-box-shadow: 5px 5px 15px -2px rgba(103,103,103,0.75);
-moz-box-shadow: 5px 5px 15px -2px rgba(103,103,103,0.75);

    > p {
        font-weight: 300;
    }

    > input {
        outline: none;
        padding: 10px;
        border: 1px solid white;
        border-radius: 5px;
    }
`

const PopupContainerButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`

const PopupButton = styled.button`
    width: 70px;
    padding: 8px 5px;
    background-color: #E3E3E3;
    border-radius: 5px;
    border: 1px solid #E3E3E3;
    outline: none;
    margin-right: 20px;
    cursor: pointer;

    :hover {
        background-color: #ddd;
        border-color: #ddd;
    }
`