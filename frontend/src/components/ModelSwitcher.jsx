import React, { useEffect, useState } from "react";
import { getModels } from "../api/client";

export default function ModelSwitcher({ value, onChange }) {
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const modelsData = await getModels();
        setModels(modelsData);
        setError(null);
      } catch (err) {
        setError("Failed to load models");
        setModels({});
        console.error("Failed to fetch models:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleProviderChange = (e) => {
    onChange({ ...value, provider: e.target.value, model: "" });
  };

  const handleModelChange = (e) => {
    onChange({ ...value, model: e.target.value });
  };

  const providers = Object.keys(models);

  return (
    <div 
      className="model-switcher"
      role="region"
      aria-label="Model selection"
    >
      <div className="select-wrapper">
        <label htmlFor="provider-select">Provider</label>
        <div className="custom-select">
          <select
            id="provider-select"
            value={value.provider}
            onChange={handleProviderChange}
            disabled={loading}
            aria-busy={loading}
          >
            <option value="" disabled>
              {loading ? "Loading providers..." : "Select provider"}
            </option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="select-wrapper">
        <label htmlFor="model-select">Model</label>
        <div className="custom-select">
          <select
            id="model-select"
            value={value.model}
            onChange={handleModelChange}
            disabled={!value.provider || loading}
            aria-busy={loading}
          >
            <option value="" disabled>
              {!value.provider 
                ? "Select provider first" 
                : loading 
                  ? "Loading models..." 
                  : "Select model"}
            </option>
            {(models[value.provider] || []).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {error && (
        <div 
          className="text-red-500 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
