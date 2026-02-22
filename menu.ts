export type MenuCategory = "base-tomate" | "base-creme";

export type MenuItem = {
  name: string;
  category: MenuCategory;
  price: number;
  ingredients: string;
};

export const menuItems: MenuItem[] = [
  // BASE TOMATE
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
    ingredients: "Tomate, Basilic, Burrata, tomate cerise, Huile d'olive",
  },
  {
    name: "Forestiere",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, Champignons, Crème",
  },
  {
    name: "Poulet",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, Oignons, Champignons, Poulet",
  },
  {
    name: "Reine",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, Jambon, Champignons",
  },
  {
    name: "Napolitaine",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, Anchois, Câpres",
  },
  {
    name: "4 Fromages",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, Emmental, Roquefort, Chèvre",
  },
  {
    name: "La Colisee",
    category: "base-tomate",
    price: 15,
    ingredients: "Mozzarella, Égrené de bœuf, merguez, chorizo, oignons, Pommes de terre",
  },
  {
    name: "Burger",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, Égrené de bœuf, Cheddar, Cornichons, Oignons",
  },
  {
    name: "La Savoyarde",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, Jambon cru, Pommes de terre, Crème, raclette, Oignons",
  },
  {
    name: "Bolognaise",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, Égrené de bœuf, Champignons",
  },
  {
    name: "Bolognaise +",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, Égrené de bœuf, oignons, Champignons, roquefort",
  },
  {
    name: "Chorizo",
    category: "base-tomate",
    price: 10,
    ingredients: "Mozzarella, Chorizo",
  },
  {
    name: "4 Saisons",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, Poivrons, Aubergines, Champignons",
  },
  {
    name: "Orientale",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, Poivrons, Oignons, Merguez",
  },
  {
    name: "Orientale +",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, Poivrons, Oignons, Merguez, Chorizo, tabasco",
  },
  {
    name: "Kebab",
    category: "base-tomate",
    price: 11,
    ingredients: "Mozzarella, Viande Kebab, Sauce (blanche ou Algérienne)",
  },
  {
    name: "Kebab +",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, Viande Kebab, Sauce (blanche ou Algérienne), oignons",
  },
  {
    name: "La Kevin",
    category: "base-tomate",
    price: 14,
    ingredients: "Mozzarella, Chèvre, Champignons, Poulet, Miel",
  },
  {
    name: "Hawai",
    category: "base-tomate",
    price: 12,
    ingredients: "Mozzarella, Jambon, Ananas",
  },
  {
    name: "Vegetarienne +",
    category: "base-tomate",
    price: 13,
    ingredients: "Mozzarella, Poivrons, Artichauts, Aubergines, Tomates cerise, roquette, balsamique",
  },
  {
    name: "La Bella Napoli",
    category: "base-tomate",
    price: 14,
    ingredients: "Mozzarella, Basilic, Roquette, Jambon cru, Burrata, balsamique",
  },
  // BASE CRÈME
  {
    name: "Poulet Curry",
    category: "base-creme",
    price: 12,
    ingredients: "Mozzarella, Poulet curry, champignons",
  },
  {
    name: "Chevre Miel",
    category: "base-creme",
    price: 10,
    ingredients: "Mozzarella, Chèvre, Miel",
  },
  {
    name: "Raviole",
    category: "base-creme",
    price: 12,
    ingredients: "Mozzarella, Ravioles",
  },
  {
    name: "Rome",
    category: "base-creme",
    price: 14,
    ingredients: "Mozzarella, Ravioles, Saumon fumé, Aneth",
  },
  {
    name: "Saumon",
    category: "base-creme",
    price: 12,
    ingredients: "Mozzarella, Saumon fumé, Aneth",
  },
  {
    name: "Saint Marcellin",
    category: "base-creme",
    price: 12,
    ingredients: "Mozzarella, Saint Marcellin, Noix",
  },
  {
    name: "6 Fromages",
    category: "base-creme",
    price: 14,
    ingredients: "Mozzarella, Emmental, roquefort, Chèvre, Reblochon, St Marcellin",
  },
  {
    name: "Tartiflette",
    category: "base-creme",
    price: 13,
    ingredients: "Mozzarella, Pommes de terre, Oignons, Lardons, Reblochon",
  },
  {
    name: "La Truffee",
    category: "base-creme",
    price: 14,
    ingredients: "Mozzarella, Champignons, crème, poudre de truffe, Burrata",
  },
  {
    name: "La Regionale",
    category: "base-creme",
    price: 14,
    ingredients: "Mozzarella, Ravioles, Champignons, Roquefort, Noix",
  },
];

export const supplements = [
  "Viandes, saumon, ravioles, fromages: 2 EUR",
  "Oeuf: 1 EUR",
  "Légumes: 1.50 EUR",
];

export const menuMeta = {
  basePriceText: "Calzones: prix de base + 2 EUR.",
  note: "Pâte maison.",
};
