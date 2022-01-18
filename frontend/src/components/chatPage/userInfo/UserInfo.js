import Avatar from '@mui/material/Avatar';

export const UserInfo = (user) => {
    return (
        <Avatar sx={{ 
            bgcolor: user.color,
            width: '100px',
            height: '100px',
            fontSize: 14,
            margin: '20px auto'
    
         }}>{user.user}</Avatar>
    )

}