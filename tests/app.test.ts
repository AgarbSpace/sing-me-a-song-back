import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import createVideoFactory from "./factories/createVideoFactory.js";
import { jest } from "@jest/globals"
import { recommendationRepository } from "../src/repositories/recommendationRepository.js";
import { recommendationService } from "../src/services/recommendationsService.js";

let insertedVideo = {
    id: 0,
    name: "",
    score: 0,
    youtubeLink: ""
};

let createdVideo = {
    name: "",
    youtubeLink: ""
}

describe("POST /recommendations", () => {
    it("should return status 201 and persist data given a valid form", async () => {
        const video = await createVideoFactory();
        createdVideo = {
            name: video.name,
            youtubeLink: video.youtubeLink
        }
        const response = await supertest(app).post("/recommendations").send(video);
        const registeredVideo = await prisma.recommendation.findUnique({
            where: {
                name: video.name
            }
        });
        insertedVideo = {
            id: registeredVideo.id,
            name: registeredVideo.name,
            score: registeredVideo.score,
            youtubeLink: registeredVideo.youtubeLink
        }

        expect(registeredVideo).not.toBeNull();
        expect(response.status).toBe(201);
    }); 

    it("should throw an error given a registered name video", async () => {
        const video = createdVideo;
        const response = await supertest(app).post("/recommendations").send(video);
        expect(response.status).toBe(409);
    });

    it("should return status 422 given a invalid form data", async () => {
        const video = await createVideoFactory();
        delete video.name;
        const response = await supertest(app).post("/recommendations").send(video);
        expect(response.status).toBe(422);
    });
});

describe("POST /recommendations/:id/upvote", () => {
    it("should increment a score of video and return status 200", async () => {
        const response = await supertest(app).post(`/recommendations/${insertedVideo.id}/upvote`);
        const video = await prisma.recommendation.findUnique({
            where: {
                id: insertedVideo.id
            }
        })
        expect(video.score).toBe(insertedVideo.score + 1);
        expect(response.status).toBe(200)
    });
});

describe("POST /recommendations/:id/downvote", () => {
    it("should decrement a score of video and return status 200", async () => {
        const response = await supertest(app).post(`/recommendations/${insertedVideo.id}/downvote`);
        const video = await prisma.recommendation.findUnique({
            where: {
                id: insertedVideo.id
            }
        })
        expect(video.score).toBe(insertedVideo.score);
        expect(response.status).toBe(200)
    });
});

describe("GET /recommendations", () => {
    it("should return the 10 last recommendations", async () => {
        const response = await supertest(app).get("/recommendations");
        console.log(response);
        expect(response.body.length).toBe(10);
        expect(response.status).toBe(200);
    })
});

describe("GET /recommendations/:id", () => {
    it("should return one registered recommendation", async () => {
        const response = await supertest(app).get(`/recommendations/${insertedVideo.id}`);
        expect(response.body).not.toBeNull();
        expect(response.status).toBe(200);
    })
});

describe("GET /recommendations/top/:amount", () => {
    it("should return the number of recommendations ordered by score", async () => {
        const response = await supertest(app).get(`/recommendations/top/${1}`);
        expect(response.body).not.toBeNull();
        expect(response.status).toBe(200);
    });
});

describe("GET /recommendations/random", () => {
    it("should return 200 ", async () => {
        const response = await supertest(app).get(`/recommendations/random`);
        expect(response.body).not.toBeNull();
        expect(response.status).toBe(200);
    });
});

describe("get random", () => {
    it("should return videos upper 10 score", async () => {
        jest.spyOn(recommendationService, "getRandom").mockResolvedValue({id: 0, name: "", score: 0, youtubeLink: ""});
        const result = recommendationService.getScoreFilter(0.6);
        expect(result).toBe("gt");
    });
    it("should return videos under 10 score", async () => {
        jest.spyOn(recommendationService, "getRandom").mockResolvedValue({id: 0, name: "", score: 0, youtubeLink: ""});
        const result = recommendationService.getScoreFilter(0.8);
        expect(result).toBe("lte");
    });
});

describe("remove video", () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should remove a video", async () => {
        const videoForm = await createVideoFactory();
        await prisma.recommendation.create({
            data: {
                name:videoForm.name,
                youtubeLink: videoForm.youtubeLink,
                score: -5
            }
        })
        const createdRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: videoForm.name
            }
        });
        await recommendationService.downvote(createdRecommendation.id);
        const removedRecommendation = await prisma.recommendation.findUnique({
            where: {
                id: createdRecommendation.id
            }
        })
        expect(removedRecommendation).toBeNull();
    });
});

describe("error handler middleware", () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return satus 500", () => {
        
    });

})