import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

export default function Admin() {
  const { products, easterProducts, updateProduct, deleteProduct, resetToDefault } = useProducts();
  const [activeTab, setActiveTab] = useState('normal');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const currentList = activeTab === 'normal' ? products : easterProducts;

  const handleEdit = (product) => {
    console.log("Editando produto:", product);
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleSave = () => {
    console.log("Salvando produto:", editForm);
    try {
      updateProduct(editingId, editForm, activeTab === 'pascoa');
      setEditingId(null);
      alert("Produto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar. Verifique o console.");
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      try {
        deleteProduct(id, activeTab === 'pascoa');
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir. Verifique o console.");
      }
    }
  };

  const handleChange = (field, value, variationIndex = null, variationField = null) => {
    console.log(`Campo alterado: ${field} = ${value}`);
    
    if (variationIndex !== null) {
      // Editando uma variação específica
      setEditForm(prev => {
        const newVariations = [...prev.variations];
        const numValue = parseFloat(value);
        newVariations[variationIndex] = {
          ...newVariations[variationIndex],
          [variationField]: variationField === 'price' ? (isNaN(numValue) ? 0 : numValue) : value
        };
        return { ...prev, variations: newVariations };
      });
    } else if (field === 'price') {
      const numValue = parseFloat(value);
      setEditForm(prev => ({ ...prev, [field]: isNaN(numValue) ? 0 : numValue }));
    } else {
      setEditForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ products, easterProducts }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "backup_produtos.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          <div className="space-x-4">
            <button 
              onClick={exportData}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Exportar Backup
            </button>
            <button 
              onClick={() => {
                if(window.confirm('CUIDADO: Isso apagará todas as edições de texto/preço, mas manterá os produtos que você excluiu. Deseja continuar?')) resetToDefault(false);
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Resetar Edições
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('normal')}
            className={`px-6 py-2 rounded-full font-medium ${
              activeTab === 'normal' ? 'bg-primary text-white' : 'bg-white text-gray-600'
            }`}
          >
            Menu Tradicional
          </button>
          <button
            onClick={() => setActiveTab('pascoa')}
            className={`px-6 py-2 rounded-full font-medium ${
              activeTab === 'pascoa' ? 'bg-[#D4AF37] text-white' : 'bg-white text-gray-600'
            }`}
          >
            Menu de Páscoa
          </button>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Imagem (URL)</th>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Preço / Variações</th>
                <th className="p-4 text-left">Descrição</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-500 font-mono text-sm">{product.id}</td>
                  
                  {editingId === product.id ? (
                    <>
                      <td className="p-4 align-top">
                        <input
                          type="text"
                          value={editForm.image}
                          onChange={(e) => handleChange('image', e.target.value)}
                          className="w-full border p-1 rounded"
                          placeholder="/images/pasta/arquivo.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use caminho local (ex: /images/...) ou URL externa.
                        </p>
                      </td>
                      <td className="p-4 align-top">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="w-full border p-1 rounded font-bold"
                        />
                      </td>
                      <td className="p-4 align-top">
                        {editForm.hasVariations ? (
                          <div className="space-y-2">
                            {editForm.variations.map((v, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="w-16 font-bold">{v.size}:</span>
                                <input
                                  type="number"
                                  value={v.price}
                                  onChange={(e) => handleChange(null, e.target.value, idx, 'price')}
                                  className="w-20 border p-1 rounded"
                                  step="0.10"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                            className="w-24 border p-1 rounded"
                            step="0.10"
                          />
                        )}
                      </td>
                      <td className="p-4 align-top">
                        <textarea
                          value={editForm.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="w-full border p-1 rounded text-sm"
                          rows="2"
                        />
                      </td>
                      <td className="p-4 text-center space-x-2 align-top">
                        <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                          <FaSave size={20} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-700">
                          <FaTimes size={20} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4">
                        <img src={product.image} alt="" className="w-12 h-12 object-cover rounded" />
                      </td>
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-green-700 font-bold">
                        {product.hasVariations ? (
                          <div className="text-xs space-y-1">
                            {product.variations.map(v => (
                              <div key={v.size}>{v.size}: R$ {v.price.toFixed(2)}</div>
                            ))}
                          </div>
                        ) : (
                          `R$ ${product.price?.toFixed(2) || '0.00'}`
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{product.description}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Editar"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Excluir"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
