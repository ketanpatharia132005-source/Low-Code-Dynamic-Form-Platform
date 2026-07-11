import React, { useState } from 'react';

export default function ShareLinkWidget({ formId, isPublished, versionNumber }) {
  const [linkData, setLinkData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateLink = async () => {
    setLoading(true);
    setError('');
    try {
      
      const response = await fetch(`http://localhost:8001/forms/${formId}/generate-link`, {
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
      setLinkData(data);
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

      {linkData && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg z-50">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Shareable Link (Public)</h4>
          <p className="text-xs text-gray-500 mb-3">Anyone with this link can view the form.</p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              readOnly
              value={linkData.url}
              className="block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1.5 text-xs text-gray-600 outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-xs rounded-md transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="text-[11px] text-gray-400">
            Link is tied to: <span className="font-semibold text-gray-600">Version {linkData.form_version_id} (Published)</span>
          </div>
        </div>
      )}
    </div>
  );
}