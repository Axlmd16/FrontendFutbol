/**
 * ==============================================
 * Página de Evaluaciones - Kallpa UNL
 * ==============================================
 * 
 * Base para listar y crear evaluaciones.
 */

import { useEffect, useState } from 'react';
import seguimientoApi from '../services/seguimiento.api';
import EvaluationForm from '../components/EvaluationForm';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import Loader from '@/shared/components/Loader';

const EvaluationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchEvaluations = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await seguimientoApi.getEvaluations();
      setItems(data.data || data.items || data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (payload) => {
    setCreating(true);
    setError(null);

    try {
      await seguimientoApi.createEvaluation(payload);
      setCreateOpen(false);
      fetchEvaluations();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evaluaciones</h1>
            <p className="text-sm text-gray-500">Registro y consulta de evaluaciones deportivas</p>
          </div>
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            Nueva evaluación
          </Button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deportista</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                      Sin evaluaciones registradas.
                    </td>
                  </tr>
                ) : (
                  items.map((it) => (
                    <tr key={it.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{it.athleteId || it.athlete?.id || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{it.date || it.fecha || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{it.testType || it.tipo || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Crear evaluación">
          <EvaluationForm onSubmit={handleCreate} loading={creating} />
        </Modal>
      </div>
    </div>
  );
};

export default EvaluationsPage;
