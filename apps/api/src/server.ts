import { createApp } from "./app";

const app = await createApp();
await app.listen({ port: Number(process.env.PORT || 4000), host: "0.0.0.0" });
