/**
 * Editorial stock photography for the homepage, used until real Nasji
 * Culture lookbook and product photos are uploaded via the admin panel.
 * Sourced from Unsplash (free to use) and curated to feature Ghanaian /
 * West African men's kaftan, agbada and dashiki styling, shown in full
 * color.
 */
function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/**
 * Same as `unsplash()`, but zooms into a focal point of the source photo
 * (fx/fy are 0–1 fractions of the image). Used for the category tiles,
 * whose source photos include a second model that the crop excludes.
 */
function unsplashFocal(id: string, width: number, height: number, fx: number, fy: number, zoom = 1.8) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=focalpoint&fp-x=${fx}&fp-y=${fy}&fp-z=${zoom}&w=${width}&h=${height}&q=80`;
}

export const heroImage = unsplash("1648329008114-bce0ec0b5950", 900);

export const categoryTileImages = {
  dresses: unsplashFocal("1663044022557-7d5d4c1d5318", 400, 480, 0.22, 0.45),
  outerwear: unsplashFocal("1663043994777-7ed4b4e6cba3", 400, 480, 0.75, 0.45),
  accessories: unsplash("1556136412-3813d7367e4b", 700),
};

export const newSeasonImage = unsplash("1687952622898-4e9514a710d5", 900);
