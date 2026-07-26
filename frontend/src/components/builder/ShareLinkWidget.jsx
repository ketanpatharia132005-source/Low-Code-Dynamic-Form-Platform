import React, { useState } from 'react';

export default function ShareLinkWidget({ formId, isPublished, versionNumber, onLinkGenerated, }) {
  const [linkData, setLinkData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateLink = async () => {
    setLoading(true);
    setError('');
    try {
      
      const response = await fetch(`http://localhost:8001/api/v1/forms/${formId}/generate-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust if you store tokens differently
        }
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to generate link');
      }
      
      const data = await response.json();
      console.log(data);

      console.log("Generate Link Response:", data);

// Backend may return token or url.
// Always build the correct frontend URL.

      const token =
          data.token ||
          data.share_token ||
          data.public_token ||
          data.url?.split("/").pop();

      setLinkData({
        ...data,
        url: `${window.location.origin}/f/${token}`,
       });
       onLinkGenerated?.({
        ...data,
        url: `${window.location.origin}/f/${token}`,
});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (linkData?.url) {
      navigator.clipboard.writeText(linkData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        disabled={!isPublished || loading}
        onClick={handleGenerateLink}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Generating...' : 'Get Shareable Link'}
      </button>

      {error && <p className="text-red-500 text-xs mt-1 absolute">{error}</p>}

      
    </div>
  );
}