import { useEffect, useState } from "react";

const userAuth = () => {
    const [user, setUser] = useState(null);        // Store the user data
    const [isLoading, setIsLoading] = useState(true);   // Track loading state
    const [error, setError] = useState(null);          // Track error state

    useEffect(() => {
        const id = localStorage.getItem('userId');    // Get user id from localStorage
        console.log(`User id is: ${id}`);

        if (id === null) {
            setUser({ status: "fail" });        // If no user id is found, set fail status
            setIsLoading(false);
            return;
        }

        // Fetch user data
        fetch(`http://localhost:8000/api/v1/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(data => {
            setUser(data);         // Store the fetched user data
            setIsLoading(false);   // Set loading to false once the data is fetched
        })
        .catch(err => {
            setError(err);         // Set error if something goes wrong
            setIsLoading(false);
        });
    }, []); // Empty dependency array means this runs only once when the component mounts

    return [user, isLoading, error];  // Return the data, loading state, and error state
}

export default userAuth;
