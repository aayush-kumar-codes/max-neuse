import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://pocketbase.io'); // Use your live demo instance URL

// Login using your demo credentials
const login = async () => {
    try {
        await pb.collection('users').authWithPassword('test@example.com', '123456');
        console.log('Logged in successfully');
    } catch (error) {
        console.error('Login failed:', error);
    }
};

// Call login function at the start
login();