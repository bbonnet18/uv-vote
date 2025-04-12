function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // set a session cookie to be 1 day from now
  function setCookie(cname,cval){
    let oneDay = 24*60*60000;// 24 hours x 60 min x 60000 milliseconds 
    let tomr = new Date(Date.now()+oneDay);
    let dstr = tomr.toGMTString();
    let cookStr =  `${cname}=${cval}; expires=${dstr};`
    document.cookie = cookStr;

  }

  export default {
    getCookie:getCookie,
    setCookie:setCookie
  }