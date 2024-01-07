export const stringToColor = (string_: string, saturation = 100, lightness = 75) => {
    let hash = 0;
    for (let i = 0; i < string_.length; i++) {
        hash = string_.charCodeAt(i) + ((hash << 5) - hash);
        hash &= hash;
    }

    return {
        h: hash % 360,
        l: lightness,
        s: saturation,
        string: `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`,
    };
};
