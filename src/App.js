import { React, useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { auth, db } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
    })
  }, [posts]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in, see docs for a list of available properties
        // console.log(authUser);
        setUser(authUser);
        // console.log('this is userstate', user);

      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => {
      //perform cleanup actin so that there are not more than one user signed in
      unsubscribe();
    }
  }, [user, username])

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => { alert(error.message) })
    setOpen(false);
    setUsername('');
    setEmail('');
    setPassword('');

  }
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      // .then((authUser) => {
      //   return authUser.user.updateProfile({
      //     displayName: username,
      //   })
      // })
      .catch((error) => { alert(error.message) })
    setOpenSignIn(false);
  }


  return (
    <div className="app">
      
      <Modal open={open} onClose={() => setOpen(false)} >
        <div style={modalStyle} className={classes.paper} >
          <form className="app__signup">
            <center >
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
            </center>
            <Input type="text" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="text" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)} >
        <div style={modalStyle} className={classes.paper} >
          <form className="app__signup">
            <center >
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
            </center>
            <Input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="text" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
        ) : (
          <div className="app__loginControl">
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )
        }
      </div>
      <div className="app__post">
        <div className="app__postleft">
          {posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
          }
        </div>
        <div className="app__postr">

        
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />

      ) : (<center><h3>Sorry you need to login first to upload</h3></center>)}
    </div>
  );
}

export default App;
