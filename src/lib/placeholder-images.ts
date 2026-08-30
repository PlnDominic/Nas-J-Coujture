/**
 * Editorial stock photography for the homepage, used until real Nasji
 * Culture lookbook and product photos are uploaded via the admin panel.
 * Sourced from Unsplash (free to use); rendered in grayscale on the page
 * to match the site's black-and-white editorial style.
 */
function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const heroImage = unsplash("1495385794356-15371f348c31", 900);

export const categoryTileImages = {
  dresses: unsplash("1496747611176-843222e1e57c", 700),
  outerwear: unsplash("1521341957697-b93449760f30", 700),
  accessories: unsplash("1490114538077-0a7f8cb49891", 700),
};

export const newSeasonImage = unsplash("1552374196-c4e7ffc6e126", 900);
