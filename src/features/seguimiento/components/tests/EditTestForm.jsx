/**
 * EditTestForm Component
 *
 * Componente que renderiza el formulario apropiado
 * según el tipo de test a editar
 */

import React from "react";
import SprintTestForm from "./SprintTestForm";
import YoyoTestForm from "./YoyoTestForm";
import EnduranceTestForm from "./EnduranceTestForm";
import TechnicalAssessmentForm from "./TechnicalAssessmentForm";

const EditTestForm = ({ test, mutation, onSuccess, onCancel }) => {
  const renderForm = () => {
    switch (test.test_type) {
      case "sprint_test":
        return (
          <SprintTestForm
            evaluationId={test.evaluation_id}
            mutation={mutation}
            onSuccess={onSuccess}
            isEdit={true}
            testData={test}
            onCancel={onCancel}
          />
        );
      case "yoyo_test":
        return (
          <YoyoTestForm
            evaluationId={test.evaluation_id}
            mutation={mutation}
            onSuccess={onSuccess}
            isEdit={true}
            testData={test}
            onCancel={onCancel}
          />
        );
      case "endurance_test":
        return (
          <EnduranceTestForm
            evaluationId={test.evaluation_id}
            mutation={mutation}
            onSuccess={onSuccess}
            isEdit={true}
            testData={test}
            onCancel={onCancel}
          />
        );
      case "technical_assessment":
        return (
          <TechnicalAssessmentForm
            evaluationId={test.evaluation_id}
            mutation={mutation}
            onSuccess={onSuccess}
            isEdit={true}
            testData={test}
            onCancel={onCancel}
          />
        );
      default:
        return <div>Tipo de test no soportado</div>;
    }
  };

  return renderForm();
};

export default EditTestForm;
