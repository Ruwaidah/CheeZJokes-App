import React, { useState, useEffect } from "react";
import axios from "axios";
import JokeWithFunc from "./JokeWithFunc";
import "./JokeList.css";

/** List of jokes. */

const JokeListWithFunc = () => {
  const numJokesToGet = 5;
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getJokes();
  }, []);

  /* retrieve jokes from API */

  const getJokes = async () => {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        setJokes([...jokes, res.data]);
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }

      setIsLoading(false);
      setJokes(jokes);
    } catch (err) {
      console.error(err);
    }
  };

  /* empty joke list, set to loading state, and then call getJokes */

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  /* change vote for this id by delta (+1 or -1) */

  const vote = (id, delta) => {
    const newJokesArr = jokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );
    setJokes(newJokesArr);
  };
  console.log(jokes);

  /* render: either loading spinner or list of sorted jokes. */

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  console.log(sortedJokes);
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {jokes.map((j) => (
        <JokeWithFunc
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
};

export default JokeListWithFunc;
