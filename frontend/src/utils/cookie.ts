// https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
export const setCookie = (name: string, value: string, days: number) => {
    if (typeof(document) === undefined) return;
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export const getCookie = (name: string) => {
    if (typeof(document) === undefined) return;
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
export const eraseCookie = (name: string) => {   
    if (typeof(document) === undefined) return;
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}