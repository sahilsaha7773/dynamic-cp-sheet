import React, { useEffect, useState } from "react";
import {
  Badge,
  Table,
  Button,
  Form,
  FloatingLabel,
  Alert,
  Card,
  Image,
} from "react-bootstrap";
import urls from "../data/urls";
import styles from "./styles/home.module.css";
import Cookies from "js-cookie";
import { InfinitySpin } from "react-loader-spinner";
import GithubCorner from "react-github-corner";

function Home() {
  const [username, setUsername] = useState("");
  const [topic, setTopic] = useState("all");
  const [userData, setUserData] = useState({});
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [cfAcc, setCfAcc] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const cookieUsername = Cookies.get("username");
    if (cookieUsername !== undefined) {
      setUsername(cookieUsername);
    }
  }, []);
  function getContestIdAndIndex(url) {
    const index = url[url.length - 1];
    var contest = "";
    if (url.includes("contest")) {
      let k = url.length - 11;
      while (url[k] !== "/") {
        contest = url[k] + contest;
        k--;
      }
    } else {
      let k = url.length - 3;
      while (url[k] !== "/") {
        contest = url[k] + contest;
        k--;
      }
    }
    return { contest, index };
  }
  async function getData(username) {
    if (username.length === 0) {
      setError("Please enter a username");
      return;
    }
    try {
      setIsLoading(true);

      const cfInfo = await fetch(
        "https://codeforces.com/api/user.info?handles=" + username
      );
      const cfInfoJson = await cfInfo.json();
      if (cfInfoJson.status === "OK") {
        setCfAcc(cfInfoJson.result[0]);
      } else {
        setError(
          "Seems like Codeforces API is down at the moment, please try again after some time"
        );
        setIsLoading(false);
        return;
      }

      const url = `https://codeforces.com/api/user.status?handle=${username}`;
      const response = await fetch(url);
      var userData = await response.json();
      if (userData.status === "OK") {
        userData = userData.result;
      } else {
        setError(
          "Seems like Codeforces API is down at the moment, please try again after some time"
        );
        setIsLoading(false);
        return;
      }
      var data = {};
      var problems = urls.data;
      var problemsAttempted = {};
      for (let i = 0; i < userData.length; i++) {
        let contestId = userData[i].contestId;
        let index = userData[i].problem.index;
        let uid = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
        let verdict = userData[i].verdict;
        let problemName = userData[i].problem.name;
        let points = userData[i].problem.points;
        let rating = userData[i].problem.rating;
        let tags = userData[i].problem.tags;
        if (
          problemsAttempted[uid] !== undefined &&
          problemsAttempted[uid].verdict === "OK"
        )
          continue;
        problemsAttempted[uid] = { problemName, points, rating, tags, verdict };
      }
      for (let i = 0; i < problems.length; i++) {
        const topic = problems[i].topic;
        const list = problems[i].data;
        data[topic] = {};
        data[topic]["problems"] = [];
        var attCount = 0;
        var ok = 0;
        var wa = 0;
        for (let j = 0; j < list.length; j++) {
          var { contest, index } = getContestIdAndIndex(list[j]);
          var uid = `https://codeforces.com/problemset/problem/${contest}/${index}`;
          var attempted = false;
          if (problemsAttempted[uid] !== undefined) {
            attempted = true;
            attCount++;
            if (problemsAttempted[uid].verdict === "OK") ok++;
            else wa++;
            data[topic]["problems"].push({
              url: list[j],
              attempted,
              topic,
              ...problemsAttempted[uid],
            });
          } else {
            data[topic]["problems"].push({ url: list[j], topic, attempted });
          }
        }
        data[topic]["attempted"] = attCount;
        data[topic]["solved"] = ok;
        data[topic]["wa"] = wa;
      }
      if (topic !== "all") {
        var res = {};
        res[topic] = data[topic];
        setUserData(res);
      } else {
        setUserData(data);
      }
      setIsLoading(false);
    } catch (error) {
      setError(
        "Seems like Codeforces API is down at the moment, please try again after some time."
      );
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmittedUsername(username);
    setUserData({});
    setCfAcc(undefined);
    Cookies.set("username", username);
    getData(username);
  }
  return (
    <div>
      <GithubCorner
        size={100}
        href="https://github.com/sahilsaha7773/dynamic-cp-sheet"
        // bannerColor="white"
        // octoColor="black"
      />
      <div className={styles.topWrapper}>
        <div className={styles.usernameCard}>
          <h3 style={{ marginBottom: "20px" }}>Striver’s CP Sheet Tracker</h3>
          {error.length > 0 && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p style={{ textAlign: "left" }}>{error}</p>
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <FloatingLabel
                controlId="floatingInput"
                label="Codeforces Username"
                className="mb-3"
              >
                <Form.Control
                  size="lg"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder="Enter CF username"
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label="Select Topic"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setTopic(e.target.value)}
                  value={topic}
                  size="lg"
                >
                  <option value="all">All</option>
                  {urls.data.map((url, index) => {
                    return (
                      <option key={index} value={url.topic}>
                        {url.topic}
                      </option>
                    );
                  })}
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
            <Button
              variant="outline-primary"
              onClick={(e) => handleSubmit(e)}
              size="lg"
              style={{ width: "100%", marginBottom: "20px" }}
            >
              See Problems
            </Button>
            <Form.Text>
              This site only tracks the problems which are from Codeforces
            </Form.Text>
          </Form>
          <Form.Text>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://takeuforward.org/interview-experience/strivers-cp-sheet/"
            >
              Link to the original CP sheet page
            </a>
          </Form.Text>
          <p style={{ margin: "20px 0 0 0" }}>
            Made with ❤️ and ☕ by{" "}
            <a target="_blank" rel="noreferrer" href="https://sahilsaha.me">
              Sahil Saha
            </a>
          </p>
        </div>
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          {isLoading && <InfinitySpin />}
        </div>
      </div>
      {cfAcc && (
        <Card
          text="dark"
          style={{ maxWidth: "800px", textAlign: "left", margin: "0 auto" }}
          className={`mb-2 ${styles.cfInfoCard}`}
        >
          <Card.Header>CF Info for {submittedUsername}</Card.Header>
          <Card.Body>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <Image
                src={cfAcc.titlePhoto}
                style={{ margin: "0 20px 0 0" }}
                fluid
                thumbnail
              />
              <div>
                <p style={{ textAlign: "left", marginBottom: "8px" }}>
                  {cfAcc.rank}
                </p>
                <Card.Title>
                  {cfAcc.firstName} {cfAcc.lastName}
                </Card.Title>
                <Card.Text>
                  <p style={{ textAlign: "left", marginBottom: "8px" }}>
                    Contest rating: {cfAcc.rating} (max. {cfAcc.maxRank},{" "}
                    {cfAcc.maxRating})
                  </p>
                  <p style={{ textAlign: "left", marginBottom: "8px" }}>
                    Friend of: {cfAcc.friendOfCount} users
                  </p>
                </Card.Text>
                <Button
                  variant="outline-dark"
                  href={`https://codeforces.com/profile/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: "100%",
                    // marginTop: "100%",
                  }}
                >
                  Open Profile
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <div>
        {Object.keys(userData).map((topic) => (
          <div className={styles.topicContainer}>
            <h2>{topic}</h2>
            <div className={styles.tagsContainer}>
              <p className={styles.infoP}>
                {userData[topic].attempted}/{userData[topic].problems.length}{" "}
                problems attempted
              </p>
              <p className={styles.solvedP}>{userData[topic].solved} Solved</p>
              <p className={styles.notAccP}>
                {userData[topic].wa} not Accepted
              </p>
            </div>
            <Table hover striped responsive className={styles.problemsTable}>
              <thead style={{ borderTop: "1px solid #dee2e6" }}>
                <th>ID</th>
                <th>Problem</th>
                <th>Verdict</th>
              </thead>
              <tbody>
                {userData[topic].problems.map((problem, idx) => (
                  <tr>
                    <td>{idx + 1}</td>
                    <td>
                      <a target="_blank" rel="noreferrer" href={problem.url}>
                        {problem.url}
                      </a>
                    </td>
                    <td>
                      {problem.attempted ? (
                        <h5>
                          <Badge
                            bg={problem.verdict === "OK" ? "success" : "danger"}
                          >
                            {problem.verdict}
                          </Badge>
                        </h5>
                      ) : (
                        "Not Attempted"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
