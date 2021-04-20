import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Whatsapp-clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BackgroundDecoration />
      <ContainerApp>
        <Sidebar />
        <WelcomeScreen>
          <Image src='/images/image1.JPG' 
            width={250}
            height={250}
          />
          <h2>Keep your phone conected</h2>
        </WelcomeScreen>
      </ContainerApp>
    </Container>
  )
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

const WelcomeScreen = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fb;
  border-bottom: 10px solid #4adf84;

  > h2 {
    color: #a0a1a3;
    font-weight: 400;
  }
`


