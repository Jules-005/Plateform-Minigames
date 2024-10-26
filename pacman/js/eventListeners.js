document.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'z':
    case 'Z':
      keys.z.pressed = true;
      lastKey = 'z'; // Met à jour lastKey pour savoir quelle touche a été pressée
      break;
    case 'q':
    case 'Q':
      keys.q.pressed = true;
      lastKey = 'q'; // Met à jour lastKey
      break;
    case 's':
    case 'S':
      keys.s.pressed = true;
      lastKey = 's'; // Met à jour lastKey
      break;
    case 'd':
    case 'D':
      keys.d.pressed = true;
      lastKey = 'd'; // Met à jour lastKey
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch(event.key) {
    case 'z':
    case 'Z':
      keys.z.pressed = false;
      break;
    case 'q':
    case 'Q':
      keys.q.pressed = false;
      break;
    case 's':
    case 'S':
      keys.s.pressed = false;
      break;
    case 'd':
    case 'D':
      keys.d.pressed = false;
      break;
  }
});
