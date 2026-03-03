import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Stage1.css';

export default function Stage1({ responses, semanticScores, labelToModel }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!responses || responses.length === 0) {
    return null;
  }

  // Find the most relevant model based on semantic scores
  let mostRelevantIndex = -1;
  if (semanticScores && semanticScores.relevance_to_query && labelToModel) {
    let maxScore = -1;
    Object.entries(semanticScores.relevance_to_query).forEach(([label, score]) => {
      const modelName = labelToModel[label];
      const index = responses.findIndex(r => r.model === modelName);
      if (index !== -1 && score > maxScore) {
        maxScore = score;
        mostRelevantIndex = index;
      }
    });
  }

  return (
    <div className="stage stage1">
      <h3 className="stage-title">Stage 1: Individual Responses</h3>

      <div className="tabs">
        {responses.map((resp, index) => (
          <button
            key={index}
            className={`tab ${activeTab === index ? 'active' : ''} ${index === mostRelevantIndex ? 'most-relevant' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {index === mostRelevantIndex && <span className="star-badge"></span>}
            {resp.model.split('/')[1] || resp.model}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div className="model-name">
          {responses[activeTab].model}
          {activeTab === mostRelevantIndex && (
            <span className="relevance-badge">Most Relevant to Query</span>
          )}
        </div>
        <div className="response-text markdown-content">
          <ReactMarkdown>{responses[activeTab].response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
