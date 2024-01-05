export const isLocationSupported = (location: Location) => {
    return location && location.pathname && ['forside'].some((substring) => location.pathname.includes(substring));
};
