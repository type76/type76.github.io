// button
function invert() {
 document.getElementById("switchValue").classList.toggle('on');
  if (document.getElementById("switchValue").classList != "on") {
    document.body.classList = '';
  } else {
    document.body.classList = 'dark';
    }

  }
