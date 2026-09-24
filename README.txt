# BRUK Cursor Hero — V1

Estructura:
- index.html
- style.css
- app.js
- public/character.mp4
- public/center.webp
- public/frames/frame-000.webp ... frame-063.webp

Para probarlo:
1. Abre esta carpeta en un servidor local (VS Code + Live Server, por ejemplo).
2. Abre index.html desde el servidor, no con file://.
3. Mueve el cursor alrededor de BRUK.
4. Cerca del rostro entra en el estado CENTER.

Nota técnica:
Los 64 frames fueron extraídos uniformemente a lo largo del MP4 de 240 frames a 24 fps. Es una primera versión funcional. La siguiente optimización será detectar los puntos angulares reales del movimiento para que cada frame corresponda con mayor precisión a 5.625°.
