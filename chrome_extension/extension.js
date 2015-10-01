/**
 * Created by Javier on 29/09/15.
 */
(function() {
  function open() {
    window.open("http://pilares.bigdata.gs/", "foo", "toolbar=yes,location=yes,menubar=yes");
  }
  var p = document.getElementById("open");
  p.onclick = open;
})();

