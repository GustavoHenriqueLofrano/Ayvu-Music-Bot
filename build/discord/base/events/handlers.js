import { Constatic } from "../app.js";
export class BaseEventHandlers {
    static async handler(data, args) {
        const app = Constatic.getInstance();
        const { middleware, onError } = app.config.events;
        let isBlock = false;
        const block = (...selected) => {
            const tags = data.tags ?? [];
            if (selected.length === 0) {
                isBlock = tags.length === 0;
                return;
            }
            isBlock = selected.some(tag => tags.includes(tag));
        };
        const eventData = { name: data.event, args };
        if (middleware)
            await middleware(eventData, block);
        if (isBlock)
            return;
        await data.run(...args)
            .catch(err => {
            if (onError) {
                onError(err, eventData);
                return;
            }
            throw err;
        });
        if (data.once) {
            app.events.getEvents(data.event)?.delete(data.name);
        }
        ;
    }
    static register(client) {
        const app = Constatic.getInstance();
        const collection = app.events.collection.filter((_, key) => key !== "clientReady");
        for (const [key, events] of collection.entries()) {
            client.on(key, (...args) => {
                Promise.all(Array.from(events.values()).map(data => BaseEventHandlers.handler(data, args)));
            });
        }
    }
}
