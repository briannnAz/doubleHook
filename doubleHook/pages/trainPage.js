import Head from "next/head";
import styles from "../styles/Home.module.css";
import { styled } from "@mui/material/styles";
import moves from "../public/moves.json";
import { Button, linearProgressClasses } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 30,
  borderRadius: 20,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

export default function Home() {
  // Generate and Save current Combo
  const [comboGenerated, setCombo] = useState();

  // Generate and Save whether game is being played or not
  const [gameState, setGameState] = useState({ playing: false, played: false });

  // Generate and store previous combos for either review or use
  const [generatedList, setGenerated] = useState([]);

  // Generate and store Clock used for progress time
  const [clockTime, setTime] = useState(0);

  // Time Function
  function countTime() {
    let count = 0;

    // Set Interval ran every Second to count time for progress bar
    // Interval Cleared after 60 seconds
    let timer = setInterval(() => {
      setTime(count + 1);
      count++;
      if (count >= 60) clearInterval(timer);
    }, 1000);
  }

  let comboList = [];

  // Used to Create Randomly selected a strike from 1 - 6
  function numGenerator() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Generates actual Combo
  function comboGenerator() {
    // Get combo length
    const comboLength = numGenerator();
    let count = 0;

    // Generate a combo array for a random combo length
    let generated = [];

    while (count !== comboLength) {
      generated.push(numGenerator());
      count += 1;
    }
    let comboString = "";

    // Create a string for Display based on the randomly created combo
    generated.map((move) => {
      comboString = comboString.concat(`${move}    -    `);
    });

    // Set Display & Storage Variables
    setCombo(comboString);
    comboList.push(comboString);
    setGenerated(comboList);
    return comboString;
  }

  // Create Function for timing combos every 5 seconds for 1 minute
  function timedCallout() {
    // Resets Progress Timer
    setTime(0);
    countTime();

    // Sets game back to playing state
    setGameState({ playing: true, played: false });
    setGenerated([]);
    comboGenerator();
    let total = 11;

    // Call function every 5 seconds
    while (total !== 0) {
      setTimeout(comboGenerator, (12 - total) * 5000);
      total -= 1;
    }

    // End game and set to played state after timer/ combo generation is done
    setTimeout(setGameState, 12 * 5000, { playing: false, played: true });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Double Hook</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Welcome to <a href="#">DOUBLE HOOK!</a>
        </h1>

        <p className={styles.description}>
          Get started testing your <code>BOXING SKILL</code>
        </p>

        {!gameState.playing && !gameState.played && (
          <Button onClick={timedCallout}>Start</Button>
        )}

        {gameState.playing && (
          <div className={styles.grid}>
            <a className={styles.card}>
              <h3>Combo &rarr;</h3>
              <p className={styles.description}>
                Current: <br />
                {comboGenerated}
              </p>
            </a>
          </div>
        )}

        {gameState.played && (
          <div className={styles.grid}>
            <a className={styles.card}>
              <h3>Combo &rarr;</h3>
              <p className={styles.description}>{"FINISHED!!"}</p>
            </a>
          </div>
        )}
        {gameState.played ||
          (gameState.playing && (
            <Box sx={{ width: "100%" }}>
              <BorderLinearProgress
                variant="determinate"
                value={(100 * clockTime) / 60}
              />
            </Box>
          ))}

        {clockTime === 60 && gameState.played && (
          <Button onClick={timedCallout}>Replay</Button>
        )}
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
        resultBox {
          width: 100%;
          display: flex;
          flex-direction: row:
          justify-content: space-around;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
