export const sendForm = async (POST_URL, userData) => {
    try {
        const response = await fetch(POST_URL, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        return json.token;

    } catch (e) {
        console.log(e)
    }
}