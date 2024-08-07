interface JoinSessionMessage {
  type: "joinSession";
  username: string;
}

interface LeaveSessionMessage {
  type: "leaveSession";
}

interface UpdateSongMessage {
  type: "songSelected";
  songId: string;
}

type Message = JoinSessionMessage | LeaveSessionMessage | UpdateSongMessage;

class WebSocketError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebSocketError";
  }
}

export {
  Message,
  WebSocketError,
  JoinSessionMessage,
  LeaveSessionMessage,
  UpdateSongMessage,
};
