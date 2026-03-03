import ReactMarkdown from 'react-markdown';
import './Stage3.css';

export default function Stage3({ finalResponse, semanticScores, labelToModel, aggregateRankings }) {
  if (!finalResponse) {
    return null;
  }

  // Generate insight banner content
  const generateInsight = () => {
    if (!semanticScores || !semanticScores.relevance_to_query || !labelToModel) {
      return null;
    }

    // Find most and least relevant models
    const relevanceEntries = Object.entries(semanticScores.relevance_to_query)
      .map(([label, score]) => ({
        model: labelToModel[label]?.split('/')[1] || label,
        score: score
      }))
      .sort((a, b) => b.score - a.score);

    if (relevanceEntries.length === 0) return null;

    const mostRelevant = relevanceEntries[0];
    const avgRelevance = relevanceEntries.reduce((sum, e) => sum + e.score, 0) / relevanceEntries.length;

    // Calculate average similarity (excluding diagonal)
    let totalSim = 0;
    let count = 0;
    if (semanticScores.pairwise_matrix) {
      const labels = Object.keys(semanticScores.pairwise_matrix);
      labels.forEach(row => {
        labels.forEach(col => {
          if (row !== col) {
            totalSim += semanticScores.pairwise_matrix[row][col];
            count++;
          }
        });
      });
    }
    const avgSimilarity = count > 0 ? totalSim / count : 0;

    // Determine diversity level
    let diversityLevel = 'moderate';
    let diversityColor = '#4a90e2';
    if (avgSimilarity < 0.5) {
      diversityLevel = 'high';
      diversityColor = '#2d8a2d';
    } else if (avgSimilarity > 0.7) {
      diversityLevel = 'low';
      diversityColor = '#f57c00';
    }

    return {
      mostRelevant,
      avgRelevance,
      avgSimilarity,
      diversityLevel,
      diversityColor,
      responseCount: relevanceEntries.length
    };
  };

  const insight = generateInsight();

  return (
    <div className="stage stage3">
      <h3 className="stage-title">Stage 3: Final Council Answer</h3>
      
      {insight && (
        <div className="insight-banner">
          <div className="insight-icon"></div>
          <div className="insight-content">
            <h4>How Semantic Analysis Influenced This Answer</h4>
            <div className="insight-stats">
              <div className="insight-stat">
                <span className="stat-label">Most Relevant Response:</span>
                <span className="stat-value highlight">{insight.mostRelevant.model}</span>
                <span className="stat-detail">({(insight.mostRelevant.score * 100).toFixed(1)}% match)</span>
              </div>
              <div className="insight-stat">
                <span className="stat-label">Average Relevance:</span>
                <span className="stat-value">{(insight.avgRelevance * 100).toFixed(1)}%</span>
              </div>
              <div className="insight-stat">
                <span className="stat-label">Response Diversity:</span>
                <span className="stat-value" style={{ color: insight.diversityColor }}>
                  {insight.diversityLevel.toUpperCase()}
                </span>
                <span className="stat-detail">
                  ({insight.avgSimilarity < 0.5 ? 'Unique perspectives' : 
                    insight.avgSimilarity > 0.7 ? 'Similar viewpoints' : 
                    'Balanced mix'})
                </span>
              </div>
            </div>
            <p className="insight-explanation">
              The chairman synthesized {insight.responseCount} responses, weighing both peer rankings and 
              semantic relevance. {insight.diversityLevel === 'high' ? 
                'The diverse perspectives provided a comprehensive view.' :
                insight.diversityLevel === 'low' ?
                'The consensus among models strengthened confidence in the answer.' :
                'The balanced mix of perspectives informed a well-rounded response.'}
            </p>
          </div>
        </div>
      )}

      <div className="final-response">
        <div className="chairman-label">
          Chairman: {finalResponse.model.split('/')[1] || finalResponse.model}
        </div>
        <div className="final-text markdown-content">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
