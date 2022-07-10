import { LoginForm } from './components/loginForm/LoginForm';
import { ChatPage } from './components/chatPage/ChatPage';
import { useEffect } from 'react';
import { useDispatch, useSelector , useStore} from "react-redux";
import { storeToken, removeToken } from './actions/actions';
import { store } from './store';

export default function App() {


    const dispatch = useDispatch();

    const token = localStorage.getItem('token');
 
    console.log('startApp', token,)


    useEffect(() => {
        if(token){
            console.log('useEffect', token)
            //localStorage.setItem('token', token);  
            dispatch(storeToken(token))
        } 
    }, [token]);
    console.log( 'store token', store.getState().token)

    const  renderFunction = () => {
            localStorage.removeItem('token')


        console.log('subscribe')
    };  
    
    
    store.subscribe(() => 
                renderFunction
        //token = localStorage.getItem('token') || store.getState().token;
        );


    return token ? <ChatPage 
                    onExit={() =>{  
                        dispatch(removeToken(token))
                        console.log('remove token ', token)
                        localStorage.removeItem('token')
                    }}/> 
                : <LoginForm/> // delete setToken after unmounted

  
};

