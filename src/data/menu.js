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

export const menuItems = [
  { name: 'Marguerite', category: 'base-tomate', price: 8, ingredients: 'Mozzarella' },
  { name: 'Marguerite Napolitaine', category: 'base-tomate', price: 11, ingredients: "Mozzarella, basilic, tomates cerises, huile d'olive" },
  { name: 'Forestiere', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, champignons, crème' },
  { name: 'Poulet', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, oignons, champignons, poulet' },
  { name: 'Reine', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, jambon, champignons' },
  { name: 'Napolitaine', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, anchois, câpres' },
  { name: '4 Fromages', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, emmental, roquefort, chèvre' },
  { name: 'La Bella Napoli', category: 'base-tomate', price: 14, ingredients: 'Mozzarella, roquette, burrata, balsamique' },
  { name: 'Burger', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, haché boeuf, cheddar, cornichons, oignons' },
  { name: 'Bolognaise', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, haché boeuf, champignons' },
  { name: 'Bolognaise +', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, haché boeuf, oignons, champignons, roquefort' },
  { name: 'Chorizo', category: 'base-tomate', price: 10, ingredients: 'Mozzarella, chorizo' },
  { name: '4 Saisons', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, poivrons, aubergines, champignons' },
  { name: 'Orientale', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, poivrons, oignons, merguez' },
  { name: 'Orientale +', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, poivrons, oignons, merguez, chorizo, tabasco' },
  { name: 'Kebab', category: 'base-tomate', price: 11, ingredients: 'Mozzarella, viande kebab, sauce blanche ou algérienne' },
  { name: 'Kebab +', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, viande kebab, sauce blanche ou algérienne, oignons' },
  { name: 'La Kevin', category: 'base-tomate', price: 14, ingredients: 'Mozzarella, chèvre, champignons, poulet, miel' },
  { name: 'Hawai', category: 'base-tomate', price: 12, ingredients: 'Mozzarella, jambon, ananas' },
  { name: 'La Colisee', category: 'base-tomate', price: 15, ingredients: 'Mozzarella, merguez, chorizo, haché boeuf, pommes de terre' },
  { name: 'Vegetarienne +', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, poivrons, aubergine, artichauts, roquette, tomate cerise, balsamique' },
  { name: 'La Savoyarde', category: 'base-tomate', price: 13, ingredients: 'Mozzarella, jambon cru, oignons, raclette, pommes de terre' },
  { name: 'Poulet Curry', category: 'base-creme', price: 12, ingredients: 'Mozzarella, poulet curry, champignons, crème' },
  { name: 'Chevre Miel', category: 'base-creme', price: 10, ingredients: 'Mozzarella, chèvre, miel, crème' },
  { name: '6 Fromages', category: 'base-creme', price: 14, ingredients: 'Mozzarella, emmental, saint marcellin, roquefort, chèvre, reblochon' },
  { name: 'Raviole', category: 'base-creme', price: 12, ingredients: 'Mozzarella, ravioles, crème' },
  { name: 'Saumon', category: 'base-creme', price: 12, ingredients: 'Mozzarella, saumon fumé, aneth' },
  { name: 'Rome', category: 'base-creme', price: 14, ingredients: 'Mozzarella, ravioles, saumon fumé, crème, aneth' },
  { name: 'La Regionale', category: 'base-creme', price: 14, ingredients: 'Mozzarella, ravioles, roquefort, noix, champignons' },
  { name: 'Saint Marcellin', category: 'base-creme', price: 12, ingredients: 'Mozzarella, saint marcellin, noix' },
  { name: 'La Truffee', category: 'base-creme', price: 14, ingredients: 'Mozzarella, champignons, poudre de truffe, burrata, balsamique' },
  { name: 'Tartiflette', category: 'base-creme', price: 13, ingredients: 'Mozzarella, pommes de terre, oignons, lardons, reblochon' },
].map((item, i) => ({
  ...item,
  id: slug(item.name) || `pizza-${i}`,
  description: item.ingredients,
  sizes: { default: item.price },
  // Placeholder - remplacer par vos images
  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
}))
