/**
 * ==============================================
 * Formulario de Evaluación - Kallpa UNL
 * ==============================================
 * 
 * Formulario base para registrar una evaluación.
 * Mantiene UI separada del servicio HTTP.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import TestSelector from './TestSelector';

const EvaluationForm = ({ onSubmit, loading = false }) => {
  const [form, setForm] = useState({
    athleteId: '',
    date: '',
    testType: 'sprint',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="ID Deportista"
          name="athleteId"
          value={form.athleteId}
          onChange={handleChange}
          placeholder="Ej: 123"
          disabled={loading}
          required
        />

        <Input
          label="Fecha"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <TestSelector
          value={form.testType}
          onChange={(v) => setForm((prev) => ({ ...prev, testType: v }))}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          placeholder="Notas de la evaluación..."
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={loading} disabled={loading}>
          Guardar evaluación
        </Button>
      </div>
    </form>
  );
};

EvaluationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default EvaluationForm;
