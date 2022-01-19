export const isValidPayload = ({userName, password}) => {
    return (userName.trim().length > 2 && password.trim().length > 4) 
}