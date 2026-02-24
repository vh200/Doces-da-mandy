// Atenção:
// As imagens devem ser colocadas nas pastas:
// - Tradicionais: public/images/tradicional/
// - Páscoa: public/images/pascoa/
// O nome do arquivo deve ser igual ao que está definido abaixo (ex: brigadeiro.jpg).
// Enquanto você não colocar a foto real, o site mostrará um ícone de imagem quebrada ou espaço vazio.

export const products = [
  // --- DOCINHOS TRADICIONAIS ---
  {
    id: 1,
    name: "Cento Tradicional",
    description: "Os clássicos que todo mundo ama. 100 unidades.",
    image: "/images/tradicional/cento_tradicional_v3.jpeg",
    category: "Festa (Centos)",
    imageFit: "contain",
    hasVariations: true,
    variations: [
      { size: "100 un", price: 140.00, maxFlavors: 4 },
      { size: "50 un", price: 80.00, maxFlavors: 2 }
    ],
    availableFlavors: ["Brigadeiro", "Beijinho", "Casadinho", "Nesquik", "Prestígio", "Paçoca"]
  },

  // --- DOCINHOS GOURMET ---
  {
    id: 3,
    name: "Docinhos Gourmet 50un",
    description: "Escolha entre os sabores especiais.",
    image: "/images/tradicional/DocinhosGourmet50UN.jpeg",
    category: "Festa (Centos)",
    hasVariations: true,
    variations: [
      { size: "50 un", price: 90.00, maxFlavors: 4 }
    ],
    availableFlavors: ["Ferrero", "Ninho com Nutella", "Stikadinho", "Oreo", "Confete", "KitKat", "Maracujá"]
  },
  {
    id: 4,
    name: "Cento Gourmet",
    description: "Cento de docinhos gourmet (100 unidades).",
    image: "/images/tradicional/CentoGourmet.jpeg",
    category: "Festa (Centos)",
    hasVariations: true,
    variations: [
      { size: "100 un", price: 180.00, maxFlavors: 4 }
    ],
    availableFlavors: ["Ferrero", "Ninho com Nutella", "Stikadinho", "Oreo", "Confete", "KitKat", "Maracujá"]
  },

  // --- DOCINHOS TEMÁTICOS ---
  /*
  {
    id: 5,
    name: "Docinhos Temáticos",
    description: "Personalizados para sua festa. Sabores: Brigadeiro ou Ninho.",
    image: "/images/tradicional/cento_tematico.jpg",
    category: "Festa (Centos)",
    hasVariations: true,
    variations: [
      { size: "50 un", price: 100.00, maxFlavors: 1 },
      { size: "100 un", price: 190.00, maxFlavors: 1 }
    ],
    availableFlavors: ["Brigadeiro", "Ninho"]
  },
  */
    
  // --- MINI BROWNIES ---
  {
    id: 7,
    name: "Mini Brownie",
    description: "Mini brownies deliciosos. Sabores: Ninho ou Brigadeiro.",
    image: "/images/tradicional/MiniBrownie.jpeg",
    category: "Festa (Centos)",
    hasVariations: true,
    variations: [
      { size: "50 un", price: 100.00, maxFlavors: 1 },
      { size: "100 un", price: 190.00, maxFlavors: 2 }
    ],
    availableFlavors: ["Ninho", "Brigadeiro"]
  },
  {
    id: 8,
    name: "Mini Brownie Personalizado",
    description: "Personalize seu brownie do jeito que você quiser! Detalhes via DM.",
    image: "/images/tradicional/MiniBrowniePersonalizado.jpeg",
    category: "Festa (Centos)",
    hasVariations: true,
    variations: [
      { size: "50 un", price: 100.00, maxFlavors: 1 },
      { size: "100 un", price: 190.00, maxFlavors: 1 }
    ],
    availableFlavors: ["Personalizado (Combinar detalhes)"]
  },
  {
    id: 9,
    name: "Caixinha com 12 Unidades",
    description: "Linda caixinha para presente com 12 docinhos.",
    price: 30.00,
    image: "/images/tradicional/Caixinhacom12UN.jpeg",
    category: "Especiais",
    hasVariations: false,
    allowFlavorSelection: true,
    maxFlavors: 4,
    availableFlavors: ["Brigadeiro", "Beijinho", "Casadinho", "Nesquik", "Prestígio", "Paçoca", "Ferrero", "Ninho com Nutella", "Stikadinho", "Oreo", "Confete", "KitKat", "Maracujá"]
  }
];

export const easterProducts = [
  // --- OVOS DE COLHER CLÁSSICOS ---
  {
    id: 200,
    name: "Ovo de Colher Clássico (250g)",
    description: "Tamanho único 250g. Escolha seu sabor favorito.",
    price: 55.00,
    image: "/images/pascoa/OvosDeColherClássico.jpeg",
    category: "Ovos de Colher",
    hasVariations: false,
    allowFlavorSelection: true,
    maxFlavors: 1,
    availableFlavors: ["Brigadeiro", "Beijinho", "Dois Amores", "Ninho", "Paçoca"]
  },

  // --- OVOS DE COLHER PREMIUM ---
  {
    id: 201,
    name: "Ovo de Colher Premium (250g)",
    description: "Tamanho único 250g. Recheios gourmet especiais.",
    price: 60.00,
    image: "/images/pascoa/OvosdeColherPremium.jpeg",
    category: "Ovos de Colher",
    hasVariations: false,
    allowFlavorSelection: true,
    maxFlavors: 1,
    availableFlavors: ["Ninho com Nutella", "Oreo", "KitKat", "Kinder", "Ferrero", "Maracujá", "Stikadinho"]
  },

  // --- OVO CASCA DE BROWNIE ---
  {
    id: 202,
    name: "Ovo de Colher Casca de Brownie (250g)",
    description: "Casca de Brownie com recheio de Dois Amores, pedaços de Brownie e Nutella.",
    price: 65.00,
    image: "/images/pascoa/CascaDeBrownie250g65reais.jpeg",
    category: "Ovos de Colher",
    hasVariations: false,
    allowFlavorSelection: true,
    maxFlavors: 1,
    availableFlavors: ["Dois Amores com Brownie e Nutella"]
  },

  // --- LINHA KIDS ---
  {
    id: 203,
    name: "Controle de Chocolate",
    description: "Controle de vídeo game de chocolate. Escolha o sabor.",
    price: 45.00,
    image: "/images/pascoa/Controle45reais.jpeg",
    category: "Linha Kids",
    hasVariations: false,
    allowFlavorSelection: true,
    maxFlavors: 1,
    availableFlavors: ["Ninho", "Brigadeiro"]
  },
  {
    id: 204,
    name: "Kit Confeiteiro (Linha Kids)",
    description: "Kit para a criança decorar! Acompanha confete, granulado, marshmallow e brigadeiro.",
    price: 50.00,
    image: "/images/pascoa/KItConfeiteiro.jpeg",
    category: "Linha Kids",
    hasVariations: false,
    allowFlavorSelection: false
  }
];
