export const createEnableButton = () => {
    const button = document.createElement('div');
    button.className = 'button lf-excel-exclude';
    const anchor = document.createElement('a');
    anchor.innerText = 'Aktivér BedsteLectio';
    anchor.onclick = () => {
        localStorage.removeItem('bedstelectio-disabled');
        window.location.reload();
    };
    button.appendChild(anchor);
    return button;
};
