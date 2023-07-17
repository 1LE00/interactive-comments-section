export default async function apiRequest(url, method, body) {
    try {
        return await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    } catch (error) {
        console.log(error);
    }
};
