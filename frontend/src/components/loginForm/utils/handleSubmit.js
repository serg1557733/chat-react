export const handleSubmit = async (e, POST_URL, userData) => {
    e.preventDefault();
    if(isValidPayload({...userData}) && isValidUserName({...userData})){
        const data = await sendForm(POST_URL, userData);
        const token = data.token;
        if(token){
            onSubmit(token);     
        }
        setTextModal(data.message)
        setDisplay('block')
        setUserdata({userName:'', password: ''});
        
        
    } else {
        setTextModal('too short or using special symbols')
        setDisplay('block')
    }
    
}