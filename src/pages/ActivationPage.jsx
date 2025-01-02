import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';

const ActivationPage = () => {
    const { uid, token } = useParams(); // Get uid and token from the URL
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    document.title = "Account Activation";  // Set a custom title
    // Prevent caching for this page
    document.getElementsByTagName('head')[0].innerHTML += '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />';
    document.getElementsByTagName('head')[0].innerHTML += '<meta http-equiv="Pragma" content="no-cache" />';
    document.getElementsByTagName('head')[0].innerHTML += '<meta http-equiv="Expires" content="0" />';
}, []);

  useEffect(() => {
    // Call the backend API to activate the user account
    const activateAccount = async () => {
      try {
        const response = await axios.get(`https://skillcrafted-backend.vercel.app/accounts/active/${uid}/${token}`);
        setMessage('Account activated successfully! You can now log in.');
      } catch (error) {
        setMessage('Activation failed. The link may be invalid or expired.');
      }
    };

    activateAccount();
  }, [uid, token]);


  return (
    <div>ActivationPage
        <br />
        <p>{message}</p>
    </div>
    
  )
}

export default ActivationPage