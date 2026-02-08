const axios = require('axios');

const LEETCODE_ENDPOINT = "https://leetcode.com/graphql/";
const LEETCODE_URL = "https://leetcode.com";

const getUserProfileQuery = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submissionCalendar
    }
  }
`;

async function testHandle(username) {
  try {
    console.log(`Testing handle: ${username}`);
    const response = await axios.post(
      LEETCODE_ENDPOINT,
      {
        query: getUserProfileQuery,
        variables: { username }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Referer": LEETCODE_URL
        }
      }
    );

    console.log("Response Data:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

testHandle('neal_wu');
