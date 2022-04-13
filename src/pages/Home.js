import React, { useEffect, useState } from 'react'
import apiConfig from '../configs/apiConfig';
import problems from '../data/problems';

function Home() {
  const [username, setUsername] = useState("SahilS");
  const [topic, setTopic] = useState("all");
  const [userData, setUserData] = useState({});


  useEffect(() => {
    fetch(`${apiConfig.url}/${username}/${topic}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUserData(data);
      })
  }, []);
  return (
    <div>Home
      {
        Object.keys(userData).map((topic) => (
          <div>
            <h1>{topic}</h1>
            {userData[topic].map(problem => (
              <div>
                <a target="_blank" href={problem.url}>{problem.url}</a>
                {problem.attempted ? (problem.verdict) : ("Not Attempted")}
              </div>
            ))}
          </div>
        ))
      }
      {/* {problems.data.map(topic => (
        <div>
          <h1>{topic.topic}</h1>
          {topic.data.map(problem => (
            <h3>{problem}</h3>
          ))}
        </div>
      ))} */}
    </div>
  )
}

export default Home