import Avatar from '@mui/material/Avatar';

export const UserInfo = (data) => {
    return (
        <Avatar sx={{ 
            bgcolor: data.color,
            width: '100px',
            height: '100px',
            fontSize: 14,
            margin: '20px auto'
    
         }}>{data.user}</Avatar>
    )
}