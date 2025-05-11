import { Worker } from 'bullmq';
import axios from "axios";
import dotenv from "dotenv";
dotenv.config()

const worker = new Worker(
    'chess-queue',
    async job => {
        let res;
        try {
            switch (job.data.type) {
                case "game" : {
                    const {gameId, player1, player2} = job.data;
                  res = await axios.post(`${process.env.NEXT_BACKEND_URL}/game/add`, {
                        gameId,
                        player1,
                        player2
                    })
                    break
                }
                case "game_over" : {
                    const {result, game_id} = job.data
                    if (result === "draw") {
                       res= await axios.post(`${process.env.NEXT_BACKEND_URL}/game/result`, {
                            result : "DRAW",
                            game_id
                        })
                    }
                    else if (result === "resign") {
                        res= await axios.post(`${process.env.NEXT_BACKEND_URL}/game/result`, {
                            result : "RESIGN",
                            loser : job.data.loser,
                            game_id
                        })
                    }
                    else if (result === "checkmate") {
                      res=  await axios.post(`${process.env.NEXT_BACKEND_URL}/game/result`, {
                            result : "CHECKMATE",
                            winner : job.data.winner,
                            game_id
                        })
                    }
                    else if (result === "stalemate") {
                       res=  await axios.post(`${process.env.NEXT_BACKEND_URL}/game/result`, {
                            result : "STALEMATE",
                            game_id
                        })
                    }
                    break
                }
                case "move" : {
                    const {piece, from, to, gameId, moveType , turnNumber} = job.data
                  res=  await axios.post(`${process.env.NEXT_BACKEND_URL}/move/add`, {
                        piece, from, to, gameId, moveType , turnNumber
                    })
                    break
                }
                default : {
                    break
                }
            }
        } catch (e) {
            console.log(e);
        }
    //    console.log(res);
    },
    {
        connection: {
            url: process.env.REDIS_URL
        }
    }
);

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});