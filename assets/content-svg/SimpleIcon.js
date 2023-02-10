import React from 'react';
import { Circle, G, Path, Svg } from 'react-native-svg';

function SimpleIcon(props) {
  const width = props.size || 360;
  const height = (props.size / 36) * 45 || 450;
  const color = props.color || '#fe94aa';
  return (
    <Svg width={width} height={height} data-name="Layer 1" viewBox="0 0 360 450">
      <Path class="cls-1" fill="#e4e4e5" d="M-30.96 681.48V-29.9h422v711.38z" />
      <Path
        class="cls-2"
        fill="#caa8ac"
        d="M104.74 224.07c.82-.54 1.07-1 0 0zM238.53 223.51c-.25.21-.35.34-.59.56a15.48 15.48 0 01-.23 2.24zM139.9 308.54l-.65.44c.31.21.46.57.65-.44zM107.28 226.39a5.14 5.14 0 00-1.68 1.5 14.82 14.82 0 011.68-1.5zM127.24 144.31l.45-.35c-.45.15-.9.33-1.38.46zM128.9 142c2.67-1.21-.21 1.15-1.21 2a26.66 26.66 0 008.37-4.85c-.52-.81-5.58 2.66-7.16 2.85zM77.78 117.59l1-1.06a6.62 6.62 0 00-1 1.06zM143.5 256.76c-.48.44-1.07.88-1.5 1.29a5.09 5.09 0 001.5-1.29zM141.7 84.71l.16-1.66c-.41.83-.38 1.32-.16 1.66zM237.71 226.31l-.34 1.08a4.72 4.72 0 00.34-1.08zM167.48 247.51a1.79 1.79 0 001.2.48l.28-.2zM293.2 368.93a1.52 1.52 0 00-.58-.36 7.85 7.85 0 01-2.56 1.84 5.93 5.93 0 003.14-1.48zM293.55 200.93c0 .22-.09.62 0 .76 2.17-1.88 7-7.6 13-15l-1-1.6q-6.02 7.91-12 15.84z"
      />
      <Path
        class="cls-2"
        fill="#caa8ac"
        d="M151 325.07c2.36-2.85 4.7-5.4 7-7.77s4.43-4.47 6.61-6.63L161.2 316l-3.44 5.51c-2.3 3.75-4.57 7.7-6.64 11.89a87.24 87.24 0 00-5.39 13.39A66.13 66.13 0 00143 361.7l-2 31.08 30.41-7.73a107.57 107.57 0 0026-10.61A203.58 203.58 0 00217 361.79c3-2.12 5.77-4.18 8.65-6.31s5.8-4.33 8.78-6.62 6-4.64 9.13-7.13l4.74-3.81 2.43-2 1.23-1 .31-.26.15-.12.12-.15v.38l-.22.28-.86 1.12a9 9 0 001-.63l.44-.35.06-.11a4.23 4.23 0 00.23-.71 7.42 7.42 0 011.25-2.56 14.53 14.53 0 013.93-3.52 12 12 0 012.76-1.33 4.39 4.39 0 011.27-.2.77.77 0 01.6.24 2.11 2.11 0 01.43 1.31 5.28 5.28 0 01-.57 2.26q-.46 1.14-1 2.25a30.7 30.7 0 01-2.12 4l-.39.35c0 .1.22 0 .28.05s0 .28-.55.87a21.09 21.09 0 002.58-3.78 3.72 3.72 0 011.58.81 4.16 4.16 0 01.95 2.92 2.69 2.69 0 01-1.81 1.11v1.04l-.05 1.65-.19 6.89-.11 6.9v6.76a45.19 45.19 0 002 11.81 28.62 28.62 0 004.74 8.25 27.7 27.7 0 003.56 3.63c.32.28.65.56 1 .83s.78.58 1.18.85a25.57 25.57 0 002.56 1.59 28.52 28.52 0 006.14 2.45 31.91 31.91 0 003.31.69c1.07.14 2.17.24 3.24.29a27.78 27.78 0 004.14-.48c.59-.12 1.21-.25 1.73-.39s1-.28 1.45-.43a24.57 24.57 0 004.21-1.82 17.15 17.15 0 003.95-2.94l.54-.59.41-.52a3 3 0 00.29-.45l.23-.41a13.83 13.83 0 011.12-1.71c1.83-2.38 5.38-5.23 15.34-9.8-8.78 1.42 8.08-7.44 4.87-7.51 1.16-.22 3.61-1 5.62-1.56 10.77-7.16 30.95-20.84 35.14-25.52 0 0-46.79 20.58-60.29 24.65 16-8.82 3.86-2.89.2-2l-.58 1.37a37.42 37.42 0 01-9.69 3.79c-1.05.24-2 .38-2.92.62s-2 .62-3.33 1.06c.07.16.31.28.55.41.19-.19.37-.39.54-.59.65.08.52.46 0 .95.17.17.17.41-.29.77a4.58 4.58 0 01-1.17.59 6.94 6.94 0 01-2.49.39c.29-.07.55-.18.81-.27a6.23 6.23 0 01-2.71-.17 7.08 7.08 0 01-2.61-1.43 8.39 8.39 0 01-2.77-5.16 8.72 8.72 0 01-.1-1.44V361.03c.05-.71.09-1.39.13-2 .09-1.29.18-2.43.24-3.28h1.81c-.8-2.05-.74-6.47-.1-12.1.16-1.42.35-2.87.58-4.39s.48-3.12.77-4.8c.58-3.36 1.27-7 2.07-10.88s1.73-8 2.51-12 1.41-7.84 1.89-11.25c.94-6.81 1.36-11.82 1.44-14.28a6.44 6.44 0 00-1-4.94 6.21 6.21 0 00-3.27-2.43 5.19 5.19 0 00-3.73.47c-1.09.54-2.17 1.18-3.32 1.83l-3.49 2c-4.8 2.86-10 6-15.54 9.17-10.45 7.21-13.31 8.53-14.87 8.68s-1.75-.81-8 2.77c-3.83 2.45-5.54 3.68-6 4.17s.41.26 1.5-.12c2.22-.77 5.38-2 2.61.07L236 309l-1.14.64-.57.32-.46.24-3.66 1.89-7.33 3.8c7.52-5.77 2.73-3.62.91-3.16-11.55 8-31.52 18.61-32.67 23.75-7.93 4.48-12 5.78-14.83 6.69s-4.57 1.26-7.61 2.43c.56-.07 1.26-.18 2-.32l2.21-.5c1.43-.35 2.62-.59 2.81-.28-3.27.79-3.89 1.12-3.43 1.29a4.06 4.06 0 001.38 0 10.56 10.56 0 002-.46c-2.34 1.72-7.48 3.83-13.34 4.71l16.82 13.85a31.58 31.58 0 011.38-4.63 46.21 46.21 0 012.36-4.89 99.22 99.22 0 016.59-9.88c2.35-3.18 4.6-6.17 6.16-8.6s2.35-4.18 2-4.93l.6.4c-1-3.87-5.75-1.9-2.58-9.51l4.12-3.7 3.54-7.41c3.89-3.92 3-1.28 3.31-1.07 6.38-11.65 18.36-25.75 28.12-38.4-5.51 3-11 6-16.48 9 9.38-10 26.93-27.28 26.51-30.95l7.05-4.85c10.24-9.21 12.72-13.24 13.55-16s.11-4.16 4-7.94l10.74-8.83-8.42 10.57a299 299 0 0121.92-20.45v-.14c-.56.5-1 .78-1.17.74l1.13-1.5c-.1-2.19 3.54-8.3 9.69-15.56.69-.78 1.35-1.56 2-2.32l-18.04-18.54c-9.65 7.51-17 15.35-34.53 25.48l-2.4 5.72-13.93 8.66-1.49-1.88c12.29-9.48 34.4-27.95 50.27-40.63l22.72 23.36-1.22 1.5.61 1 1.45-1.78L284.41 161c-9 7.24-18.39 15.78-24.46 20.26-3.38 2.05-12.82 6.29-8.09.52l-4.46 6.49c-31.8 25.33-31.93 25.58-67 49.66l3.64-1.32c-6.17 5.75-12.35 11.48-15.39 11.39-10.14 7.71-20.63 15.36-30.43 22s-18.26 11.58-25 14c-.35 1.34-.71 2.68-1.1 4-2 1.12-4.92 1.48-7.28 2a9.39 9.39 0 00-3 1.1 2.92 2.92 0 00-1.32 2.35l-1 .56-.23.14-.12.08 7.61 19.2v.05a1.17 1.17 0 01.07.35c0 .08 0-.12.12-.18s0 0-.11 0-.12-.06.15.12l.09.08L122.25 327v-.07l.2-.28.4-.55 1.59-2.24c2.43-2.53 4-4.86 5.9-7.17.46-.57.93-1.15 1.44-1.72s1.08-1.13 1.68-1.69a35.87 35.87 0 014.26-3.44l1.28-.86a.44.44 0 00-.23-.1c5.95-5.32 5.56-5.69 5.31-6.29s-.23-1.35 6.91-7.24c2.79-1.36 3.36-3.14 4.11-5.3a14.89 14.89 0 015.19-7.61c3.11-1.11 6.29-2.17 9.46-3.22a63.85 63.85 0 008.13-6.45 80.11 80.11 0 005.91-6.2 157.85 157.85 0 0117.61-17.67c9.77-6.66 16.32-7.81 12.5-.37 5.58-9.84 2.07-5.05 11.57-15.84 2.67-.32 1.75.93.29 4.05 5.35-3.52 6.6-5.16 7.4-6.62s1.16-2.85 4.78-6.05c.15-4-.57-9.58 1.59-11.86l-3.35 1.89a147.94 147.94 0 0110.66-12 123.93 123.93 0 0112.91-11.61l.71 1.35 8.43-9.67 1.9.71c4.08-4.58 8.06-9.29 12.08-13.93l-2.08 1.53c1.41-1.62 4.22-5.37 7.51-9.3 1.63-2 3.4-4 5.08-5.92s3.25-3.8 4.71-5.27l.62.87c2.38-2.3 4.59-4.63 6.68-7l-27.62-29.71c-16 8.88-28.21 20.5-46.67 32.86l1.7-3.62c-8.52 3.07-.26 4-9.63 8.89l-1.85-1.87c-5.89 7.89-10.39 5.95-16.43 8.37l4.35 1.19-10.42 6c-11.65 6.34-9.12.9-8.48-1.64l-6.05 7.18-3.11-1.51c-3.57 6.53-5.8 3.16-14.37 11.1-1.42-.42.65-2.57-2.88-.8l-13.48 14.06 8.5-7.93 1.26 4.41c-8.09 9.38-13.71 8.59-20.11 14.35l4.16-4.35c-11 8.64-12.61 7.52-19.66 11.11 2.47-.69 6.23-1.77 1.88 1.85-3.29 2.52-2.72 0-6.22 1.78.85 2.93-6.55 9.79-14.8 13.75a1.48 1.48 0 01.14-1.39c-1.65 1.69-2.21 3-5.93 4.66l.14-4-4.66 6.9c-4.75 2.18-9.64 8.36-10.31 6.18l2-2.18L54.26 261l-1.92-1.82c-1 4.62-15.05 9.88-15.12 13l31.07 32.8a1.1 1.1 0 00-.72-.77 23.61 23.61 0 005.06-4.86c.88-1.05 1.77-2.18 2.64-3.31s1.83-2.19 2.69-3.21c3.51-4.07 6.34-6.9 6.84-3.71 1-1.09 2-2.11 3-3.13s1.9-2 2.81-3c1.82-2 3.44-4 5.18-5.83 3.42-3.75 6.46-7.49 10-11.15 1.71-1.85 3.48-3.72 5.34-5.62s3.94-3.78 6.12-5.73c1.1-1 2.22-2 3.4-3s2.46-2 3.76-3c2.63-2.05 5.4-4.17 8.58-6.34a46.51 46.51 0 0010.16-5.36c4-2.56 8.28-5.73 12.86-9.21 9.09-6.93 18.92-15.09 27-21.41a575.53 575.53 0 0041.63-40.81l-30.87-35.81a817.428 817.428 0 01-37.52 29c-11.4 4.12-23.35 12.51-35.56 21s-24.66 17.22-36.5 22c-1.63 1.81-3.24 3.66-4.89 5.45a83.3 83.3 0 00-13.1 5.47c-2.3 1.15-4.64 2.42-7.06 3.71l-3.66 2-1.85 1-.94.52-.23.13h-.06l9.26 17.76a.36.36 0 01.05.09.94.94 0 01.07.27c0 .09 0 0 .06-.12s.09-.08 0 0a.35.35 0 01-.16 0h.08l.13.08a.24.24 0 01.09.06c-13.79-11.27 18.65 15.53 15.32 12.76l.16-.19 2.59-3 2.65-3a36.74 36.74 0 012.8-2.94c2-1.89 4-3.74 6.12-5.52 1-.91 2.21-1.69 3.33-2.51s2.3-1.58 3.46-2.32l2.22-2.88c.67-.82 1.3-1.5 1.83-2.09 1.06-1.16 1.79-1.9 2.26-2.34a3.44 3.44 0 01-3.68.37 46.86 46.86 0 004.71-3.31l2.52-2 2.54-1.83c3.28-2.3 6-3.84 6.48-2.36l-1.12 1.25c.26.74 1.32.29 2.85-.84s3.71-2.88 6-4.83l3.6-3c1.26-1 2.53-2 3.77-2.82a25.4 25.4 0 016.75-3.7l-5.2-.26c3.54-2.29 7.25-4.59 10.87-6.89l-2.49 2.47c16.65-14.88 31.47-25.12 45.21-35.32l10.18-7.69 9.92-8.12c3.24-2.89 6.45-5.9 9.71-9 3.15-3.26 6.27-6.74 9.44-10.37l-27.27-31.1c-7.6 5.24-15.61 11.24-24.25 18.44 4-6.77-7.78 7.25-10.44 4.43-13.82 3.29-20.24 14.37-28.76 21.48.11.16.12.41-.25 1l-16.35 10.1c7-10.31-9.41 10.89-2.82 1.71-22 12.14-46.14 27.9-71 44.39l-9.35 6.22-4.7 3.12-2.35 1.57c-1.35-2 11.57 17.81 6.12 9.42v.06l.09.12a1.75 1.75 0 01.16.27 2.82 2.82 0 01.27.61 2.06 2.06 0 01.22.69.22.22 0 010 .1v.07c0-.08 0 0 .05-.21a1 1 0 01.06-.14 1.65 1.65 0 01.09-.22 3 3 0 01.21-.3c.13-.15.14-.11 0 0a2.18 2.18 0 01-.34.14 1.12 1.12 0 01-.22.05.4.4 0 01-.17 0h-.19.12l.12.06a1.61 1.61 0 01.35.16l.14.09.06.05.15.09a3.16 3.16 0 01.53.39l.22.21.1.11c16 15.29 4.44 4.22 8 7.63l.05-.05c1.12-1.19 2.29-2.37 3.49-3.55 2.42-2.37 5-4.73 7.66-7.12s5.5-4.83 8.27-7.21q8.36-7.16 16.77-13.91l-2.72.69c11.27-9.23 24.3-22.01 34.1-27.52s16.8-17.94 20-20.85c8.07-9.42 19.36-13.22 15.17-10 9.71-8.77 16.4-20 31.6-30.07 2.29-.24 6.6-3.67 11.55-8.19l-14.58-27.32c-7.28 2.68-15.74 6.43-22.47 9.49s-11.76 5.07-12.57 3.65v.43c-11.79 3.18-22.27 8.78-32.56 14.92S88.64 112.92 77 118.88a6.27 6.27 0 01.81-1.29 373.94 373.94 0 00-33.12 42.64c7.09.72 14 1.5 20.86 2.61a342.15 342.15 0 0141.26-14.15A347 347 0 01188.22 109l-21.75-40.43-16.95 14.62-76.85 57.07c-14.92 12.58-29.83 25.36-44.56 38.56-3.73 3.34-7.63 6.89-11.58 10.77l-3 3-1.49 1.55-.37.39-.65.72-.68.79c-.88 1.06-1.73 2.16-2.51 3.3a37.06 37.06 0 00-2.25 4c-.34.69-.66 1.39-1 2.09s-.55 1.52-.8 2.29a35.46 35.46 0 00-1.16 4.73 40 40 0 00-.44 4.89 34.18 34.18 0 004.59 17.59 34.72 34.72 0 0012.09 12.24 33.79 33.79 0 0018.19 4.74 34.28 34.28 0 0017-5.25l.57-.35.19-.13.37-.25.76-.5 1.52-1 12.11-8 96.93-64.06 12-12c15-7.14 30.42-16.6 46.1-26.88l-33-37.64a231.61 231.61 0 01-33 31.49A318 318 0 01118.9 154l.84 3.05c-11.4 8.07-11.73 6.13-14.9 7.7-4.45 3.12-9 6.5-13.43 9.81-2.25 1.64-4.48 3.47-6.72 5.2l-3.35 2.63-1.68 1.32-1.66 1.37-6.64 5.59-1.65 1.4-1.63 1.49-3.25 3-3.24 3L60 201c-.54.51-1 1.06-1.58 1.59l-6.3 6.41-1.56 1.61c-.52.55-1 1.14-1.5 1.7l-3 3.44-3 3.44-1.44 1.81-.18.21-.46.57c-.35.46-.69.93-1 1.4a26.18 26.18 0 00-4.6 14.48 25.4 25.4 0 00.24 3.92c.09.64.2 1.29.33 1.92s.29 1.21.46 1.81a26.29 26.29 0 0028.83 18.8 28.15 28.15 0 003.73-.8 25.07 25.07 0 003.29-1.2c.53-.23 1.05-.48 1.56-.74l.15-.08.23-.12.45-.25 3.61-2c2.4-1.31 4.82-2.6 7.21-3.94 9.6-5.29 19.08-10.76 28.49-16.31a1240.9 1240.9 0 00107.41-71.61l-29.73-34.48c-14.12 14.11-29.52 27.12-45.31 39.64s-32 24.56-47.93 36.94a97.7 97.7 0 00-10 7.14c-2 1.59-4.1 3.31-6.27 5.1l-3.27 2.72-3.34 2.88-6.42 5.59-5.88 5.26c-1.84 1.62-3.53 3.07-5 4.27a44.18 44.18 0 01-3.77 2.88l-6.05 7.36q-3 3.78-6 7.6l-3 3.8-2.91 3.94-5.87 7.87L64.5 311.3c21.12-16.13 43.39-31.34 65-45.71l-1 1.07 14.33-10.43c.76-.22 1 0 .69.53 15.06-13.41 42.69-28.79 63.69-41.39l-1 1.06 96.42-63.54-34.09-36.64c-13.84 18.87-29.82 36.51-47 53.52s-35.62 33.4-54.41 50.12-38 33.78-56.65 52.31l-6.94 7.08c-2.31 2.38-4.67 4.69-6.91 7.18s-4.55 4.91-6.82 7.37l-1.71 1.85-.43.46-.21.23-.11.11v.06l-.44.52a29 29 0 00-2.2 2.94 27.56 27.56 0 00-1.8 3.46 25.58 25.58 0 00-1.29 3.82 24.67 24.67 0 00-.7 4 26.31 26.31 0 0013.54 25.49 29.41 29.41 0 003.71 1.67 27.4 27.4 0 004 1.09 26.05 26.05 0 008.2.22c.66-.08 1.34-.19 2-.32s1.18-.28 1.77-.45 1.17-.35 1.75-.55l.88-.33.7-.28c3.77-1.45 7.35-3.09 10.85-4.81s6.8-3.57 10-5.46c6.42-3.8 12.39-7.83 18-11.83 3.34-2.17 6.58-4.39 9.74-6.6s6.22-4.41 9.34-6.68q9.33-6.78 18.72-14c12.54-9.63 25.19-19.77 38-30.14 25.64-20.75 52-42.42 79.38-62.76l-36.69-37.72q-3.84 4.4-7.73 8.74t-7.78 8.69c-2.79 2.28-10.93 11.63-21.42 24.75s-23.35 30-35.71 47.28-24.24 34.72-33.39 48.78c-2.29 3.51-4.42 6.79-6.32 9.8l-5.14 8.14c-3.09 5-5.41 9.2-6.32 11.07z"
      />
      <Path
        class="cls-2"
        fill="#caa8ac"
        d="M262.27 339.15V339c-1.27.21-.8.29 0 .15zM235.27 270.49l-.61.78 3.64-2zM230.16 307.49c-7.6 5.06-7.76 5.55-6.43 5.2a42.77 42.77 0 006.43-5.2zM334.2 365.52c4.12-2.45 2.18-2.12-.66-1.35l-6.91 4.57c2.44-1.17 5.07-2.02 7.57-3.22zM308.59 361.32l.73-1.65c-2.26 1.7-1.97 1.95-.73 1.65z"
      />
      <G class="cls-3" isolation="isolate">
        <Path
          class="cls-4"
          fill="#fff"
          d="M155.68 82.89l175.65 1.03 5.71-57.44-306-6-4 65 116-2.4 13 18.4-.36-18.59z"
        />
      </G>
      <Path
        class="cls-5"
        fill={color}
        d="M124.18 275c0 1.77-15.08 5.77-22.62 7.54-6.92 1.63-20.59 6.63-35.49 6.74-3.2-10.48-9.22-12.2-11.5-12.46.55-.32 1.1-.66 1.63-1l6.85-4.61 3.42-2.3 3-2 .34-.24c1.12-.76 2.22-1.55 3.29-2.38.74-.57 1.48-1.16 2.2-1.77 1-.82 2-1.67 2.89-2.56s2.11-2 3.12-3.1c.84-.89 1.66-1.81 2.46-2.75.49-.58 1-1.17 1.45-1.77l.23-.29 2.46-3.1 1.8-2.27 2.55-3.21 1.74-2.24 2.78-3.52L98.9 235a14.18 14.18 0 0112.47-.11 6.78 6.78 0 011.71 1.16 7.12 7.12 0 011.36 1.73 6.89 6.89 0 01.87 3.36v1.4a7 7 0 006.73-2.15l1.24-1.38-1 5.42a44.54 44.54 0 00-.77 8.31 45.41 45.41 0 00.94 9.21c.27 1.26.47 2.54.63 3.82l1 8.31z"
      />
      <Path
        class="cls-6"
        fill="#dd5e5e"
        d="M123.29 239l-1.29 1.43a7 7 0 01-6.73 2.15v-1.4a6.89 6.89 0 00-.87-3.36 7.12 7.12 0 00-1.36-1.73l.36-.09a13.14 13.14 0 017.25.15 3.78 3.78 0 012.6 2.88z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M124.62 275.19v7.06a2.53 2.53 0 01-.83 1.88 21.47 21.47 0 01-4.36 3.07 21.25 21.25 0 01-5 1.88l-4.13 1a18.19 18.19 0 00-3.19 1.09l-5.72 2.61a43.52 43.52 0 01-5.1 1.94A95 95 0 0168.1 300q-3.63 0-7.26-.28l-4.39-.34a24.76 24.76 0 01-11.65-3.94 7.84 7.84 0 01-3.55-6.54v-.84a8.14 8.14 0 014.75-7.42l1.63-.74a5.43 5.43 0 00-1.07.84 3 3 0 00.27 4.45c1.91 1.56 6.09 3.43 15.25 3.93 16.4.89 31.92-4.88 39.46-6.65s22.62-5.77 22.62-7.54l-.1-.85a1.37 1.37 0 01.56 1.11z"
      />
      <Path
        class="cls-4"
        fill="#fff"
        d="M77.06 280a2.26 2.26 0 112.26-2.26 2.26 2.26 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.52 1.52 0 00-1.51-1.53zM84.16 276a2.26 2.26 0 112.26-2.26 2.26 2.26 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.51 1.51 0 00-1.51-1.52zM89.48 271.11a2.26 2.26 0 112.26-2.26 2.26 2.26 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.52 1.51 1.52 1.52 0 00-1.52-1.51zM94.8 264.9a2.26 2.26 0 112.26-2.26 2.26 2.26 0 01-2.26 2.26zm0-3.77a1.52 1.52 0 101.51 1.51 1.52 1.52 0 00-1.51-1.51zM99.68 258.69a2.26 2.26 0 112.26-2.25 2.26 2.26 0 01-2.26 2.25zm0-3.76a1.51 1.51 0 101.51 1.51 1.51 1.51 0 00-1.51-1.51zM104.11 252.49a2.26 2.26 0 112.26-2.26 2.27 2.27 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.52 1.52 0 00-1.51-1.51zM107.22 245.39a2.26 2.26 0 112.26-2.26 2.26 2.26 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.51 1.51 0 00-1.51-1.51z"
      />
      <Path
        class="cls-4"
        fill="#fff"
        d="M77.88 276.26l-2.3 2.7a56.44 56.44 0 00-12.53-7.81l3.42-2.3a57.76 57.76 0 0111.41 7.41zM85 271.83l-2.31 2.69a56.28 56.28 0 00-12.83-7.94c1.12-.76 2.22-1.55 3.29-2.38A58 58 0 0185 271.83zM89.86 267.39l-2.31 2.7a55.66 55.66 0 00-12.22-7.66c1-.82 2-1.67 2.89-2.56a58.07 58.07 0 0111.64 7.52zM95.62 261.63l-2.31 2.7a55.76 55.76 0 00-12-7.56c.84-.89 1.66-1.81 2.46-2.75a57.74 57.74 0 0111.85 7.61zM100.06 255l-2.31 2.69A27.1 27.1 0 0085.48 252l2.46-3.1a30.24 30.24 0 0112.12 6.1zM104.93 249.21l-2.3 2.7a24.82 24.82 0 00-12.89-5.32l2.55-3.21a27.46 27.46 0 0112.64 5.83z"
      />
      <Path
        class="cls-8"
        fill="#dd8386"
        d="M124.62 280v1.44c-1.31.52-3.08 1.09-5.5 1.87-3.14 1-7.45 2.39-13.12 4.44-19.31 7-30.72 7.91-35.37 7.91a21.54 21.54 0 01-2.41-.11l.17-1.32c.12 0 11.94 1.4 37.16-7.73 5.69-2.06 10-3.45 13.16-4.46 2.69-.85 4.62-1.46 5.91-2.04z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M66.07 289.23c-1.3 0-2.62 0-3.93-.09-9.16-.5-13.34-2.37-15.25-3.93a3 3 0 01-.27-4.45 5.43 5.43 0 011.07-.84 5 5 0 011-.47 38.75 38.75 0 005.31-2.38l.55-.3c2.3.23 8.32 1.98 11.52 12.46z"
      />
      <Path
        class="cls-5"
        fill={color}
        d="M136.35 303.46c0 1.77-15.08 5.76-22.62 7.53-6.93 1.64-20.59 6.63-35.49 6.75-3.2-10.49-9.23-12.2-11.5-12.47.55-.32 1.1-.65 1.63-1l6.85-4.6 3.42-2.3 3-2 .35-.23a68.58 68.58 0 003.29-2.38c.74-.58 1.48-1.17 2.2-1.78 1-.82 2-1.67 2.89-2.55s2.11-2 3.12-3.1q1.26-1.35 2.46-2.76c.49-.58 1-1.17 1.45-1.76l.23-.29 2.45-3.1 1.81-2.28 2.55-3.21 1.71-2.15 2.78-3.51 2.12-2.67a14.22 14.22 0 0112.47-.12 6.93 6.93 0 013.94 6.25v1.4a7 7 0 006.73-2.15l1.24-1.38-1 5.41a45.17 45.17 0 00.18 17.52c.26 1.27.47 2.54.63 3.83l1 8.3z"
      />
      <Path
        class="cls-6"
        fill="#dd5e5e"
        d="M135.46 267.54l-1.24 1.38a7 7 0 01-6.73 2.15v-1.4a7 7 0 00-.87-3.36 7.07 7.07 0 00-1.36-1.72l.36-.1a13.33 13.33 0 017.25.15 3.79 3.79 0 012.6 2.89z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M136.79 303.7v7.05a2.55 2.55 0 01-.83 1.89 21.5 21.5 0 01-9.36 4.95l-4.13 1a17.44 17.44 0 00-3.19 1.1l-5.72 2.6a44.21 44.21 0 01-5.1 1.94 94.67 94.67 0 01-28.19 4.29c-2.42 0-4.84-.1-7.27-.28l-4.38-.34A24.89 24.89 0 0157 323.94a7.61 7.61 0 01-2.6-2.81 7.71 7.71 0 01-.95-3.72v-.85a8.14 8.14 0 014.79-7.41l1.63-.75a5.48 5.48 0 00-1.07.85 3 3 0 00.26 4.45c1.92 1.56 6.1 3.43 15.25 3.93 16.41.88 31.93-4.88 39.47-6.66s22.62-5.76 22.62-7.53l-.1-.86a1.39 1.39 0 01.49 1.12z"
      />
      <Path
        class="cls-4"
        fill="#fff"
        d="M89.23 308.49a2.26 2.26 0 112.26-2.26 2.27 2.27 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.51 1.51 0 00-1.51-1.51zM96.33 304.49a2.26 2.26 0 112.25-2.25 2.26 2.26 0 01-2.25 2.25zm0-3.76a1.51 1.51 0 101.51 1.51 1.51 1.51 0 00-1.51-1.51zM101.65 299.62a2.26 2.26 0 112.26-2.26 2.26 2.26 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.51 1.51 0 00-1.51-1.51zM107 293.41a2.26 2.26 0 112.26-2.26 2.26 2.26 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.52 1.52 0 00-1.51-1.51zM111.85 287.2a2.26 2.26 0 112.25-2.26 2.26 2.26 0 01-2.25 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.51 1.51 0 00-1.51-1.51zM116.28 281a2.26 2.26 0 112.26-2.26 2.26 2.26 0 01-2.26 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.52 1.52 0 00-1.51-1.52zM119.39 273.9a2.26 2.26 0 112.25-2.26 2.26 2.26 0 01-2.25 2.26zm0-3.77a1.51 1.51 0 101.51 1.51 1.52 1.52 0 00-1.51-1.51z"
      />
      <Path
        class="cls-4"
        fill="#fff"
        d="M90.05 304.77l-2.31 2.69a56.06 56.06 0 00-12.52-7.8l3.42-2.3a57.31 57.31 0 0111.41 7.41zM97.15 300.33L94.84 303A56.28 56.28 0 0082 295.09a68.58 68.58 0 003.29-2.38 57.86 57.86 0 0111.86 7.62zM102 295.9l-2.3 2.7a56.19 56.19 0 00-12.22-7.67c1-.82 2-1.67 2.89-2.55A57.76 57.76 0 01102 295.9zM107.79 290.13l-2.31 2.7a55.62 55.62 0 00-12-7.55q1.26-1.35 2.46-2.76a58.45 58.45 0 0111.85 7.61zM112.22 283.48l-2.3 2.7a26.88 26.88 0 00-12.27-5.71l2.45-3.1a30.08 30.08 0 0112.12 6.11zM117.1 277.72l-2.3 2.69a24.91 24.91 0 00-12.89-5.32l2.55-3.21a27.54 27.54 0 0112.64 5.84z"
      />
      <Path
        class="cls-8"
        fill="#dd8386"
        d="M136.79 308.53V310c-1.31.51-3.09 1.09-5.5 1.86-3.15 1-7.45 2.39-13.12 4.45-19.31 7-30.73 7.9-35.37 7.9a19.39 19.39 0 01-2.42-.11l.18-1.32c.12 0 11.94 1.4 37.16-7.72 5.69-2.07 10-3.45 13.16-4.47 2.69-.89 4.62-1.51 5.91-2.06z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M78.24 317.74c-1.31 0-2.62 0-3.94-.09-9.15-.5-13.33-2.37-15.25-3.93a3 3 0 01-.26-4.45 5.48 5.48 0 011.07-.85 6.43 6.43 0 011-.47 38.06 38.06 0 005.35-2.35c.19-.1.38-.2.56-.31 2.23.25 8.23 1.96 11.47 12.45zM301.28 343.05a7.21 7.21 0 01-6.47 1.32l-56.6-15.84a7.21 7.21 0 01-4.83-4.49 13.27 13.27 0 01.07-9.23l21.89-57.52a18.29 18.29 0 0110.66-1.12c.47.09 1 .21 1.42.34l39.79 11.14c.46.13.93.28 1.38.45a18.32 18.32 0 018.55 6.49L306 335.12a13.34 13.34 0 01-4.72 7.93z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M308.61 268.1c-.45-.17-.92-.32-1.38-.45l-4.55-1.28 1.42-56.21A2.23 2.23 0 00300 209l-28 48.78-4.54-1.27c-.47-.13-.95-.25-1.42-.34l27.68-46.39a8.25 8.25 0 0115.34 4.3z"
      />
      <Path
        class="cls-9"
        fill="#fe94aa"
        d="M258.49 286.92l6 1.67-7.28 26-6-1.67zm-10.87 28l11.59 3.24 8.84-31.61-11.59-3.24zM272.89 291l6 1.67-6 21.42-6-1.67zm-2-3.6L262 319l2.8.78 1.28-4.56 6 1.67-1.28 4.56 2.81.79 8.85-31.61zM291.041 327.094l8.848-31.605 2.812.787-8.848 31.605zM284.92 303.4l6 1.68-4.92 17.55-6-1.63zm2.36-8.42l4.57 1.27-1.57 5.62-4.57-1.27zm-2-3.6L276.41 323l11.59 3.23 6.49-23.18-1.4-.39 2.35-8.43z"
      />
      <Path
        class="cls-10"
        fill="#ffe0dd"
        d="M97.08 169.21v53.87l-22.35 3.44a18.54 18.54 0 01-11.64-2.39v-35.91a45.68 45.68 0 00.59-29.84l-.59-1.84a32 32 0 014.35-6.63 29.37 29.37 0 015.67-5.15l2.89-1.95 8.27 12.67a8.86 8.86 0 007.35 4.23zM128.27 172.44a45.33 45.33 0 002.81 15.78v35.91a18.54 18.54 0 01-11.64 2.39l-22.36-3.44v-53.87l5.52-9.5a8.86 8.86 0 007.35-4.23l8.27-12.67 2.84 1.95a29.37 29.37 0 015.67 5.15 32 32 0 014.35 6.63l-.59 1.84a45.42 45.42 0 00-2.22 14.06z"
      />
      <Path
        class="cls-10"
        fill="#ffe0dd"
        d="M65.9 172.44a45.33 45.33 0 01-2.81 15.78v8L53 214.63l-13.8-10.57 23.89-47.52.59 1.84a45.42 45.42 0 012.22 14.06zM128.27 172.44a45.33 45.33 0 002.81 15.78v8l31.69 53.3 12.23-6.38-44-86.6-.59 1.84a45.42 45.42 0 00-2.14 14.06z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M77.79 187.17L39.2 204.06l13.78 10.57 29.4-14.79-4.59-12.67z"
      />
      <Path
        class="cls-11"
        fill="#efbbb8"
        d="M118.22 142.81L110 155.48a8.93 8.93 0 01-6.63 4.19 1.35 1.35 0 00-1.08.66l-5.16 8.88-5.15-8.88a1.35 1.35 0 00-1.08-.66 8.93 8.93 0 01-6.63-4.19L76 142.81z"
      />
      <Circle class="cls-4" fill="#fff" cx="96.76" cy="173.44" r="1.06" />
      <Circle class="cls-4" fill="#fff" cx="97.29" cy="182.94" r="1.06" />
      <Circle class="cls-4" fill="#fff" cx="97.81" cy="192.45" r="1.06" />
      <Circle class="cls-4" fill="#fff" cx="98.34" cy="201.95" r="1.06" />
      <Circle class="cls-4" fill="#fff" cx="98.87" cy="211.46" r="1.06" />
      <Circle class="cls-4" fill="#fff" cx="99.4" cy="220.96" r="1.06" />
      <Path
        class="cls-12"
        fill="#ffa9c3"
        d="M209.01 316.92l-6.06 27.34-.99 4.5-5.02.44-2.07.18.1-3.54.11-3.86.01-.22v-.34l.66-23.04 13.26-1.46zM185.83 301.49l-14.79 40.47-6.29-3.32 9.42-43.63 11.66 6.48z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M208.85 378.05l-.61.23a7.48 7.48 0 01-7.43-1.26l-.07-.06c4.64-6.84 8.13-4.95 10-2.88l.1.52a3.09 3.09 0 01-1.99 3.45z"
      />
      <Path
        class="cls-5"
        fill={color}
        d="M210.51 373l-5.29-19.86a15.5 15.5 0 01-.67-4.54 15 15 0 01.22-2.58 1.46 1.46 0 00-1.43-1.72h-3.44a2.55 2.55 0 00-2.52 1.67 1 1 0 01-.68.68 1 1 0 01-.3.05 1.25 1.25 0 01-.32-.05 2.51 2.51 0 01-1.11-.77l.11-3.86v-.22l-1.28 1.17-.31 1.65-.34 1.79-.3 3.28a14 14 0 01-1.43 5l-.89 1.78a4.25 4.25 0 00-.17.92 4.88 4.88 0 00.73 3l3.28 5.26 3.38 7.43a11.43 11.43 0 003 3.94c4.64-6.84 8.13-4.95 10-2.88z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M211.27 376.18v2.88a3 3 0 01-1.26 2.47 5.1 5.1 0 01-3 1h-2.48a7.68 7.68 0 01-6.25-3.22l-.48-.66a13.17 13.17 0 01-2.23-5.32 20.23 20.23 0 01-.33-2.36c0-.46-.49-.93-1-1.27a16.73 16.73 0 01-2.09-1.77 12.21 12.21 0 01-2.29-3.18v-5.86a3 3 0 01.43-1.54 4.88 4.88 0 00.73 3l3.28 5.26 3.38 7.43a11.1 11.1 0 003.05 4 7.48 7.48 0 007.43 1.26l.61-.23a3.09 3.09 0 002-3.45l-.3-1.64a7.19 7.19 0 01.8 3.2z"
      />
      <Path
        class="cls-13"
        fill="#7e5e54"
        d="M202.53 128.71s1.63 8.45 5.19 12.89-.89 16-.89 16l-35.56-7.11s-5.33-1.78-1.77-10.67a87.3 87.3 0 004.44-13.33z"
      />
      <Path
        class="cls-12"
        fill="#ffa9c3"
        d="M193.5 135.38s-1.78 10.67 1.77 14.22-11.55 14.22-11.55 14.22l-9.78-15.11s3.56-.89 4.45-2.66.88-2.67.88-8"
      />
      <Path
        class="cls-14"
        fill="#141414"
        d="M232.6 314.58a1.7 1.7 0 01-.46.18l-2.47.54s.27 3 .51 5.54v.35a3.32 3.32 0 01-1.63 2.92 2.78 2.78 0 01-1.42.39 1.76 1.76 0 00-1.68 1.83v2.95a3.9 3.9 0 01-4.74 4l-1.59-.44a9.67 9.67 0 01-3.35-1.67c-.14-.11-.29-.23-.43-.36a10.35 10.35 0 01-2.14-2.54 4 4 0 00-3.4-2h-4.44a3.33 3.33 0 01-2.46-1.12 4 4 0 01-1-2.68 2.32 2.32 0 000-.46V322a2.48 2.48 0 00-2.37-2.11h-3.95a3.32 3.32 0 01-2.07-.74 3.84 3.84 0 01-1.38-2.35l-.4-2.22a4.87 4.87 0 00-2.4-3.39 4.09 4.09 0 00-2-.49h-1a1.31 1.31 0 00-1.26 1.37 2.44 2.44 0 01-.61 1.63 2 2 0 01-1.49.67 2.21 2.21 0 01-2.11-2.3v-1.83a2.39 2.39 0 00-.61-1.63 2 2 0 00-1.49-.67 2.15 2.15 0 00-2.07 1.92 1.5 1.5 0 000 .37v3.51a1.48 1.48 0 01-1.41 1.54 1.29 1.29 0 01-1-.48 1.39 1.39 0 01-.36-.69l-.92-3.51a3.6 3.6 0 00-3.1-2.88l-1.14-.1-5.15-.47a1.4 1.4 0 01-1.2-1.56l.72-8.68-2.21-.3-3-.4a1.81 1.81 0 01-1.48-1.94l1.42-33.41c.16-3.75.46-7.48.94-11.2 2.27-17.77 7.06-39.84 7.62-42.66a1.75 1.75 0 000-.4v-2.35a1 1 0 011-1l2.79.26a164.75 164.75 0 0031.09 0l2.78-.26a1 1 0 011 1v3.24a2.14 2.14 0 00.05.45l28.13 104.57a1.89 1.89 0 01-.66 2.07z"
      />
      <Path
        fill="#000000"
        d="M170.74 208.71l-7.57 88.2-2.21-.3c1.66-19.75 9.51-85.61 9.78-87.9zM178.33 209.56l-4.12 105.26a1.39 1.39 0 01-.36-.69l-.85-3.53a3.6 3.6 0 00-3.1-2.88l-1.14-.1zM180.85 311.63v-1.38a2.39 2.39 0 00-.61-1.63 2 2 0 00-1.49-.67 2.15 2.15 0 00-2.07 1.92v-.08l5.89-100.23zM193.45 319.16a3.84 3.84 0 01-1.38-2.35l-.4-2.22a4.87 4.87 0 00-2.4-3.39V209zM201.84 322a2.48 2.48 0 00-2.37-2.11h-.38l-5.61-110.34zM215.35 330.85a10.35 10.35 0 01-2.14-2.54 4 4 0 00-3.4-2h-.94l-9.5-117.7zM228.56 324.11a2.78 2.78 0 01-1.42.39 1.76 1.76 0 00-1.68 1.83l-22.72-117.69zM232.6 314.58a1.7 1.7 0 01-.46.18l-2.47.54-25.25-106.66z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M174.39 147.82l2.86 1.85a15.85 15.85 0 0018.47-1l10.77 4.79a11.29 11.29 0 016.45 7.89c3.93 17.77 16.1 72.05 18.33 73.54 1.66 1.1-.8 4.61-2.9 7.11a1.63 1.63 0 001.25 2.67 3.53 3.53 0 013.47 4.23l-.94 4.69a5.48 5.48 0 01-5.38 4.41 5.48 5.48 0 01-4.26-2l-7.83-9.64a11.48 11.48 0 01-2.49-5.81L207.27 202a15.59 15.59 0 01-10.13 3.42l-24.79-.61a9.89 9.89 0 01-8.63-5.47l-.89 30.22-8.89 24.89a5.33 5.33 0 01-5.33 5.33h-1.48a3 3 0 01-3-3 15.39 15.39 0 00-1.32-6.24 19.41 19.41 0 01-1.5-10.47l4.38-32.87a25 25 0 01.67-3.32l12.34-44.72a11.34 11.34 0 016.37-7.36z"
      />
      <Path
        class="cls-15"
        fill="#ffbfc3"
        d="M197.05 126.05c0 8.59-6.31 15.55-12.44 15.55s-8.89-7.11-9.78-15.55 5-15.56 11.11-15.56 11.11 6.97 11.11 15.56z"
      />
      <Path
        class="cls-16"
        fill="#977a68"
        d="M185.5 113.16a1.94 1.94 0 012.66.89c.89 1.77 1.78 9.77 4.45 13.33s4.44 4.44 4.44 4.44 2.67 0 3.56 3.56a8.31 8.31 0 01-.89 6.22s5.33-2.67 3.55-8 0-12.44-2.66-16.89-7.11-9.77-12.45-8c0 0-1.78-2.66-5.33 0s-9.78 6.23-10.67 15.11c0 0-3.55 8 .89 12.45a17.68 17.68 0 011.78-7.11c1.78-3.56 3.56-16.89 8.89-16z"
      />
      <Path
        class="cls-5"
        fill={color}
        d="M171 341.48c0 3-1 10-1 13 0 2-.44 8.86-.74 13.23a3 3 0 01-.07.52A5.64 5.64 0 01168 371a5.74 5.74 0 01-2.49 1.65 5.33 5.33 0 01-1.71.28 5.46 5.46 0 01-2.87-.82 9.72 9.72 0 01-3.59-4 9.59 9.59 0 01-1-4.26 8.73 8.73 0 01.11-1.44c0-.23.07-.45.12-.67l2.05-9.19a16.72 16.72 0 011.42-4l4.92-9.85a1.33 1.33 0 01.36-.45c.59-.49 2.17-1.58 3.76-.79 1.92 1.02 1.92 1.02 1.92 4.02z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M169.54 368.65l-2 5.33a5.37 5.37 0 01-6 3c-7-2-7-8-7-8l1.87-6.55a8.73 8.73 0 00-.11 1.44 9.75 9.75 0 004.58 8.26 5.46 5.46 0 002.87.82 5.33 5.33 0 001.71-.28 5.58 5.58 0 003.77-4.44z"
      />
      <Path
        class="cls-7"
        fill="#fff2ea"
        d="M168 371a5.74 5.74 0 01-2.49 1.65 5.33 5.33 0 01-1.71.28 5.46 5.46 0 01-2.87-.82 9.72 9.72 0 01-3.59-4 6.62 6.62 0 017.75-2.65c2 .7 2.65 3.72 2.91 5.54z"
      />
      <Path
        fill="#141414"
        d="M299 203l1.06-7.61a8 8 0 00-3.69-6.57L255.2 162.5l2.36-3.85 40.76 27.07a11.57 11.57 0 015.36 9.54l.16 8a2.42 2.42 0 01-1.76 2.39A2.43 2.43 0 01299 203z"
      />
      <Path
        fill="#141414"
        d="M251.68 178.39l5.61-5.25a8 8 0 017.5-.76L310 190.92l1.78-4.14L266.16 169a11.56 11.56 0 00-10.88 1.11l-6.61 4.45a2.43 2.43 0 00-.94 2.81 2.43 2.43 0 003.95 1.02z"
      />
      <Path
        class="cls-14"
        fill="#141414"
        d="M316.94 188.7l-1.47-.77a7.46 7.46 0 00-3.47-7.73l-.28-.17a108.61 108.61 0 00-14.13-7.32 7.49 7.49 0 00-9.27 2.84 10.6 10.6 0 00-7-3.62 7.48 7.48 0 00-3-9.22l-.28-.17a107.39 107.39 0 00-14.13-7.32 7.46 7.46 0 00-8.31 1.64l-2.08-1.08-2.72 5.22 1.93 1-.62 1.33a14.29 14.29 0 005.13 17.81l1.13.74q.6.39 1.23.72a15.83 15.83 0 001.46.65 14.13 14.13 0 0017.35-6.12l.73-1.26a8 8 0 017.24 3.75l-.56 1.2a14.28 14.28 0 005.18 17.8l1.13.74q.6.39 1.23.72a15.83 15.83 0 001.46.65 14.13 14.13 0 0017.35-6.12l.8-1.39 1.32.69zm-42.19-13.61c-2.76 4.81-8.15 7-12.83 5.32a9.32 9.32 0 01-1.91-1l-1-.66c-4.12-2.77-5.48-8.62-3.15-13.62l2-4.24a4.5 4.5 0 015.7-2.55 84 84 0 0112.14 6.28l.25.16a4.49 4.49 0 011.2 6.13zm33.71 17.49c-2.76 4.81-8.15 7-12.83 5.32a9.07 9.07 0 01-1.91-1l-1-.66c-4.13-2.76-5.48-8.62-3.15-13.62l2-4.24a4.52 4.52 0 015.7-2.55 83.08 83.08 0 0112.14 6.29l.25.15a4.5 4.5 0 011.2 6.13z"
      />
      <Path
        class="cls-17"
        fill="#974a47"
        d="M23.84 26.92a34.4 34.4 0 01.65-8 4.78 4.78 0 012.64-3.33 17 17 0 016.55-.91v5.61a31 31 0 00-3.22.1 1.17 1.17 0 00-1 .57 4.65 4.65 0 00-.24 1.83h4.46v9h-9.84zm12.48 0A34.4 34.4 0 0137 19a4.78 4.78 0 012.64-3.33 17 17 0 016.55-.91v5.61a31 31 0 00-3.22.1 1.17 1.17 0 00-1 .57 4.65 4.65 0 00-.24 1.83h4.46v9h-9.87zM321 78.42a34.24 34.24 0 01-.65 7.94 4.78 4.78 0 01-2.64 3.34 17 17 0 01-6.55.91V85c1.63 0 2.7 0 3.22-.1a1.2 1.2 0 001-.58 4.63 4.63 0 00.24-1.82h-4.42v-9h9.8zm12.48 0a34.24 34.24 0 01-.65 7.94 4.78 4.78 0 01-2.64 3.34 17 17 0 01-6.55.91V85c1.63 0 2.7 0 3.22-.1a1.2 1.2 0 001-.58 4.63 4.63 0 00.24-1.82h-4.46v-9h9.84z"
      />
      <Path class="cls-18" d="M-1.96.48h363v452h-363z" />
      <Path
        class="cls-17"
        fill="#974a47"
        d="M54 354.21c.27 0 .41.13.41.39v5.81a.59.59 0 01-.16.41.66.66 0 01-.51.18c-.23 0-.35-.15-.35-.46v-2.21-1.56a3.37 3.37 0 01-1 .88 2.79 2.79 0 01-1.29.26 1.71 1.71 0 01-1.24-.44v2.94a.57.57 0 01-.66.59c-.25 0-.38-.14-.38-.41l.05-2.59v-2.75a.59.59 0 01.15-.38.45.45 0 01.36-.18.74.74 0 01.36.09.32.32 0 01.18.27 2.31 2.31 0 00.41 1.27 1.07 1.07 0 00.87.56 2 2 0 002-1.52c0-.05.06-.17.12-.37a2.49 2.49 0 01.15-.4.8.8 0 01.22-.25.55.55 0 01.31-.13zM56.45 359.62c0 .24-.2.35-.5.35s-.44-.12-.44-.36a14.39 14.39 0 01.81-3.36 9.63 9.63 0 01.82-1.93c.29-.52.58-.77.86-.77a.48.48 0 01.4.26c.11.18.31.58.61 1.21a13.94 13.94 0 01.73 2c.2.71.41 1.57.64 2.59a.34.34 0 01-.12.28.49.49 0 01-.26.11.51.51 0 01-.56-.39l-.49-1.92a8 8 0 01-2-.2 16.11 16.11 0 00-.5 2.13zm2.63-6.79a.37.37 0 01-.31.2 1 1 0 01-.45-.14 3.38 3.38 0 01-.64-.52 2.78 2.78 0 01-.57-.74 1.34 1.34 0 01-.18-.49 1.06 1.06 0 010-.25.3.3 0 01.18-.21.57.57 0 01.26-.09h.15c.14 0 .33.26.58.66a2.05 2.05 0 00.79.83.46.46 0 01.26.37.42.42 0 01-.07.38zm-1.12 2a7.89 7.89 0 00-.75 1.75 5.2 5.2 0 001.45.17 13.49 13.49 0 00-.66-1.92zM66.14 356.46v-.18a.38.38 0 01.23-.22.59.59 0 01.38-.07.58.58 0 01.3.18.37.37 0 01.1.28c-.1.94-.21 1.68-.32 2.21a12.26 12.26 0 01-.31 1.22 3.27 3.27 0 01-1.07 1.81 2.32 2.32 0 01-1.88.26 2.2 2.2 0 01-1.33-.81 2.65 2.65 0 01-.53-1.48 9.42 9.42 0 01.22-2.79 12.11 12.11 0 01.34-1.28.4.4 0 01.28-.27.7.7 0 01.39-.05.4.4 0 01.26.17.37.37 0 010 .31 12.25 12.25 0 00-.34 1.27c-.08.37-.15.72-.19 1a4.59 4.59 0 00.11 2 1.3 1.3 0 00.94 1c1 .21 1.68-.53 2-2.23a12.59 12.59 0 00.42-2.33zM73.92 354.49c.24 0 .36.14.36.34a2 2 0 01-.38 1l-.36.56c-.16.23-.27.4-.33.5s-.16.24-.29.43-.25.36-.35.51V359a10.46 10.46 0 01-.08 1.63.47.47 0 01-.49.37.24.24 0 01-.18-.06 1.59 1.59 0 01-.16-.92v-1.51-.74a21.09 21.09 0 01-1.66-2.55.34.34 0 010-.38.55.55 0 01.48-.29q.21 0 1 1.41.36.63.54.9l.54-.82c.19-.32.34-.55.43-.7a2.63 2.63 0 01.64-.78.32.32 0 01.29-.07zM76.6 358.85v1.83a2.77 2.77 0 010 .4L79 361c.27 0 .41.15.41.35 0 .4-.19.59-.55.59h-2.74a.41.41 0 01-.37-.17.8.8 0 01-.14-.38v-2.69a.33.33 0 01-.18-.3.49.49 0 01.15-.35v-2c0-.34.21-.52.63-.53H79.05q.45.06.45.42c0 .19 0 .32-.17.38a4.62 4.62 0 01-1.75.2h-1v1.41h2.12c.29 0 .44.17.44.4a.49.49 0 01-.14.32.52.52 0 01-.3.17 5.5 5.5 0 01-.69 0zm-.78-4.64c0-.15.24-.4.71-.78a2.21 2.21 0 011-.56 2.08 2.08 0 011 .53q.69.53.69.84a.44.44 0 01-.17.34.49.49 0 01-.28.14 1.9 1.9 0 01-.61-.45c-.34-.3-.55-.45-.64-.45s-.29.16-.6.47-.54.46-.67.46a.44.44 0 01-.33-.16.58.58 0 01-.1-.38zM84.41 354.94a.6.6 0 010-.18.36.36 0 01.14-.29.51.51 0 01.67-.12.4.4 0 01.2.23c.22.92.36 1.65.44 2.18s.11 1 .13 1.26a3.31 3.31 0 01-.41 2.07 2.29 2.29 0 01-1.68.87 2.15 2.15 0 01-1.53-.31 2.8 2.8 0 01-1-1.21 10.05 10.05 0 01-.73-2.7 11.36 11.36 0 01-.11-1.33.39.39 0 01.17-.34.76.76 0 01.36-.18.45.45 0 01.3.07.36.36 0 01.13.28c0 .49.06.92.11 1.31s.11.72.17 1a4.66 4.66 0 00.77 1.82 1.3 1.3 0 001.23.63c1-.14 1.4-1.07 1.16-2.79a12.55 12.55 0 00-.52-2.27zM91.56 355.51l-.67 3.25c-.14.67-.24 1.27-.33 1.79a.37.37 0 01-.24.3.72.72 0 01-.4.06c-.24-.05-.33-.2-.28-.46.17-1 .34-2 .52-2.86s.35-1.64.52-2.21c-.55-.07-1.12-.15-1.68-.27-.29-.05-.41-.2-.36-.44a.51.51 0 01.22-.3.57.57 0 01.39-.1l4.31.7c.24.11.34.25.3.43-.07.38-.54.48-1.4.31zM98.46 358.14v2.08q0 .78-.51.78a.49.49 0 01-.35-.1.32.32 0 01-.11-.31c0-.49.06-1.28.06-2.36a6.61 6.61 0 01-.74 0 15.23 15.23 0 01-1.55-.12v.3q0 .29.12 2.13a.31.31 0 01-.17.32.66.66 0 01-.35.11.4.4 0 01-.29-.11.37.37 0 01-.12-.24c-.1-1-.15-1.71-.15-2.21v-1l.06-2.34a.36.36 0 01.19-.28.63.63 0 01.37-.12q.36 0 .36.3v2.2a7.32 7.32 0 001.22.11h1.07c0-.51-.05-1.28-.05-2.32a.38.38 0 01.19-.32.69.69 0 01.41-.13.31.31 0 01.3.2.74.74 0 01.07.38zM99.72 350.74a.33.33 0 01.33-.27.57.57 0 01.45.12c.11.1.18.19.18.26a.31.31 0 010 .17 3.46 3.46 0 01-.61 1.27c-.31.4-.56.62-.75.64a.55.55 0 01-.43-.1.42.42 0 01-.17-.31.52.52 0 01.18-.39 2.81 2.81 0 00.82-1.39zm.73 9.25c-.26 0-.4-.07-.43-.3l-.55-5.69a.43.43 0 01.11-.33.51.51 0 01.33-.15.72.72 0 01.36.06.39.39 0 01.19.31c0 .15.07.49.13 1q.39 3.72.42 4.53a.42.42 0 01-.18.35.78.78 0 01-.38.23zM106.19 355.74l-1.14-.14a2 2 0 00-2.26 2.26 2.4 2.4 0 00.68 1.82 1 1 0 00.7.35 4.46 4.46 0 001.28-.32 10 10 0 011-.32c.25 0 .37.12.37.35a.58.58 0 01-.32.5 7.57 7.57 0 01-2.5.76 1.73 1.73 0 01-.94-.31 2.24 2.24 0 01-.73-.8 4.15 4.15 0 01-.54-2.07 3.09 3.09 0 01.89-2.35 3.16 3.16 0 012.3-.87 5.26 5.26 0 011.61.26.42.42 0 01.25.35.48.48 0 01-.2.36.71.71 0 01-.45.17zM112.18 357.14v2.08q0 .78-.51.78a.53.53 0 01-.36-.1.34.34 0 01-.1-.31v-2.36a6.29 6.29 0 01-.73 0 15.23 15.23 0 01-1.55-.12v.3q0 .29.12 2.13a.32.32 0 01-.17.32.66.66 0 01-.35.11.4.4 0 01-.29-.11.37.37 0 01-.12-.24c-.1-1-.15-1.71-.15-2.21v-1l.06-2.34a.36.36 0 01.19-.28.63.63 0 01.37-.12q.36 0 .36.3v2.2a7.32 7.32 0 001.22.11h1.06v-2.32a.38.38 0 01.19-.32.69.69 0 01.41-.13.31.31 0 01.3.2.74.74 0 01.07.38z"
      />
      <Path
        class="cls-19"
        fill="#974a47"
        d="M103.77 327.9c.89 2.37-.51 5.29-1.92 7.41-1 1.51-2.52 3.23-4.28 2.77a2.21 2.21 0 01.07-4.3 2.76 2.76 0 012 .42 4.7 4.7 0 011.62 5 13.07 13.07 0 01-3.73 5.8"
      />
      <Path
        class="cls-19"
        fill="#974a47"
        d="M95.87 343a14.22 14.22 0 00.14 4.48 1.86 1.86 0 00.26.74.87.87 0 00.85.23 7.11 7.11 0 002.75-.95"
      />
    </Svg>
  );
}

export default SimpleIcon;
