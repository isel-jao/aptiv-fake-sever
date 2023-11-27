import * as mqtt from "mqtt";
import { env } from "./env";

const client = mqtt.connect(env.BROKER_URL, {
  username: env.BROKER_USERNAME,
  password: env.BROKER_PASSWORD,
});

const ihmSerials = ["ihm001"];
const edgeDevices = [] as string[];

const publish = (topic: string, message: string) => {
  client.publish(topic, message, (err) => {
    if (err) console.error("Error publishing message:", err);
    else if (env.DEBUG)
      console.log(`Message published to topic "${topic}": ${message}`);
  });
};

const publishOperationSuccess = (serial: string, operationSuccess: boolean) => {
  const topic = `devices/${serial}/events`;
  const message = operationSuccess
    ? "OPERATION DONE"
    : "ERROR: something went wrong";

  publish(topic, message);
};

const publishDownTime = (serial: string, downTime: number) => {
  const topic = `devices/${serial}/data`;
  const message = JSON.stringify({
    machine: { downTime: downTime },
    device: {
      ip: "0.0.0.0",
      mac: "00:00:00:00:00:00",
    },
  });

  publish(topic, message);
};

const fakeOperation = async (serial: string) => {
  let downTime = 0;

  while (true) {
    let operationTime = Math.floor(Math.random() * 5 + 3);
    while (operationTime > 0) {
      publishDownTime(serial, downTime);
      operationTime--;
      downTime++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const operationSuccess = Math.random() > 0.2;
    publishOperationSuccess(serial, operationSuccess);
    if (operationSuccess) downTime = 0;
  }
};

const fakeEnergy = async (serial: string) => {
  const topic = `nxt/${serial}/energy/data`;

  while (true) {
    const message = JSON.stringify({
      id: serial,
      dt: new Date().toISOString(),
      voltage: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
      current: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
      power: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
      pf: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
      total: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    publish(topic, message);
  }
};

const fakeVibration = async (serial: string) => {
  const topic = `nxt/${serial}/vibration/events`;

  while (true) {
    const message = JSON.stringify({
      id: serial,
      dt: new Date().toISOString(),
      ax: Math.floor(Math.random() * 100),
      ay: Math.floor(Math.random() * 100),
      az: Math.floor(Math.random() * 100),
      rms: Math.floor(Math.random() * 100),
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    publish(topic, message);
  }
};

const fakeEnvironment = async (serial: string) => {
  const topic = `nxt/${serial}/environment`;

  while (true) {
    const message = JSON.stringify({
      tmp: Math.floor(Math.random() * 100),
      hum: Math.floor(Math.random() * 100),
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    publish(topic, message);
  }
};

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  ihmSerials.forEach((serial) => {
    fakeOperation(serial);
    fakeEnergy(serial);
  });
  edgeDevices.forEach((serial) => {
    fakeVibration(serial);
    fakeEnvironment(serial);
  });
});

client.on("error", (err) => {
  console.error("MQTT client error:", err);
});

client.on("close", () => {
  console.log("Disconnected from MQTT broker");
});

client.on("message", (topic, message) => {
  console.log(`Received message on topic "${topic}": ${message}`);
});
