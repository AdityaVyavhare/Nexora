const fetchallposts = async () => {
  try {
    const response = await fetch("http://localhost:3000/posts/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Response from server:", data);
    return data.result;
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return null;
  }
};
export default fetchallposts;
