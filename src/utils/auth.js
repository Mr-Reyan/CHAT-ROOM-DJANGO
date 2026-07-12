export const saveToken = (token) => {
    localStorage.setItem("access_token",token.access)
    localStorage.setItem("refresh_token",token.refresh)
}

export const removeToken = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
}

export const getAccessToken = () =>{
    let access = localStorage.getItem("access_token")
    if(access){
        return access
    }
    return
}

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");

  const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  localStorage.setItem("access_token", data.access);

  return data.access;
};