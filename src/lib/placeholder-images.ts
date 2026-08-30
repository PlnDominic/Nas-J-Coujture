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

export const heroImage = unsplash("1648329008114-bce0ec0b5950", 900);

export const categoryTileImages = {
  dresses: unsplash("1780601247169-687a1c24b84d", 700),
  outerwear: unsplash("1780601247035-e34a7b06d35b", 700),
  accessories: unsplash("1556136412-3813d7367e4b", 700),
};

export const newSeasonImage = unsplash("1687952622898-4e9514a710d5", 900);
