import { Worker } from 'bullmq';
import axios from "axios";
import dotenv from "dotenv";
dotenv.config()

const worker = new Worker(
    'chess',
    async job => {
        switch (job.data) {
            case "game" : {
                const {gameId, player1, player2} = job.data;
                await axios.post(`${process.env.NEXT_BACKEND_URL}/game/add`, {
                    gameId,
                    player1,
                    player2
                })
            }
            case "move" : {

            }
        }
    },
    {
        connection : {
            url : process.env.REDIS_URL
        }
    }
);

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});