// Données issues de menu.ts - Lea Lou Pizzas et Burgers

export const categories = [
  { id: 'base-tomate', name: 'Base tomate', icon: '🍅' },
  { id: 'base-creme', name: 'Base crème', icon: '🥛' },
]

export const supplements = [
  'Viandes, saumon, ravioles, fromages: 2 EUR',
  'Oeuf: 1 EUR',
  'Légumes: 1.50 EUR',
]

export const menuMeta = {
  basePriceText: 'Calzones: prix de base + 2 EUR.',
  note: 'Pâte maison.',
}

// Génère un id unique à partir du nom
function slug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function imageKey(name) {
  const hasPlus = name.includes('+')
  const base = slug(name)
  return hasPlus ? base + '-plus' : base
}

const pizzaImages = {
  'marguerite': '/pizzas/pizza-marguerite.png',
  'marguerite-napolitaine': '/pizzas/pizza-marguerite-napolitaine.png',
  'forestiere': '/pizzas/pizza-forestiere.png',
  'poulet': '/pizzas/pizza-poulet.png',
  'reine': '/pizzas/pizza-reine.png',
  'napolitaine': '/pizzas/pizza-napolitaine.png',
  '4-fromages': '/pizzas/pizza-4-fromages.png',
  'la-bella-napoli': '/pizzas/pizza-la-bella-napoli.png',
  'burger': '/pizzas/pizza-burger.png',
  'bolognaise': '/pizzas/pizza-bolognaise.png',
  'bolognaise-plus': '/pizzas/pizza-bolognaise-plus.png',
  'chorizo': '/pizzas/pizza-chorizo.png',
  '4-saisons': '/pizzas/pizza-4-saisons.png',
  'orientale': '/pizzas/pizza-orientale.png',
  'orientale-plus': '/pizzas/pizza-orientale-plus.png',
  'kebab': '/pizzas/pizza-kebab.png',
  'kebab-plus': '/pizzas/pizza-kebab-plus.png',
  'la-kevin': '/pizzas/pizza-la-kevin.png',
  'hawai': '/pizzas/pizza-hawai.png',
  'la-colisee': '/pizzas/pizza-la-colisee.png',
  'vegetarienne-plus': '/pizzas/pizza-vegetarienne-plus.png',
  'la-savoyarde': '/pizzas/pizza-la-savoyarde.png',
  'poulet-curry': '/pizzas/pizza-poulet-curry.png',
  'chevre-miel': '/pizzas/pizza-chevre-miel.png',
  '6-fromages': '/pizzas/pizza-6-fromages.png',
  'raviole': '/pizzas/pizza-raviole.png',
  'saumon': '/pizzas/pizza-saumon.png',
  'rome': '/pizzas/pizza-rome.png',
  'la-regionale': '/pizzas/pizza-regionale.png',
  'saint-marcellin': '/pizzas/pizza-saint-marcellin.png',
  'la-truffee': '/pizzas/pizza-la-truffee.png',
  'tartiflette': '/pizzas/pizza-tartiflette.png',
}

export const menuItems = [
  { name: 'Marguerite', category: 'base-tomate', price: 8, ingredients: 'Mozzarella' },
  { name: 'Marguerite Napolitaine', category: 'base-tomate', price: 11, ingredients: "Tomate, Basilic, Burrata, tomate cerise, Huile d'olive" },
  { name: 'Forestiere', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, Champignons, Crème' },
  { name: 'Poulet', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, Oignons, Champignons, Poulet' },
  { name: 'Reine', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, Jambon, Champignons' },
  { name: 'Napolitaine', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, Anchois, Câpres' },
  { name: '4 Fromages', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, Emmental, Roquefort, Chèvre' },
  { name: 'La Colisee', category: 'base-tomate', price: 15, ingredients: 'Mozzarella, Égrené de bœuf, merguez, chorizo, oignons, Pommes de terre' },
  { name: 'Burger', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, Égrené de bœuf, Cheddar, Cornichons, Oignons' },
  { name: 'La Savoyarde', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, Jambon cru, Pommes de terre, Crème, raclette, Oignons' },
  { name: 'Bolognaise', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, Égrené de bœuf, Champignons' },
  { name: 'Bolognaise +', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, Égrené de bœuf, oignons, Champignons, roquefort' },
  { name: 'Chorizo', category: 'base-tomate', price: 10, ingredients: 'Mozzarella, Chorizo' },
  { name: '4 Saisons', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, Poivrons, Aubergines, Champignons' },
  { name: 'Orientale', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, Poivrons, Oignons, Merguez' },
  { name: 'Orientale +', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, Poivrons, Oignons, Merguez, Chorizo, tabasco' },
  { name: 'Kebab', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, Viande Kebab, Sauce (blanche ou Algérienne)' },
  { name: 'Kebab +', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, Viande Kebab, Sauce (blanche ou Algérienne), oignons' },
  { name: 'La Kevin', category: 'base-tomate', price: 14, ingredients: 'Mozzarella, Chèvre, Champignons, Poulet, Miel' },
  { name: 'Hawai', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, Jambon, Ananas' },
  { name: 'Vegetarienne +', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, Poivrons, Artichauts, Aubergines, Tomates cerise, roquette, balsamique' },
  { name: 'La Bella Napoli', category: 'base-tomate', price: 14, ingredients: 'Mozzarella, Basilic, Roquette, Jambon cru, Burrata, balsamique' },
  { name: 'Poulet Curry', category: 'base-creme', price: 12, ingredients: 'Mozzarella, Poulet curry, champignons' },
  { name: 'Chevre Miel', category: 'base-creme', price: 10, ingredients: 'Mozzarella, Chèvre, Miel' },
  { name: 'Raviole', category: 'base-creme', price: 12, ingredients: 'Mozzarella, Ravioles' },
  { name: 'Rome', category: 'base-creme', price: 14, ingredients: 'Mozzarella, Ravioles, Saumon fumé, Aneth' },
  { name: 'Saumon', category: 'base-creme', price: 12, ingredients: 'Mozzarella, Saumon fumé, Aneth' },
  { name: 'Saint Marcellin', category: 'base-creme', price: 12, ingredients: 'Mozzarella, Saint Marcellin, Noix' },
  { name: '6 Fromages', category: 'base-creme', price: 14, ingredients: 'Mozzarella, Emmental, roquefort, Chèvre, Reblochon, St Marcellin' },
  { name: 'Tartiflette', category: 'base-creme', price: 13, ingredients: 'Mozzarella, Pommes de terre, Oignons, Lardons, Reblochon' },
  { name: 'La Truffee', category: 'base-creme', price: 14, ingredients: 'Mozzarella, Champignons, crème, poudre de truffe, Burrata' },
  { name: 'La Regionale', category: 'base-creme', price: 14, ingredients: 'Mozzarella, Ravioles, Champignons, Roquefort, Noix' },
].map((item, i) => ({
  ...item,
  id: slug(item.name) || `pizza-${i}`,
  description: item.ingredients,
  sizes: { default: item.price },
  image: pizzaImages[imageKey(item.name)] || '/pizzas/pizza-marguerite.png',
}))
