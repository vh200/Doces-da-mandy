import { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, easterProducts as initialEasterProducts } from '../data/products';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  // Versão dos dados para invalidar cache antigo se a estrutura mudar
  const DATA_VERSION = 'v29_fix_cento_image_real';

  // Lista de IDs que DEVEM ser removidos permanentemente nesta versão (blacklist)
  // Útil para remover produtos que foram comentados no código mas podem estar persistindo no cache
  const FORCED_REMOVE_IDS = [5, 100, 101, 102, 103, 104, 105, 106, 107, 108, 110]; // Docinhos Temáticos, Antigos Ovos de Páscoa

  // Função auxiliar para carregar IDs excluídos
  const loadDeletedIds = () => {
    try {
      const saved = localStorage.getItem('deleted_product_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [deletedIds, setDeletedIds] = useState(loadDeletedIds);

  // Função auxiliar para carregar e validar dados
  const loadData = (key, initialData) => {
    try {
      const savedVersion = localStorage.getItem('data_version');
      const currentDeletedIds = loadDeletedIds();
      const savedData = localStorage.getItem(key);
      
      // Se a versão for diferente, fazemos um MERGE inteligente
      // Mantemos as edições do usuário (preço, nome, etc) mas trazemos novos campos do código
      if (savedVersion !== DATA_VERSION) {
        console.log(`Versão dos dados alterada de ${savedVersion} para ${DATA_VERSION}. Migrando dados...`);
        localStorage.setItem('data_version', DATA_VERSION);
        
        // Se não há dados salvos, usa o inicial filtrando excluídos e forçados
        if (!savedData) {
          return initialData.filter(p => !currentDeletedIds.includes(p.id) && !FORCED_REMOVE_IDS.includes(p.id));
        }

        const parsedSavedData = JSON.parse(savedData);
        
        // Combina dados iniciais (código) com dados salvos (usuário)
        // Prioridade: Dados salvos do usuário sobrescrevem dados do código
        // Exceto se for um produto novo no código que não existia antes
        const mergedData = initialData.map(initialItem => {
          const savedItem = parsedSavedData.find(p => p.id === initialItem.id);
          if (savedItem) {
            // CORREÇÃO FORÇADA: Se for o Cento Tradicional (ID 1), forçamos a imagem nova
            // Isso corrige o problema de cache onde o usuário tem o link quebrado salvo no localStorage
            if (initialItem.id === 1) {
                savedItem.image = initialItem.image;
                savedItem.imageFit = initialItem.imageFit;
            }

            // Mescla: propriedades do código + propriedades salvas (salvas ganham)
            return { ...initialItem, ...savedItem };
          }
          return initialItem; // Novo produto no código
        });

        // Opcional: Adicionar produtos que foram criados apenas no localStorage (se quisermos manter produtos criados pelo usuário que não estão no código)
        // Por enquanto, vamos manter apenas o que está no código ou foi editado.
        // Se o usuário criou um produto novo que não existe no código, ele seria perdido aqui com o .map do initialData.
        // Para manter produtos criados pelo usuário:
        const userCreatedProducts = parsedSavedData.filter(savedItem => 
          !initialData.find(initialItem => initialItem.id === savedItem.id)
        );

        const finalData = [...mergedData, ...userCreatedProducts].filter(p => 
          !currentDeletedIds.includes(p.id) && !FORCED_REMOVE_IDS.includes(p.id)
        );
        
        // Atualiza o cache com a versão mergeada
        localStorage.setItem(key, JSON.stringify(finalData));
        return finalData;
      }

      // Se a versão é a mesma, carrega do cache normal
      if (!savedData) {
        return initialData.filter(p => !currentDeletedIds.includes(p.id) && !FORCED_REMOVE_IDS.includes(p.id));
      }

      const parsedData = JSON.parse(savedData);
      return parsedData.filter(p => !currentDeletedIds.includes(p.id) && !FORCED_REMOVE_IDS.includes(p.id));
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
      return initialData;
    }
  };

  const [products, setProducts] = useState(() => loadData('products', initialProducts));
  const [easterProducts, setEasterProducts] = useState(() => loadData('easterProducts', initialEasterProducts));

  // Salva IDs excluídos sempre que mudar
  useEffect(() => {
    localStorage.setItem('deleted_product_ids', JSON.stringify(deletedIds));
  }, [deletedIds]);

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
      localStorage.setItem('data_version', DATA_VERSION); // Garante que a versão esteja salva
    } catch (error) {
      console.error("Erro ao salvar produtos no localStorage:", error);
    }
  }, [products]);

  // Patch para corrigir "Brigadinho" -> "Brigadeiro" se existir no estado atual (sem resetar versão)
  useEffect(() => {
    setEasterProducts(prev => prev.map(p => {
      if (p.id === 200 && p.availableFlavors && p.availableFlavors.includes("Brigadinho")) {
        console.log("Corrigindo typo 'Brigadinho' para 'Brigadeiro' no produto 200");
        return {
          ...p,
          availableFlavors: p.availableFlavors.map(f => f === "Brigadinho" ? "Brigadeiro" : f)
        };
      }
      return p;
    }));
  }, []); // Executa apenas uma vez na montagem (ou reload)

  useEffect(() => {
    try {
      localStorage.setItem('easterProducts', JSON.stringify(easterProducts));
    } catch (error) {
      console.error("Erro ao salvar produtos de Páscoa no localStorage:", error);
    }
  }, [easterProducts]);

  // Função para atualizar um produto
  const updateProduct = (id, updatedData, isEaster = false) => {
    if (isEaster) {
      setEasterProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    } else {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    }
  };

  // Função para excluir um produto
  const deleteProduct = (id, isEaster = false) => {
    // Adiciona ID à lista de excluídos permanentes
    setDeletedIds(prev => {
      const newIds = [...prev, id];
      // Salva imediatamente para garantir
      localStorage.setItem('deleted_product_ids', JSON.stringify(newIds));
      return newIds;
    });

    if (isEaster) {
      setEasterProducts(prev => prev.filter(p => p.id !== id));
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Função para resetar para o padrão (limpar localStorage)
  const resetToDefault = (hardReset = false) => {
    localStorage.removeItem('products');
    localStorage.removeItem('easterProducts');
    
    if (hardReset) {
      // Limpa até a lista de excluídos (Fábrica)
      localStorage.removeItem('deleted_product_ids');
      setDeletedIds([]);
      setProducts(initialProducts.filter(p => !FORCED_REMOVE_IDS.includes(p.id)));
      setEasterProducts(initialEasterProducts.filter(p => !FORCED_REMOVE_IDS.includes(p.id)));
    } else {
      // Mantém exclusões, apenas reseta edições
      setProducts(initialProducts.filter(p => !deletedIds.includes(p.id) && !FORCED_REMOVE_IDS.includes(p.id)));
      setEasterProducts(initialEasterProducts.filter(p => !deletedIds.includes(p.id) && !FORCED_REMOVE_IDS.includes(p.id)));
    }
  };

  return (
    <ProductContext.Provider value={{ products, easterProducts, updateProduct, deleteProduct, resetToDefault }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
