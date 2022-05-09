import { faker } from "@faker-js/faker";

export default async function createVideoFactory(){
    return {
        name: faker.name.findName(),
        youtubeLink: "https://www.youtube.com/watch?v=kHLHSlExFis&ab_channel=ArianaGrandeVevo"
    }
}