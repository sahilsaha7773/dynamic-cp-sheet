import React, { useEffect, useState } from 'react'
import { Badge, Table, Button, Form } from 'react-bootstrap';
import { PieChart } from 'react-minimal-pie-chart';
import apiConfig from '../configs/apiConfig';
import problems from '../data/problems';
import styles from './styles/home.module.css';

function Home() {
  const [username, setUsername] = useState("");
  const [usernameInp, setUsernameInp] = useState("");
  const [topic, setTopic] = useState("all");
  const [userData, setUserData] = useState({});


  useEffect(() => {
    fetch(`${apiConfig.url}/${username}/${topic}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUserData(data);
      })
  }, [, username]);
  return (
    <div>
      <div className={styles.usernameCard}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>CF Username</Form.Label>
            <Form.Control onChange={(e) => setUsernameInp(e.target.value)} placeholder="Enter CF username" />
            <Form.Text className="text-muted">
              We'll never share your CF username with anyone else.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={(e) => setUsername(usernameInp)}>
            Submit
          </Button>
        </Form>
      </div>
      <div>
        {
          Object.keys(userData).map((topic) => (
            <div className={styles.topicContainer}>
              <h2>{topic}</h2>
              <p>{userData[topic].attempted} Attempted, {userData[topic].solved} Solved, {userData[topic].wa} not Accepted</p>
              <Table hover striped responsive className={styles.problemsTable}>
                <thead>
                  <th>Problem</th>
                  <th>Submissions</th>
                </thead>
                <tbody>
                  {userData[topic].problems.map(problem => (
                    // <tr className={`${(problem.attempted && (problem.verdict == "OK" && styles.green))} ${(problem.attempted && (problem.verdict == "WRONG_ANSWER" && styles.red))}`}>
                    <tr>
                      <td><a target="_blank" href={problem.url}>{problem.url}</a></td>
                      <td >{problem.attempted ?
                        <Badge bg={problem.verdict === "OK" ? "success" : "danger"}>{problem.verdict}</Badge>
                        :
                        // <Badge bg="dark">Not attempted</Badge>
                        "Not attempted"
                      }</td>
                    </tr>
                  ))}
                </tbody>

              </Table>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home