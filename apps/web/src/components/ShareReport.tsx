'use client'

import React, { useState } from 'react'
import { ExpensesAPI } from '@api'

export const ShareReport: React.FC = () => {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const expensesAPI = new ExpensesAPI()

  const generateShareableReport = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      
      const report = await expensesAPI.generateShareableReport()
      const url = `${window.location.origin}/shared-report/${report.id}`
      setShareUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!shareUrl) return
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    }
  }

  const shareViaWebAPI = async () => {
    if (!shareUrl || typeof navigator === 'undefined' || !navigator.share) return

    try {
      await navigator.share({
        title: 'My Expense Report',
        text: 'Check out my expense report',
        url: shareUrl
      })
    } catch (err) {
      // User cancelled sharing or error occurred
      console.log('Share cancelled or failed:', err)
    }
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
        📤 Share Expense Report
      </h3>
      
      <p style={{ 
        fontSize: '14px', 
        color: 'var(--secondary-color)', 
        marginBottom: '20px',
        lineHeight: '1.5'
      }}>
        Generate a shareable link to your expense summary that you can send to friends, 
        family, or team members. The shared report includes your total spending and 
        category breakdown.
      </p>

      {error && (
        <div style={{ 
          background: '#FFEBEE',
          color: 'var(--error-color)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {!shareUrl ? (
        <button
          onClick={generateShareableReport}
          disabled={isGenerating}
          className="button button-primary button-full"
        >
          {isGenerating ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="spinner"></div>
              Generating Report...
            </div>
          ) : (
            'Generate Shareable Report'
          )}
        </button>
      ) : (
        <div>
          <div style={{ 
            background: 'var(--background)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            marginBottom: '16px',
            border: '1px solid var(--border-color)'
          }}>
            {shareUrl}
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: (typeof navigator !== 'undefined' && navigator.share) ? '1fr 1fr' : '1fr',
            gap: '12px'
          }}>
            <button
              onClick={copyToClipboard}
              className="button button-secondary"
            >
              📋 Copy Link
            </button>

            {(typeof navigator !== 'undefined' && navigator.share) && (
              <button
                onClick={shareViaWebAPI}
                className="button button-primary"
              >
                📱 Share
              </button>
            )}
          </div>

          <div style={{ 
            fontSize: '12px', 
            color: 'var(--secondary-color)',
            textAlign: 'center',
            marginTop: '12px'
          }}>
            This link will remain active and show your current expense data
          </div>
        </div>
      )}
    </div>
  )
}
