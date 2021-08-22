import { useEffect, useState } from "preact/hooks";

export const useFetch = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL)
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // Read the response as json.
        return response.json();
      })
      .then(function (responseAsJson) {
        // Do stuff with the JSON
        console.log(responseAsJson);
        setData(responseAsJson);
      })
      .catch(function (error) {
        console.log(error);
        console.log("Looks like there was a problem: \n", error);
      });
  }, []);
  return data;
};
