import Container from '@mui/material/Container';
import { MessageForm } from './messageForm/MessageForm';
import { MessageList} from './messageList/MessageList';
import { UserInfo } from './userInfo/UserInfo';
import { Userslist } from './usersList/UsersList';
import Box from '@mui/material/Box';


export const ChatPage = () => {
    return (
        <Container maxWidth="lg">
            <Box 
            sx={{
                display: 'flex',
            }}>
                <Box
                sx={{
                    display: 'flex',
                    flexGrow:'2',
                    flexDirection: 'column',
                    
                }}
                >
                    <MessageList></MessageList>
                    <MessageForm></MessageForm>
                </Box>
                <Box
                sx={{
                  
                    display: 'flex',
                    flexDirection: 'column',
                    
                }}
                >
                    <UserInfo></UserInfo>
                    <Userslist></Userslist>
                </Box>

            </Box>
         
        </Container>
        
    )

}