import { prisma } from "../src/database.js";

async function createVideos(){
    await prisma.recommendation.createMany({
        data: [
                {
                name: "Ariana Grande - 7 rings",
                youtubeLink: "https://www.youtube.com/watch?v=QYh6mYIJG2Y",
                score: 8
                },
                {
                name: "Ariana Grande - positions",
                youtubeLink: "https://www.youtube.com/watch?v=tcYodQoapMg",
                score: 6
                },
                {
                name: "Ariana Grande - Into You",
                youtubeLink: "https://www.youtube.com/watch?v=1ekZEVeXwek",
                score: 10
                },
                {
                name: "Ariana Grande - no tears left to cry",
                youtubeLink: "https://www.youtube.com/watch?v=ffxKSjUwKdU",
                score: 9
                },
                {
                name: "Ariana Grande - breathin",
                youtubeLink: "https://www.youtube.com/watch?v=kN0iD0pI3o0",
                score: 15
                },
                {
                name: "K/DA – MORE",
                youtubeLink: "https://www.youtube.com/watch?v=3VTkBuxU4yk",
                score: 9
                },
                {
                name: "Ariana Grande - One Last Time",
                youtubeLink: "https://www.youtube.com/watch?v=BPgEgaPk62M",
                score: 14
                },
                {
                name: "Anitta - Envolver",
                youtubeLink: "https://www.youtube.com/watch?v=hFCjGiawJi4",
                score: 15
                },
                {
                name: "Anitta - Gata",
                youtubeLink: "https://www.youtube.com/watch?v=_f-NiYTsWSo",
                score: 12
                },
                {
                name: "Anitta - I'd Rather Have Sex",
                youtubeLink: "https://www.youtube.com/watch?v=Yt0EQaxRp1g",
                score: 13
                },
            ]
    })
}

createVideos()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });