export default async function updateCounter(counter, counterResult) {
    await fetch(counter, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: counterResult.id + 1 })
    });
};
