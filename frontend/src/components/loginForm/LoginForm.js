import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';


export const Login = () => {
    return (
        <Container maxWidth="xs">
            <Box
            sx={{
                marginTop: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="user name"
                name="userName"
                autoComplete="email"
                autoFocus
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                />
                <Button 
                variant="contained"
                fullWidth>Login
                </Button>
            </Box>
        </Container>
    )
}