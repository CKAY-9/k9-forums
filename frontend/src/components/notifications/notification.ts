export const postNotification = (message: string, timeInSeconds: number = 5, onClick: Function = () => {}) => {
    const notiContainer = document.getElementById("notifications");
    if (notiContainer === null) return;

    const id = Math.floor(Math.random() * 100000 + Math.random() * 200000);

    notiContainer.innerHTML += `
        <div id="${id}" class="noti">
            ${message}
        </div>
    `;

    const noti = document.getElementById(id.toString());
    if (noti === null) return;

    noti.onclick = () => {
        onClick();
    };

    setTimeout(() => {
        noti.style.opacity = "0";

        setTimeout(() => {
            noti.remove();
        }, 250);
    }, 1000 * timeInSeconds);
}