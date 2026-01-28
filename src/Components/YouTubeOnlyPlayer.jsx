import { createReactPlayer } from "react-player/ReactPlayer";
import { canPlay } from "react-player/patterns";
import YouTubePlayer from "youtube-video-element/react";

const players = [
  {
    key: "youtube",
    name: "YouTube",
    canPlay: canPlay.youtube,
    player: YouTubePlayer,
  },
];

const ReactPlayer = createReactPlayer(players, players[0]);

export default ReactPlayer;
