import React, { useEffect, useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import { useHistory, NavLink } from 'react-router-dom'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'


const apiUrl = process.env.REACT_APP_API_SERVER_BASE_URL

const Albums = () => {
    const { auth, setAuth, setSongs, setPointer, setIsPlaying } = useContext(UserContext)
    const [albums, setAlbums] = useState([])
    const history = useHistory()
    const audio = document.getElementById('song')

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/album`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || auth}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    setAlbums([...data.albums])
                } else throw res


            } catch (err) {
                if (err.status === 401) {
                    localStorage.removeItem('token')
                    setAuth('')
                    history.push('/login')
                }
                console.dir(err)
                console.error(err)
            }
        }

        fetchAlbums()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const playAlbum = async (e) => {
        const albumId = e.target.getAttribute('id')
        try {
            const res = await fetch(`${apiUrl}/api/album/${albumId}/songs`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || auth}` }
            })

            if (res.ok) {
                const data = await res.json();
                const songsData = data.songs
                setSongs(data.songs)
                localStorage.setItem('currentSongPointer', 1);
                localStorage.setItem('currentSong', data.songs)
                setPointer(1)
                localStorage.setItem('currentTime', 0)
                audio.setAttribute('src', songsData[localStorage.getItem('currentSongPointer') - 1].song_url)
                audio.play()
                setIsPlaying(true)

            }
        } catch (err) {
            console.error(err)
        }
    }

    const cardContainerStyle = {
        padding: '50px 0 50px 50px',
        display: 'grid',
        gridGap: '16px',
        gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
    }

    const headerStyles = {
        padding: '125px 0 0 53px',
        margin: '0 3px',
        fontSize: '24px',
        lineHeight: '28px',
        color: 'hsla(0,0%,100%,1)',
    }


    return (
        <>
            <div style={headerStyles}>Albums</div>
            <div style={cardContainerStyle}>
                {albums.map(album => (
                    <div key={album.id}>
                        <div className='image-container'>
                            <img
                                style={{
                                    alignContent: 'end',
                                    marginBottom: '20px',
                                }}
                                src={album.image_url}
                                height='200px'
                                width='200px'
                                alt='album.jpg'
                                draggable='false'
                            />
                            <div className='after'>
                                <button onClick={playAlbum} id={album.id} style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer' }}>
                                    <PlayCircleOutlineIcon style={{ fontSize: '100px', pointerEvents: 'none' }} />
                                </button>
                            </div>
                        </div>
                        <div
                            style={{
                                justifySelf: 'start',
                                marginTop: '5px',
                                width: '190px',
                                overflow: 'hidden',
                            }}>
                            <NavLink type='button' activeClassName='navbar--active2' to={`/library/albums/${album.id}`} style={{
                                marginTop: '10px',
                                marginBottom: '7px',
                                color: '#fff',
                                fontSize: '16px',
                                whiteSpace: 'nowrap',
                            }}>{album.title}</NavLink>
                            <div style={{
                                color: '#b3b3b3',
                                fontSize: '11px',
                                lineHeight: '16px'
                            }}>{album.artist}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Albums
