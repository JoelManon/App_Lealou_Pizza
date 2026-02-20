export type MenuCategory = "base-tomate" | "base-creme";

export type MenuItem = {
  name: string;
  category: MenuCategory;
  price: number;
  ingredients: string;
};

export const menuItems: MenuItem[] = [
  {
    name: "Marguerite",
    category: "base-tomate",
    price: 8,
    ingredients: "Mozzarella",
  },
  {
    name: "Marguerite Napolitaine",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, basilic, tomates cerises, huile d'olive",
  },
  {
    name: "Forestiere",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, champignons, creme",
  },
  {
    name: "Poulet",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, oignons, champignons, poulet",
  },
  {
    name: "Reine",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, jambon, champignons",
  },
  {
    name: "Napolitaine",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, anchois, capres",
  },
  {
    name: "4 Fromages",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, emmental, roquefort, chevre",
  },
  {
    name: "La Bella Napoli",
    category: "base-tomate",
    price: 14,
    ingredients: "Mozzarella, roquette, burrata, balsamique",
  },
  {
    name: "Burger",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, egrene de boeuf, cheddar, cornichons, oignons",
  },
  {
    name: "Bolognaise",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, egrene de boeuf, champignons",
  },
  {
    name: "Bolognaise +",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, egrene de boeuf, oignons, champignons, roquefort",
  },
  {
    name: "Chorizo",
    category: "base-tomate",
    price: 10,
    ingredients: "Mozzarella, chorizo",
  },
  {
    name: "4 Saisons",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, poivrons, aubergines, champignons",
  },
  {
    name: "Orientale",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, poivrons, oignons, merguez",
  },
  {
    name: "Orientale +",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, poivrons, oignons, merguez, chorizo, tabasco",
  },
  {
    name: "Poulet",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, oignons, champignons, poulet",
  },
  {
    name: "Kebab",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, viande kebab, sauce blanche ou algerienne",
  },
  {
    name: "Kebab +",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, viande kebab, sauce blanche ou algerienne, oignons",
  },
  {
    name: "La Kevin",
    category: "base-tomate",
    price: 14,
    ingredients: "Mozzarella, chevre, champignons, poulet, miel",
  },
  {
    name: "Hawai",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, jambon, ananas",
  },
  {
    name: "La Colisee",
    category: "base-tomate",
    price: 15,
    ingredients: "Mozzarella, merguez, chorizo, egrene de boeuf, pommes de terre",
  },
  {
    name: "Vegetarienne +",
    category: "base-tomate",
    price: 13,
    ingredients:
      "Mozzarella, poivrons, aubergine, artichauts, roquette, tomate cerise, balsamique",
  },
  {
    name: "La Savoyarde",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, jambon cru, oignons, raclette, pommes de terre",
  },
  {
    name: "Poulet Curry",
    category: "base-creme",
    price: 12,
    ingredients: "Mozzarella, poulet curry, champignons, creme",
  },
  {
    name: "Chevre Miel",
    category: "base-creme",
    price: 10,
    ingredients: "Mozzarella, chevre, miel, creme",
  },
  {
    name: "6 Fromages",
    category: "base-creme",
    price: 14,
    ingredients: "Mozzarella, emmental, saint marcellin, roquefort, chevre, reblochon",
  },
  {
    name: "Raviole",
    category: "base-creme",
    price: 12,
    ingredients: "Mozzarella, ravioles, creme",
  },
  {
    name: "Saumon",
    category: "base-creme",
    price: 12,
    ingredients: "Mozzarella, saumon fume, aneth",
  },
  {
    name: "Rome",
    category: "base-creme",
    price: 14,
    ingredients: "Mozzarella, ravioles, saumon fume, creme, aneth",
  },
  {
    name: "La Regionale",
    category: "base-creme",
    price: 14,
    ingredients: "Mozzarella, ravioles, roquefort, noix, champignons",
  },
  {
    name: "Saint Marcellin",
    category: "base-creme",
    price: 12,
    ingredients: "Mozzarella, saint marcellin, noix",
  },
  {
    name: "La Truffee",
    category: "base-creme",
    price: 14,
    ingredients: "Mozzarella, champignons, poudre de truffe, burrata, balsamique",
  },
  {
    name: "Tartiflette",
    category: "base-creme",
    price: 13,
    ingredients: "Mozzarella, pommes de terre, oignons, lardons, reblochon",
  },
];

export const supplements = [
  "Viandes, saumon, ravioles, fromages: 2 EUR",
  "Oeuf: 1 EUR",
  "Legumes: 1.50 EUR",
];

export const menuMeta = {
  basePriceText: "Calzones: prix de base + 2 EUR.",
  note: "Pate maison.",
};
