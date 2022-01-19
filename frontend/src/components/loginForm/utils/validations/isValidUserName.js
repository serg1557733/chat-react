export const isValidUserName = ({userName}) => {
    const nameRegex = /[^A-Z a-z0-9]/ ;
    return !nameRegex.test(userName);
}
