const API_BASE_URL = 'https://api.redseam.redberryinternship.ge/api';

export const loginUser = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
     
      throw { status: response.status, ...data };
    }

    return data; 
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || 'Something went wrong during login.',
    };
  }
};
