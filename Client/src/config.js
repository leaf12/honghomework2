export const config = {
  iceServers: [
    {
      iceTransportPolicy: "relay",
      url: "stun:global.stun.twilio.com:3478?transport=udp",
      urls: "stun:global.stun.twilio.com:3478?transport=udp",
    },
    {
      iceTransportPolicy: "relay",
      url: "turn:global.turn.twilio.com:3478?transport=udp",
      username:
        "015d5293a0ecb39006dd61708359c7ab196248418e4409e777c2b708590912ff",
      urls: "turn:global.turn.twilio.com:3478?transport=udp",
      credential: "EDsTIMdiD44e2nzPlvjxWj7Ga1v7RNmDeerIBfsJ3Gw=",
    },
    {
      iceTransportPolicy: "relay",
      url: "turn:global.turn.twilio.com:3478?transport=tcp",
      username:
        "015d5293a0ecb39006dd61708359c7ab196248418e4409e777c2b708590912ff",
      urls: "turn:global.turn.twilio.com:3478?transport=tcp",
      credential: "EDsTIMdiD44e2nzPlvjxWj7Ga1v7RNmDeerIBfsJ3Gw=",
    },
    {
      iceTransportPolicy: "relay",
      url: "turn:global.turn.twilio.com:443?transport=tcp",
      username:
        "015d5293a0ecb39006dd61708359c7ab196248418e4409e777c2b708590912ff",
      urls: "turn:global.turn.twilio.com:443?transport=tcp",
      credential: "EDsTIMdiD44e2nzPlvjxWj7Ga1v7RNmDeerIBfsJ3Gw=",
    },
  ],
  serverHostName: "localhost",
  serverPort: "3001",
};
