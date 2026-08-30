/**
 * Editorial stock photography for the homepage, used until real Nasji
 * Culture lookbook and product photos are uploaded via the admin panel.
 * Sourced from Unsplash (free to use) and curated to feature Ghanaian /
 * West African kaftan and print dress styling; rendered in grayscale on
 * the page to match the site's black-and-white editorial style.
 */
function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const heroImage = unsplash("1687052093309-7a14efa58ecb", 900);

export const categoryTileImages = {
  dresses: unsplash("1681545290284-679e6291c440", 700),
  outerwear: unsplash("1664151099399-d41ed991a10d", 700),
  accessories: unsplash("1664151100152-333a5c85efbe", 700),
};

export const newSeasonImage = unsplash("1650562325232-538b70cccb32", 900);
