const handleAuthService = async (url, data, success, error) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        (response.ok) ? success(response) : error();
    } catch (err) {
        error();
        console.error(err);
    }
}

export default handleAuthService;