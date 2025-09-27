const API_BASE_URL = 'https://api.redseam.redberryinternship.ge/api';

export const registerUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      username: formData.username,             // backend expects "name"
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword
    })
  });

  const data = await response.json();

  if (!response.ok) {
   
    throw data;
  }

  return data; 
};
