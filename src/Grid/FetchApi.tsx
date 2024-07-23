

async function fetchDataFromAPI(apiEndpoint) {
    try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();

    const rowsWithIds = data.map((row, index) => ({
        ...row,
        id: index + 1,
    }));

    return rowsWithIds;
    } catch (error) {
    console.error('Error fetching data:', error);
    return [];
    }
}

export default fetchDataFromAPI;

