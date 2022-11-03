/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useCallback, useEffect, useRef, useState } from "react";
import testVideo from "./assets/test-video.mp4";
import "./App.css";

function App(): JSX.Element {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [videoSrc, seVideoSrc] = useState(testVideo);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => {
      ctx.drawImage(video, 0, 0, size.width, size.height);
    },
    [size.height, size.width]
  );

  const handleLoad = (): void => {
    setVideoLoaded(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVideoLoaded(false);
    const file = e.target.files?.[0];
    if (file !== undefined) {
      const src = URL.createObjectURL(file);
      seVideoSrc(src);
    }
  };

  useEffect(() => {
    videoRef.current?.load();
  }, [videoSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas == null || video == null || !videoLoaded) return undefined;
    const { height } = video.getBoundingClientRect();
    const { width } = video.getBoundingClientRect();
    canvas.height = height;
    canvas.width = width;
    setSize({ width, height });

    const ctx = canvas.getContext("2d");
    if (ctx == null) return undefined;
    let animationFrameId: number;

    const render = (): void => {
      draw(ctx, video);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, size.height, size.width, videoLoaded]);

  return (
    <div className="App">
      <div className="video-container">
        <video ref={videoRef} controls onLoadedData={handleLoad} loop>
          <source src={videoSrc} />
        </video>
        <canvas ref={canvasRef}>
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
      <div className="upload-container">
        <label htmlFor="input">
          Upload a video
          <input
            type="file"
            id="input"
            onChange={handleChange}
            accept="video/*"
          />
        </label>
      </div>
    </div>
  );
}

export default App;
