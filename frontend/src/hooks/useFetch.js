import { useEffect, useState } from "preact/hooks";

export const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
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
  }, [url]);
  return data;
};
