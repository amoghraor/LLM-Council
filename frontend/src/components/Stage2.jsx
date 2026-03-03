import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Stage2.css';

function deAnonymizeText(text, labelToModel) {
  if (!labelToModel) return text;

  let result = text;
  // Replace each "Response X" with the actual model name
  Object.entries(labelToModel).forEach(([label, model]) => {
    const modelShortName = model.split('/')[1] || model;
    result = result.replace(new RegExp(label, 'g'), `**${modelShortName}**`);
  });
  return result;
}

export default function Stage2({ rankings, labelToModel, aggregateRankings, semanticScores }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!rankings || rankings.length === 0) {
    return null;
  }

  return (
    <div className="stage stage2">
      <h3 className="stage-title">Stage 2: Peer Rankings</h3>

      <h4>Raw Evaluations</h4>
      <p className="stage-description">
        Each model evaluated all responses (anonymized as Response A, B, C, etc.) and provided rankings.
        Below, model names are shown in <strong>bold</strong> for readability, but the original evaluation used anonymous labels.
      </p>

      <div className="tabs">
        {rankings.map((rank, index) => (
          <button
            key={index}
            className={`tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {rank.model.split('/')[1] || rank.model}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div className="ranking-model">
          {rankings[activeTab].model}
        </div>
        <div className="ranking-content markdown-content">
          <ReactMarkdown>
            {deAnonymizeText(rankings[activeTab].ranking, labelToModel)}
          </ReactMarkdown>
        </div>

        {rankings[activeTab].parsed_ranking &&
         rankings[activeTab].parsed_ranking.length > 0 && (
          <div className="parsed-ranking">
            <strong>Extracted Ranking:</strong>
            <ol>
              {rankings[activeTab].parsed_ranking.map((label, i) => (
                <li key={i}>
                  {labelToModel && labelToModel[label]
                    ? labelToModel[label].split('/')[1] || labelToModel[label]
                    : label}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {aggregateRankings && aggregateRankings.length > 0 && (
        <div className="aggregate-rankings">
          <h4>Aggregate Rankings (Street Cred)</h4>
          <p className="stage-description">
            Combined results across all peer evaluations (lower score is better):
          </p>
          <div className="aggregate-list">
            {aggregateRankings.map((agg, index) => (
              <div key={index} className="aggregate-item">
                <span className="rank-position">#{index + 1}</span>
                <span className="rank-model">
                  {agg.model.split('/')[1] || agg.model}
                </span>
                <span className="rank-score">
                  Avg: {agg.average_rank.toFixed(2)}
                </span>
                <span className="rank-count">
                  ({agg.rankings_count} votes)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {semanticScores && semanticScores.relevance_to_query && (
        <div className="semantic-rankings">
          <h4>Semantic Relevance to Query</h4>
          <p className="stage-description">
            How closely each response relates to the original question (higher is better):
          </p>
          <div className="aggregate-list">
            {Object.entries(semanticScores.relevance_to_query)
              .sort(([, a], [, b]) => b - a)
              .map(([label, score], index) => (
                <div key={label} className="aggregate-item">
                  <span className="rank-position">#{index + 1}</span>
                  <span className="rank-model">
                    {labelToModel?.[label]
                      ? labelToModel[label].split('/')[1] || labelToModel[label]
                      : label}
                  </span>
                  <div className="relevance-bar-container">
                    <div
                      className="relevance-bar"
                      style={{ width: `${(score * 100).toFixed(1)}%` }}
                    />
                  </div>
                  <span className="rank-score">{(score * 100).toFixed(1)}%</span>
                </div>
              ))}
          </div>

          <h4>Response Similarity Matrix</h4>
          <p className="stage-description">
            How similar each pair of responses is to each other (high = redundant, low = unique):
          </p>
          <div className="similarity-matrix">
            {(() => {
              const labels = Object.keys(semanticScores.pairwise_matrix);
              return (
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      {labels.map(l => (
                        <th key={l}>
                          {labelToModel?.[l]?.split('/')[1] || l}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {labels.map(row => (
                      <tr key={row}>
                        <td><strong>{labelToModel?.[row]?.split('/')[1] || row}</strong></td>
                        {labels.map(col => {
                          const val = semanticScores.pairwise_matrix[row][col];
                          const isDiag = row === col;
                          const intensity = isDiag ? 0 : Math.round(val * 200);
                          return (
                            <td
                              key={col}
                              style={{
                                background: isDiag
                                  ? '#e0e0e0'
                                  : `rgba(74, 144, 226, ${val.toFixed(2)})`,
                                color: intensity > 120 ? 'white' : 'black',
                                textAlign: 'center',
                                padding: '6px 10px',
                              }}
                            >
                              {isDiag ? '—' : val.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
