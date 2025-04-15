import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const graphqlClient = async (query: string, variables?: any) => {
  const token = localStorage.getItem("accessToken");

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    // 🧠 Jeśli GraphQL zwrócił błędy walidacyjne — rzuć wyjątek
    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data.errors.map((e: any) => e.message).join("\n")
      );
    }

    return response.data;
  } catch (err) {
    // Obsługa błędu w komponencie
    throw err;
  }
};

export default graphqlClient;
