/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const cloudTopOpacity = (
  <SVG xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 1351 148">
    <defs>
      <Path id="cloud-top-opacity-a" d="M.05 130.1Q0 131.25 0 132.45q0 .9.05 1.7v-4.05z"/>
      <Path id="cloud-top-opacity-b" d="M1350.45 130h1.2V0H.05v130q.784-17.238 12.5-30.3Q25.1 85.8 43.6 84l-.15-3.5q0-19.3 13.7-33 13.7-13.75 33-13.75 14.9 0 27.15 8.8v-.05q0-17.1 12.05-29.2 8.4-8.35 19.05-10.95h20.45q10.65 2.6 18.9 10.95 12.2 12.1 12.2 29.2 0 7.35-2.7 14.55 6.75-6.85 15.5-10.65 9.05-3.9 19-3.9 20.15 0 34.35 14.2 14.25 14.15 14.25 34.2 0 5.2-1 9.7 9.9-9.7 23.6-9.7 14.05 0 24.05 10 7.45 7.55 9.25 17.45.6 3.1.6 6.55l-.05 1.95q1.65-4.15 3.95-7.75 7.4-24.6 27.95-40.2Q389.65 63 416.05 63q14.3 0 27.35 4.9 12.65 4.65 23.1 13.45 4.5.9 9.4 3.3 5.05-18.5 20.25-30.2Q511.7 42.5 531.4 42.5q20.3 0 36.1 12.8 15.55 12.6 19.85 32.05 9.9-6.85 22.15-6.85 6.95 0 13.95 2.6 5.3-9.55 14.7-15.2 9.65-5.85 20.95-5.85 8.4 0 16 3.3 7.25 3 12.9 8.65 1-16.85 13.25-28.5 12.4-11.75 29.45-11.75 13.95 0 25.2 8.2 11 8.05 15.35 20.75 3.6-.65 7.25-.65 15.45 0 27.1 10.35 11.45 10.2 13.35 25.4 7.65-5.3 17.05-6.45 5.55-13.1 17.4-21.2 12-8.1 26.75-8.1 16.5 0 29.45 10.2 7.4-14.5 21.15-23 14.15-8.8 30.9-8.8 24.3 0 41.5 17.15 17.15 17.15 17.15 41.4 0 5-1.05 11 .15 0 .3.05 2.85-5.45 7.2-10.35 12.55-13.9 31-15.7l-.1-3.5q0-19.3 13.7-33 13.7-13.75 33-13.75 14.9 0 27.15 8.8v-.05q0-17.1 12.05-29.2 8.4-8.35 19.05-10.95h20.45q10.65 2.6 18.9 10.95 12.2 12.1 12.2 29.2 0 7.35-2.7 14.55 6.7-6.85 15.5-10.65 9.05-3.9 19-3.9 20.15 0 34.35 14.2 14.25 14.15 14.25 34.2 0 5.2-1 9.7 9.9-9.7 23.6-9.7 14.05 0 24.05 10 7.45 7.55 9.25 17.45V130z"/>
      <Path id="cloud-top-opacity-c" fill="#252525" fill-opacity=".498" d="M1287.8 118.05q.65-.15-.75-.2-.1-.05-.15-.05.2.2.45.25.2.05.45 0m48.95-4.05q11.9 8.4 13.7 18.3v15.8H.05v.55h1351.6V1.95L.05 1.35v142.7q.75-17.3 12.5-30.4Q25.1 99.75 53.4 100.1q-9.95-24.95 3.75-38.65 13.7-13.75 33-13.75 14.9 0 32.6 14.8-.7-19.2 7.15-31.4 7.85-12.2 18.5-14.8 12.2-3.05 20.45 0 10.65 2.6 15.45 9.7 4.75 7.05 5.7 12.6.9 5.5-1.55 21.7l-2.7 12.35q5.1-4.5 9.6-7 4.5-2.55 14.15-5.85 12.3-3.35 22.25-3.35 20.15 0 34.35 14.2 6.2 6.1 7.4 15.6.25 2.1.25 18.6 0 5.4-1 9.7 4.6-4.5 14.15-7.25 8.4-2.45 16.05-2.45 14.05 0 24.05 10 7.45 7.55 9.25 17.45.2 1.1.35 2.2 12.6-26.85 32.1-41.65 20.95-15.9 47.35-15.9 14.3 0 27.35 4.9 12.65 4.65 23.1 13.45 4.5.9 9.4 3.3 5.05-18.5 20.25-30.2 15.55-11.95 35.25-11.95 20.3 0 36.1 12.8 15.55 12.6 13.85 33.15 15.9-7.95 28.15-7.95 6.95 0 13.95 2.6 5.3-9.55 14.7-15.2Q647.8 76 659.1 76q8.4 0 16 3.3 7.25 3 21.65 14.1-2.35-20.15 7.35-32.9 9.65-12.75 25.1-12.75 15.45-.05 26.7 8.15 11 8.05 8.8 24.55Q774.85 76 778.5 76q15.45 0 27.1 10.35 11.45 10.2 6.8 28.65 14.2-8.55 23.6-9.7 5.55-13.1 17.4-21.2 12-8.1 26.75-8.1 16.5 0 29.45 10.2 7.4-14.5 21.15-23 14.15-8.8 30.9-8.8 24.3 0 36.55 16.85 12.2 16.85 13.35 31.55 1.05 13.6 2 26.45 7.05-11.4 16-20.45 8.9-9.05 28.2-10.85l14.6 1.95q-7.5-22.7 2.85-37.35 10.35-14.7 27.2-14.75 16.85-.1 29.1 8.7l6.55 5.4q-.35-20.55 6.8-31.75 7.1-11.25 17.75-13.85 10.25-3.8 20.45 0 10.65 2.6 16.85 13.3 6.2 10.65 4.4 22.55-1.8 11.85-7.05 22.7 20.9-10.7 29.7-14.5 9.05-3.9 19-3.9 20.15 0 29.15 18.65t9.75 32.9q.15 3.9.65 6.3 1.35-1.9 18.45-4.95 20.85-3.8 32.8 4.65z"/>
    </defs>
    <use href="#cloud-top-opacity-a"/>
    <use href="#cloud-top-opacity-b"/>
    <use href="#cloud-top-opacity-c"/>
  </SVG>
)

export default cloudTopOpacity;