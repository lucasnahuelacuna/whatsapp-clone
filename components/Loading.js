import React from 'react'
import { Circle } from 'better-react-spinkit'

const Loading = () => {
    return (
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <img src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c543.png" 
                     alt=""
                     style={{ marginBottom: 50, height: 200 }}
                />
                <Circle style={{ marginLeft: 70 }} color="#3cbc28" size={60} />
            </div>
        </div>
    )
}

export default Loading
